var _ = require("underscore");
var fs = require("fs");
var renderTemplate = require("./helper/render-template");

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    // console.log(datainput);
    return makeListContent(dataJSON)
        .then(projectJSON => {
            // console.log(projectsHTML);
            return renderTemplate
                .build("headHTML", { path: "" })
                .then(result => {
                    projectJSON.headerHTML = result;
                    return projectJSON;
                })
                .then(projectJSON => {
                    return renderTemplate
                        .build("project", projectJSON)
                        .then(finalHTML => {
                            return finalHTML.toString();
                        });
                });
        })
        .catch(error => {
            console.log(`ERROR : template-project :: main build function`);
            throw error;
        });
};

function makeListContent(stuff) {
    var projectJSON = {};
    var contentPromises = []; //create a promise array

    //process data
    for (var i = 0; i < stuff.rows.length; i++) {
        var pInfo = stuff.rows[i];
        projectJSON.ptitle = pInfo.pname;
        projectJSON.catID = pInfo.pcat;

        if (pInfo.csection === "about") {
            projectJSON.year = pInfo.year;
            projectJSON.aboutHTML = pInfo.atext;
        } else if (pInfo.csection === "iframe") {
            contentPromises.push(
                renderTemplate.build("projectIframe", { imgURL: pInfo.img })
            ); //push promise to promise array
        } else if (pInfo.csection === "full") {
            contentPromises.push(
                renderTemplate.build("projectFull", {
                    imgURL: pInfo.img,
                    text: pInfo.divtext,
                    catID: pInfo.pcat
                })
            ); //push promise to promise array
        } else if (pInfo.csection === "left") {
            contentPromises.push(
                renderTemplate.build("projectLeft", {
                    imgURL: pInfo.img,
                    text: pInfo.divtext,
                    catID: pInfo.pcat
                })
            ); //push promise to promise array
        } else if (pInfo.csection === "right") {
            contentPromises.push(
                renderTemplate.build("projectRight", {
                    imgURL: pInfo.img,
                    text: pInfo.divtext,
                    catID: pInfo.pcat
                })
            ); //push promise to promise array
        }
    }

    return Promise.all(contentPromises)
        .then(result => {
            projectJSON.rightHTML = result.join("");
            return projectJSON;
        })
        .catch(error => {
            console.log(`ERROR : template-project :: makeListContent`);
            throw error;
        });
}