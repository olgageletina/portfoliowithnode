var template = require('../views/template-404');

exports.get = function(request, response) {
    //second promise to generate the template
    template.build()
        .then((res) => {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            response.write(res);
            response.end();
        }).catch((err) => {
            response.writeHead(404, {
                'Content-Type': 'text/html',
            });
            console.log( `ERROR : 404 controller :: ${err}`);
            template.build().then(html => {
                response.write(html);
                response.end();
            });
        });
};