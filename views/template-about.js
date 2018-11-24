var _ = require('underscore');
var fs = require('fs');

const generateData = function() {
    var projectsHTML = {};
    return renderTemplate("headHTML", { path: "" })
        .then(result => {
            projectsHTML.headerHTML = result;
            return projectsHTML;
        })
        .then(projectsHTML => {
            return renderTemplate("about", projectsHTML)
                .then(finalHTML => {
                    return finalHTML.toString();
                })
        })
    .catch(err => {
        console.log('ERRRRRRRR', err);
        throw err;
    })
};



exports.build = function() {
    return generateData();
};

const renderTemplate = function(_templateName, _data) {
    return new Promise((resolve, reject) => {
        return fs.readFile("./templates/" + _templateName + ".html", (err, _templateString) => {
            if (err) reject(err);
            var _template = _.template(_templateString.toString());
            resolve(_template(_data));
        })
    })
};


// generateData().then((success) => console.log(success)).catch((error) => console.log(error));