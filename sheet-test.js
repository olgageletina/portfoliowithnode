const https = require('https');

https.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vT8PHO4-nIucaYFFm3LNMxcL7C1P-MTgGqfq-bQPFPPEy77jGrvkzcNjUqpxi5gNZqGX1gRVXSmupcW/pub?gid=1818722365&single=true&output=tsv', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(data);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});