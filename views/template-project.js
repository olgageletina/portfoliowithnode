var _ = require('underscore');
var fs = require('fs');

// exports.build
const generateData = function(thing) {
        var dataJSON = JSON.parse(thing);
        // console.log(datainput);
        return makeListContent(dataJSON)
        .then(projectsHTML => {
                // console.log(projectsHTML);
                return renderTemplate("headHTML", {path:""})
                    .then(result => {
                        projectsHTML.headerHTML = result; 
                        return projectsHTML;
                    })
            .then(projectsHTML => {
                return renderTemplate("project", projectsHTML)
                .then(finalHTML => {
                    return finalHTML.toString();
                });

            });
        })
};

exports.build = function(features) {
	return generateData(features);
};

const renderTemplate = function (_templateName, _data){
    return new Promise((resolve, reject) => {
    return fs.readFile("./templates/"+ _templateName + ".html", (err, _templateString) => {
        if (err) reject(err);
        var _template =  _.template(_templateString.toString());
        resolve (_template(_data));
        })
    })
};


function makeListContent(stuff){
    var contentHTML = {};
    var contentPromises = []; //create a promise array

    //process data
    for (var i=0;i<stuff.rows.length;i++){
        var pInfo = stuff.rows[i]; 
        contentHTML.ptitle = pInfo.pname;

        if (pInfo.csection === 'about') {
            contentHTML.year = pInfo.year;
            contentHTML.aboutHTML = pInfo.atext;
        }
        else if (pInfo.csection === 'iframe') {
            contentPromises.push(renderTemplate("projectIframe", {imgURL: pInfo.img})); //push promise to promise array
        } else if (pInfo.csection === 'full') {
            contentPromises.push(renderTemplate("projectFull", {imgURL: pInfo.img, text: pInfo.divtext})); //push promise to promise array
        } else if (pInfo.csection === 'left') {
            contentPromises.push(renderTemplate("projectLeft", {imgURL: pInfo.img, text: pInfo.divtext})); //push promise to promise array
        } else  if (pInfo.csection === 'right') {
            contentPromises.push(renderTemplate("projectRight", {imgURL: pInfo.img, text: pInfo.divtext})); //push promise to promise array
        }
    }
    
    return Promise.all(contentPromises)
    .then((result) => {
        contentHTML.rightHTML = result.join('');
        return contentHTML;
    });

};