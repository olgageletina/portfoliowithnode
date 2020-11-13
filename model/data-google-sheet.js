// load the google sheets data in here
// made by using this precedent: https://github.com/55sketch/gsx2json/blob/master/api.js
// and this one: https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/

const speadSheetID = "1s3noi79O9Z9k19jLVm0x34zkIi5wSVzHqLNUptRFuMM";

//fomer database: https://docs.google.com/spreadsheets/d/1s3noi79O9Z9k19jLVm0x34zkIi5wSVzHqLNUptRFuMM/edit?usp=sharing
var https = require('https');

function makeNeatJSON(data, qry) {
    const mess = data.feed.entry;
    const query = qry;

    let cleanJSON = {};
    let rows = [];


    for (var i = 0; i < mess.length; ++i) {
        let newRow = {};
        const entry = mess[i];
        const keys = Object.keys(entry);
        let retriveRow = query === '' ? true : mess[i][`gsx$${query.name}`].$t === query.value; // if query empty get the row's contents else determine whether the row is queried

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

const getContent = function (url, q) {
    // return new pending promise
    const query = q || '';

    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let thing = '';
            let answer = {};

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
                        var cleanData = makeNeatJSON(data, query);
                        // throw new Error('moo');
                        answer = cleanData;

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

exports.getQuery = function (query, page) {
    // default to the second page
    const pg = page || 2;
    const requestURL = `https://spreadsheets.google.com/feeds/list/${speadSheetID}/${pg}/public/values?alt=json`;
    return getContent(requestURL, query);
}

// getQuery('lula', 3).then((res) => console.log(JSON.stringify(res))).catch((err) => console.log(err));