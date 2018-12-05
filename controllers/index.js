var template = require('../views/template-home');  
var controllerMain = require("./helpers/generic-controller");

exports.get = function(request, response) {
    controllerMain.get(request, response, template);    
}