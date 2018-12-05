var _ = require("underscore");
var fs = require("fs");
var renderTemplate = require("./helper/render-template");

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    return makeListContent(dataJSON)
        .then(categoryJSON => {
            return renderTemplate
                .build("headHTML", {}) //get headHTML in JSON
                .then(result => {
                    categoryJSON.headerHTML = result;
                    return categoryJSON;
                })
                .then(categoryJSON => { //build the main page
                    return renderTemplate
                        .build("category", categoryJSON)
                        .then(finalHTML => {
                            return finalHTML.toString();
                        });
                });
        })
        .catch(error => {
            console.log(`ERROR : template-category :: main build function`);
            throw error;
        });
};

function makeListContent(stuff) {
    var categoryJSON = {};

    var titlePromises = [];
    var imagePromises = [];

    for (var i = 0; i < stuff.rows.length; i++) {
        var itemInfo = {
            name: stuff.rows[i].pname,
            imageURL: stuff.rows[i].pimgurl,
            slug: stuff.rows[i].purl,
            catID: stuff.rows[i].pcategory
        };

        itemInfo.url =
            "/category/" +
            stuff.rows[i].pcategory +
            "/projects/" +
            itemInfo.slug;

        titlePromises.push(renderTemplate.build("titleDiv", itemInfo));
        imagePromises.push(renderTemplate.build("imageDiv", itemInfo));
    }

    var getTitles = Promise.all(titlePromises);
    var getImages = Promise.all(imagePromises);

    return Promise.all([getTitles, getImages])
        .then(result => {
            // console.log(result);
            categoryJSON.catID = itemInfo.catID;
            var [titlesArr, imagesArr] = result;
            categoryJSON.titleHTML = titlesArr.join("");
            categoryJSON.images = imagesArr.join("");
            // throw new Error('mooooooooo');
            return categoryJSON;
        })
        .catch(error => {
            console.log(`ERROR : template-category :: makeListContent`);
            throw error;
        });
}