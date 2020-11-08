const _ = require("underscore");
const fs = require("fs");

const renderTemplate = function(_templateName, _data) {
    return new Promise((resolve, reject) => {
        return fs.readFile(
            "/templates/" + _templateName + ".html",
            // "./templates/" + _templateName + ".html",
            (err, _templateString) => {
                //when testing locally make sure that the path is adjusted as needed
                // console.log(_templateString);
                if (err) {
                    reject(err);
                } else {
                    let _template = _.template(_templateString.toString());
                    let templateHtml = _template(_data);
                    if (templateHtml) {
                        resolve(templateHtml);

                    } else {
                        reject(new Error(`ERROR : render-template :: faulty data`))
                    }
                }
            }
        );
    }).catch(error => {
        console.log(
            `ERROR : render-template :: renderTemplate error rendering ${_templateName}`
        );
        throw error;
    });
};



exports.build = function(_template, _data) {
    return renderTemplate(_template, _data);
};