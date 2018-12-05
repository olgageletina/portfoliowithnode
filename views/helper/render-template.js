var _ = require("underscore");
var fs = require("fs");

const renderTemplate = function(_templateName, _data) {
    return new Promise((resolve, reject) => {
        return fs.readFile(
            "./templates/" + _templateName + ".html",
            (err, _templateString) => {
                //when testing locally make sure that the path is adjusted as needed
                // console.log(_templateString);
                // console.log(err);
                if (err) {
                    // console.log('mooooooooo')
                    reject(err);
                } else {
                    var _template = _.template(_templateString.toString());
                    resolve(_template(_data));
                }
            }
        );
    }).catch(error => {
        console.log(
            `ERROR : template-category :: renderTemplate error rendering ${_templateName}`
        );
        throw error;
    });
};



exports.build = function(_template, _data) {
    return renderTemplate(_template, _data);
};