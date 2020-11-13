const PORT = process.env.PORT || 5000;
const http = require('http');

const server = http.createServer(function(request, response) {
    require('./router').get(request, response);
}); // end server() 
server.listen(PORT);
console.log('listening to http://' + PORT);