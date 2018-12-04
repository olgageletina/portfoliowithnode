var template = require('../views/template-project');
var controllerMain = require("./generic-controller");

exports.get = function(request, response) {
    controllerMain.get(request, response, template);    
}