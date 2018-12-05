var _ = require("underscore");
var fs = require("fs");
var renderTemplate = require("./helper/render-template");

exports.build = function() {
    var errorJSON = {};
    return renderTemplate //get headHTML in JSON
        .build("headHTML", {})
        .then(result => {
            errorJSON.headerHTML = result;
            return errorJSON;
        })
        .then(errorJSON => { //build the main page
            return renderTemplate.build("404", errorJSON).then(finalHTML => {
                return finalHTML.toString();
            });
        })
        .catch(err => {
            console.log(`ERROR : template-404 :: Failure generating view`);
            throw err;
        });
};