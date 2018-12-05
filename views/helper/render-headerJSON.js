var renderTemplate = require('./render-template');

exports.build = function(templateName, dataJSON) {
    return renderTemplate.build(templateName, dataJSON)
        .then(result => {
            return dataJSON.headerHTML = result;

        }).catch(error => {
            console.log(
                `ERROR : template-category :: render-headerJSON error rendering ${templateName}`
            );
            throw error;
        });
}