// var http_IP = '127.0.0.1';  
const PORT = process.env.PORT || 5000;
var http = require('http');  

var server = http.createServer(function(request, response) {  
  require('./router').get(request, response);
}); // end server() 
server.listen(PORT);  
console.log('listening to http://' + PORT);  