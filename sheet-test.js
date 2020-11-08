const https = require('https');
var pg = 2;
const speadSheetID = "1s3noi79O9Z9k19jLVm0x34zkIi5wSVzHqLNUptRFuMM";


function makeNeatJSON(data, qry) {
  var mess = data.feed.entry;
  var cleanJSON = {};
  var rows = [];
  var query = qry;

  for (var i = 0; i < mess.length; ++i) {
      var keys = Object.keys(mess[i]);
      var newRow = {};
      var entry = mess[i];
      var queried = false;

      for (var j = 0; j < keys.length; ++j) {
          var gsxCheck = keys[j].indexOf('gsx$');
          if (gsxCheck > -1) {
              var key = keys[j];
              var name = key.substring(4);
              var content = entry[key];
              var value = content.$t;
              if (value.indexOf(query.toLowerCase()) > -1) { //previously value was lower cased as well
                  queried = true;
              }
              newRow[name] = value;
          }
      }
      if (queried === true) {
          rows.push(newRow);
      }
  }
  cleanJSON = { rows };
  return cleanJSON;
};

//refactoring as a promise

const getContent = function(url, q) {
  // return new pending promise
  var query = q || '';

  return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
          var thing = '';
          var answer = {};

          // handle http errors
          if (response.statusCode < 200 || response.statusCode > 299) {
              reject(new Error('Failed to load page, status code: ' + response.statusCode));
          }
          // on every content chunk, push it to the data array
          response.on('data', (d) => {
              thing += d;
          });
          // we are done, resolve promise with those joined chunks
          response.on('end', () => {
              if (response.statusCode === 200) {
                // throw new Error('moo');
                  try {
                      data = JSON.parse(thing);
                      var cleanData = makeNeatJSON(data, query);
                      answer = cleanData;
                      console.log(cleanData);                      

                  } catch (e) {
                      // answer [0] = 'Error parsing JSON!';
                      reject(new Error('Error parsing JSON!'));
                  }
              } else {
                  answer = { 'Status': response.statusCode };
              }
              resolve(answer);
          })
      });
      // handle connection errors of the request
      request.on('error', (err) => reject(err))
  }).catch(error => {
    console.log(url);
      console.log(error);
      throw error;
  })
};


getContent(`https://spreadsheets.google.com/feeds/list/${speadSheetID}/${pg}/public/values?alt=json`, '');