var template = require("../views/template-about");
var controllerAux = require("./auxiliary-controller");


exports.get = function(request, response) {
    controllerAux.get(request, response, template);
};