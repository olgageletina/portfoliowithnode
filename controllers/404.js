var template = require('../views/template-main');  
exports.get = function(request, response) {  
  response.writeHead(404, {
    'Content-Type': 'text/html'
  });
  response.write(template.build("404 - Page not found", "Oh noes, it's a 404", "<p>This isn't the page you're looking for...</p>"));
  response.end();
};