// This is a controller that requires a call to the google sheet
var errorTemplate = require('../../views/template-404');
var test_data = require('../../model/data-google-sheet');
var data = {};

exports.get = function(request, response, renderView) {
    //first promise to get the data
    test_data
        .getQuery(request.q, request.sheet)
        .then(res => {
            data = res;
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            var dataString = JSON.stringify(data);
            // console.log(dataString); -- delete remove later

            //second promise to generate the template
            return renderView.build(dataString).then(res => {
                // console.log('res', res)
                response.write(res);
                response.end();
            });
        })
        .catch(err => {
            console.log(`ERROR : generic controller :: ${err}`);
            response.writeHead(404, {
                "Content-Type": "text/html"
            });
            errorTemplate.build().then(html => {
                response.write(html);
                response.end();
            });
        });
};