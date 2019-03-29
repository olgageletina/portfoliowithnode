var { constructHeader, constructMenu, constructBody, renderTemplate } = require("./helper/HTML-constructor-helpers");

exports.build = function() {
    dataJSON = {catID: 'about'};
    return constructHeader('about', dataJSON)
    	.then(dataJSON => constructMenu('about', dataJSON))
        .then(dataJSON => constructBody('about', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-about :: main build function ${error}`);
            throw error;
        });
};