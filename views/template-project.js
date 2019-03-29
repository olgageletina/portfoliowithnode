var { constructHeader, constructMenu, constructBody, renderTemplate } = require('./helper/HTML-constructor-helpers');

exports.build = function(features) {
    var dataJSON = JSON.parse(features);
    return makeListContent(dataJSON)
        .then(dataJSON => constructHeader('project', dataJSON))
        .then(dataJSON => constructMenu('project', dataJSON))
        .then(dataJSON => constructBody('project', dataJSON))
        .catch(error => {
            console.log(`ERROR : template-project :: main build function ${error}`);
            throw error;
        });
};

function makeListContent(stuff) {
    var projectJSON = {};
    var contentPromises = []; //create a promise array
    var headerPromise;

    //process data
    for (var i = 0; i < stuff.rows.length; i++) {
        var pInfo = stuff.rows[i];
        projectJSON.ptitle = pInfo.pname;
        projectJSON.catID = pInfo.icategory;
        projectJSON.pSlug = pInfo.pslug;

        if (pInfo.csection === "about") {
            projectJSON.year = pInfo.year;
            projectJSON.aboutHTML = pInfo.atext;
        } else if (pInfo.csection === "iframe") {
            if (pInfo.type === "header") {
                headerPromise = renderTemplate("projectHeaderIframe", {
                    imgURL: pInfo.img,
                    pslug: pInfo.iframeid,
                    fimageURL: pInfo.fimg
                })
            } else {
                contentPromises.push(
                    renderTemplate("projectHeaderIframe", {
                        imgURL: pInfo.img,
                        pslug: pInfo.iframeid,
                        fimageURL: pInfo.fimg
                    })
                ); //push promise to promise array

            }
        } else if (pInfo.type === "header" && pInfo.csection !== "iframe") {
            headerPromise = renderTemplate("projectHeaderImg", {fimageURL: pInfo.fimg})

        } else if (pInfo.csection === "text" && pInfo.type === "main") {
            contentPromises.push(
                renderTemplate("projectText", {
                    pText: pInfo.divtext
                })
            ); //push promise to promise array
        } 
        else if (pInfo.csection === "image" && pInfo.type !== "header") {
            contentPromises.push(
            (j => {
                var pImg = pInfo.img.toString().split(",");
                return renderTemplate("projectImgSection", { items: pImg })
                    .then(result => {
                        return renderTemplate("projectImgParent", {
                            imgHTML: result
                        });
                    })
                    .catch(error => {
                        console.log(
                            `ERROR : template-home :: makeListContent error handling project images`
                        );
                        throw error;
                    });
            })(i)
        );
        }
    }

    var contentPromises = Promise.all(contentPromises);

    return Promise.all([contentPromises, headerPromise])
        .then(result => {
            var [contentPromisesArr, headerPromise] = result;
            
            projectJSON.mainHTML = contentPromisesArr.join("");
            projectJSON.projectHeader = headerPromise;
            return projectJSON;
        })
        .catch(error => {
            console.log(`ERROR : template-project :: makeListContent`);
            throw error;
        });
}