// This is a controller that only relies on a view
var errorTemplate = require("../views/template-404");

exports.get = function(request, response, renderView) {
    renderView.build()
        .then((res) => {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(res);
            response.end();
        }).catch((err) => {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            errorTemplate.build().then(html => {
                response.write(html);
                response.end();
            });
        });
};