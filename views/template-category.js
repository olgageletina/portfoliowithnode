var _ = require('underscore');
var fs = require('fs');

// exports.build
const generateData = function(thing) {
	// return new Promise((resolve, reject) => {
		var dataJSON = JSON.parse(thing);
        // var projectsHTML;
        return makeListContent(dataJSON)
        .then(projectsHTML => {
            // projectsHTML = html;
                return renderTemplate("headHTML", {path:""})
                    .then(result => {
                        projectsHTML.headerHTML = result; 
                        return projectsHTML;
                    })
            .then((projectsHTML) => {
                // console.log(projectsHTML);
                return renderTemplate("hardware", projectsHTML)
                .then(finalHTML => {
                    return finalHTML.toString();
                });

            });
        })

        // return pageContents;
};

// var dataRead = fs.readFileSync("../model/test-data-project.json")
// generateData(dataRead).then((success) => console.log(success)).catch((error) => console.log(error));

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

    var titlePromises = []
    var imagePromises = []


    for (var i=0;i<stuff.rows.length;i++){

        var itemInfo = {
            name: stuff.rows[i].pname,
            imageURL: stuff.rows[i].pimgurl,
            slug: stuff.rows[i].purl
        };

        itemInfo.url = "/category/" + stuff.rows[i].pcategory + "/projects/" + itemInfo.slug;
        
        titlePromises.push(renderTemplate("titleDiv", itemInfo))
        imagePromises.push(renderTemplate("imageDiv", itemInfo))

    }


    var getTitles = Promise.all(titlePromises)
    var getImages = Promise.all(imagePromises)

    return Promise.all([getTitles, getImages])
    .then((result) => {
        // console.log(result);
        var [titlesArr, imagesArr] = result;
        contentHTML.titleHTML = titlesArr.join('');
        contentHTML.images = imagesArr.join('');
        return contentHTML;
    })

};