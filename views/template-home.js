var _ = require("underscore");
var fs = require("fs");
var renderTemplate = require("./helper/render-template");

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    return makeListContent(dataJSON)
        .then(projectsHTML => {
            // console.log(projectsHTML);
            return renderTemplate
                .build("headHTML", { path: "" })
                .then(result => {
                    projectsHTML.headerHTML = result;
                    return projectsHTML;
                })
                .then(projectsHTML => {
                    return renderTemplate
                        .build("index", projectsHTML)
                        .then(finalHTML => {
                            return finalHTML.toString();
                        });
                });
        })
        .catch(error => {
            console.log(`ERROR : template-home :: main build function`);
            throw error;
        });
};

function makeListContent(stuff) {
    var contentData = [];
    var indexJSON = {};
    var catArray = [];
    var titlePromises = [];
    var imagePromises = [];
    var currentCat = {};

    //process data
    for (var i = 0; i < stuff.rows.length; i++) {
        var catInfo = stuff.rows[i];
        var catID = stuff.rows[i].icategory;
        var catIndex = catArray.indexOf(catID);

        if (catIndex === -1) {
            //new category
            catArray.push(catID);
            currentCat = {}; //clear current category

            currentCat.catID = catID;
            currentCat.catURL = "/category/" + catID;
            currentCat.catImgs = [];
            contentData.push(currentCat);
            catIndex = catArray.indexOf(catID); //change catIdex to the current index
        }

        if (catInfo.itype === "title") {
            //check to see the type of image

            contentData[catIndex].titleImg = catInfo.iurl;
        } else if (catInfo.itype === "feature") {
            contentData[catIndex].catImgs.push(catInfo.iurl);
        }
    }

    //generate HTML
    for (var i = 0; i < contentData.length; i++) {
        titlePromises.push(
            renderTemplate.build("indexTitleSection", contentData[i])
        );

        imagePromises.push(
            (j => {
                var catImg = contentData[j].catImgs;
                var catTag = contentData[j].catID;
                // console.log('catTag',catTag);
                return renderTemplate
                    .build("indexImgSection", { items: catImg })
                    .then(result => {
                        return renderTemplate.build("indexImgParent", {
                            imgHTML: result,
                            catID: catTag
                        });
                    })
                    .catch(error => {
                        console.log(
                            `ERROR : template-home :: makeListContent error handling index images`
                        );
                        throw error;
                    });
            })(i)
        ); //return a function every i
    }

    var getTitles = Promise.all(titlePromises);
    var getImages = Promise.all(imagePromises);

    return Promise.all([getTitles, getImages])
        .then(result => {
            var [titlesArr, imagesArr] = result;
            indexJSON.titleHTML = titlesArr.join("");
            indexJSON.images = imagesArr.join("");
            return indexJSON;
        })
        .catch(error => {
            console.log(`ERROR : template-home :: makeListContent`);
            throw error;
        });
}