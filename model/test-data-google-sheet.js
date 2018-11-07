// load the google sheets data in here
// made by using this precedent: https://github.com/55sketch/gsx2json/blob/master/api.js
// and this one: https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/

const speadSheetID = "1s3noi79O9Z9k19jLVm0x34zkIi5wSVzHqLNUptRFuMM";
var https = require('https');

function makeNeatJSON (data, qry) {
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
          if(value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              queried = true;
          }
          newRow[name] = value;
        }
      }
      if (queried === true) {
        rows.push(newRow);  
      }  
    }
  cleanJSON = {rows};       
  return cleanJSON;
};

//refectoring as a promise

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
        try {
          data = JSON.parse(thing);
          var cleanData = makeNeatJSON(data, query)
          // console.log(cleanData);
          answer =  cleanData;

        } catch (e) {
          answer [0] = 'Error parsing JSON!';
        }
      } else {
        answer = {'Status' : res.statusCode};
      }
     resolve(answer); 
      })
    });
// handle connection errors of the request
  request.on('error', (err) => reject(err))
  })
};

exports.getQuery = function(query, page) {
  // default to the second page
  var pg = page || 2;
  var requestURL = `https://spreadsheets.google.com/feeds/list/${speadSheetID}/${pg}/public/values?alt=json`;
  return getContent(requestURL, query);  
}

// getQuery('', 3).then((res) => console.log(JSON.stringify(res))).catch((err) => console.log(err));
