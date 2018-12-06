var { constructHeader, constructBody, renderTemplate } = require("./helper/HTML-constructor-helpers");

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    return makeListContent(dataJSON)
        .then(dataJSON => constructHeader('project', dataJSON))
        .then(dataJSON => constructBody('project', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-project :: main build function ${error}`);
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
                renderTemplate("projectIframe", { imgURL: pInfo.img })
            ); //push promise to promise array
        } else if (pInfo.csection === "full") {
            contentPromises.push(
                renderTemplate("projectFull", {
                    imgURL: pInfo.img,
                    text: pInfo.divtext,
                    catID: pInfo.pcat
                })
            ); //push promise to promise array
        } else if (pInfo.csection === "left") {
            contentPromises.push(
                renderTemplate("projectLeft", {
                    imgURL: pInfo.img,
                    text: pInfo.divtext,
                    catID: pInfo.pcat
                })
            ); //push promise to promise array
        } else if (pInfo.csection === "right") {
            contentPromises.push(
                renderTemplate("projectRight", {
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