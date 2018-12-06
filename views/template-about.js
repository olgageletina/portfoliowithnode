var { constructHeader, constructBody, renderTemplate } = require("./helper/HTML-constructor-helpers");

exports.build = function() {
    dataJSON = {};
    return constructHeader('about', dataJSON)
        .then(dataJSON => constructBody('about', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-about :: main build function ${error}`);
            throw error;
        });
};