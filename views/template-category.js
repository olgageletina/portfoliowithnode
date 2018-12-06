var _ = require("underscore");
var fs = require("fs");
// var renderTemplate = require("./helper/render-template");
var { constructHeader, constructBody, renderTemplate } = require("./helper/HTML-constructor-helpers");

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    return makeListContent(dataJSON)
        .then(dataJSON => constructHeader('category', dataJSON))
        .then(dataJSON => constructBody('category', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-category :: main build function ${error}`);
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

        // console.log(renderTemplate);
        titlePromises.push(renderTemplate("titleDiv", itemInfo));
        imagePromises.push(renderTemplate("imageDiv", itemInfo));
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