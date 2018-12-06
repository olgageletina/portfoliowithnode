var { constructHeader, constructBody, renderTemplate } = require("./helper/HTML-constructor-helpers");

exports.build = function() {
    dataJSON = {};
    return constructHeader('404', dataJSON)
        .then(dataJSON => constructBody('404', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-404 :: main build function ${error}`);
            throw error;
        });
};