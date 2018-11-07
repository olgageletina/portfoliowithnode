var _ = require('underscore');
var fs = require('fs');

const generateData = function(thing) {
        var dataJSON = JSON.parse(thing);
        return makeListContent(dataJSON)
        .then(projectsHTML => {
                // console.log(projectsHTML);
                return renderTemplate("headHTML", {path:""})
                    .then(result => {
                        projectsHTML.headerHTML = result; 
                        return projectsHTML;
                    })
            .then(projectsHTML => {
                return renderTemplate("index", projectsHTML)
                .then(finalHTML => {
                    return finalHTML.toString();
                });

            });
        })
        .catch(err => {
        console.log('ERRRRRRRR', err);
        throw err;
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

function category(catID, catURL, titleImg, catImgs) {
            this.catID = catID,
            this.catURL = catURL,
            this.titleImg = titleImg,
            this.catImgs = catImgs
};

function makeListContent(stuff){
    var contentData = [];
    var contentHTML = {};
    var catArray = [];
    var titlePromises = []
    var imagePromises = []
    var currentCat = '';
    
    //process data
    for (var i=0;i<stuff.rows.length;i++){
        var catInfo = stuff.rows[i];
        var catID = stuff.rows[i].icategory;
        var catIdex = catArray.indexOf(catID);
        
        if (catIdex === -1 ) {
            catArray.push(catID);
            currentCat = new category(catID, "/category/" + catID, null, []);
            var currentCatJSOn = JSON.stringify(currentCat)
            contentData.push(JSON.parse(currentCatJSOn));
            catIdex = catArray.indexOf(catID); //change catIdex to the current index
        }  

        if (catInfo.itype === 'title') {
            contentData[catIdex].titleImg = catInfo.iurl;
        } else if (catInfo.itype === 'feature') {
            contentData[catIdex].catImgs.push(catInfo.iurl);
        }
    }

    //generate HTML
    for (var i=0;i<contentData.length; i++) {
        console.log('thing');
        var imgInfo = {};
        
        imgInfo.catID = contentData[i].catTag;
        
        titlePromises.push(renderTemplate("indexTitleSection", contentData[i]));
        
        console.log('im here');
        imagePromises.push(
        ((j) => {
        var catImg = contentData[j].catImgs;
        var catTag = contentData[j].catID;
            // console.log('catTag',catTag);
            return renderTemplate("indexImgSection", {items: catImg})
        .then (result =>  {
            return renderTemplate("indexImgParent", {imgHTML: result, catID: catTag})
        })
        .catch(err => {
            console.log('ERRRRRRRR', err);
            throw err;
        })
        })(i)) //return a function every i

    }


    var getTitles = Promise.all(titlePromises)
    var getImages = Promise.all(imagePromises)

    return Promise.all([getTitles, getImages])
    .then((result) => {
        var [titlesArr, imagesArr] = result;
        contentHTML.titleHTML = titlesArr.join('');
        contentHTML.images = imagesArr.join('');
        return contentHTML;
    })
    .catch(err => {
    console.log('Error fulfilling promise arrays', err);
    throw err;
    })
};

