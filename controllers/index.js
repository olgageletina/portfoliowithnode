var template = require('../views/template-home');  
var test_data = require('../model/test-data-google-sheet');  //data to be populated through as a promise

exports.get = function(request, response) {
  
  //first promise to get the data
  test_data.getQuery(request.q, request.sheet)
  .then((res) => {
    data = res;
    response.writeHead(200, {
    'Content-Type': 'text/html'
    });    
    var dataString = JSON.stringify(data);
    
    //second promise to generate the template
    template.build(dataString)
      .then((res) => {
        response.write(res);
        response.end();
      })
  }).catch((err) => {
    response.writeHead(404, {
    'Content-Type': 'text/html'
    });
    response.write(err);
    response.end();
  });
};