var { constructHeader, constructMenu, constructBody, renderTemplate } = require('./helper/HTML-constructor-helpers');

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    return makeListContent(dataJSON)
        .then(dataJSON => constructHeader('category', dataJSON))
        .then(dataJSON => constructMenu('category', dataJSON))
        .then(dataJSON => constructBody('category', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-category :: main build function ${error}`);
            throw error;
        });
};



function makeListContent(stuff) {
    var categoryJSON = {};


    var catPromises = [];
    // var titlePromises = [];
    // var imagePromises = [];

    for (var i = 0; i < stuff.rows.length; i++) {
        var itemInfo = {
            name: stuff.rows[i].pname,
            imageURL: stuff.rows[i].pimgurl,
            slug: stuff.rows[i].purl,
            catID: stuff.rows[i].icategory
        };

        itemInfo.url =
            "/" +
            itemInfo.catID +
            "/projects/" +
            itemInfo.slug;

        // console.log(renderTemplate);
        catPromises.push(renderTemplate("categoryDiv", itemInfo));
        // imagePromises.push(renderTemplate("imageDiv", itemInfo));
    }

    var catPromises = Promise.all(catPromises);
    // var getImages = Promise.all(imagePromises);
    // Promise.all([getTitles, getImages])
    // [titlesArr, imagesArr]

    return catPromises
        .then(result => {
            // console.log(result);
            categoryJSON.catID = itemInfo.catID;
            var catArray = result;
            categoryJSON.categoryHTML = catArray.join("");
            // categoryJSON.images = imagesArr.join("");
            // throw new Error('mooooooooo');
            return categoryJSON;
        })
        .catch(error => {
            console.log(`ERROR : template-category :: makeListContent`);
            throw error;
        });
}