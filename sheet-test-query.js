const fs = require('fs');

function makeNeatJSON(data, qry) {
  const mess = data.feed.entry;
  const query = qry;

  let cleanJSON = {};
  let rows = [];

  for (var i = 0; i < mess.length; ++i) {
      let newRow = {};
      const entry = mess[i];
      let keys = Object.keys(entry);
      let retriveRow = query === ''? true : mess[i][`gsx$${query.name}`].$t === query.value; // if query empty get the row's contents else determine whether the row is queried

      if (retriveRow) {
      for (var j = 0; j < keys.length; ++j) {
          var gsxCheck = keys[j].indexOf('gsx$');
          if (gsxCheck > -1) {
              var key = keys[j];
              var name = key.substring(4);
              var content = entry[key];
              var value = content.$t;
              newRow[name] = value;
          }
      }
      rows.push(newRow);
    }
  }
  cleanJSON = { rows };
  return cleanJSON;
};

const getlocalContent = function (file, q) {
    const query = q ||'';

    return new Promise((resolve, reject) => {
        const readFileAsync = fs.readFile(file, (err, data) => {
            try {
                data = JSON.parse(data);
                const parsedData = makeNeatJSON(data, query)
                console.log(parsedData);
                resolve(data);                    

            } catch (err) {
                reject(new Error('Error parsing JSON!'));
            }
        })

    }).catch(error => {
          console.log(error);
          throw error;
    })
};

getlocalContent('all-projects-raw.json', {name: 'pslug', value: 'amplify'});