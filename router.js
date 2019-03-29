var url = require("url");
var fs = require("fs");
var projectController = require("./controllers/projectpage");
var categoryController = require("./controllers/categorypage");
var homeController = require("./controllers/index");
var aboutController = require("./controllers/about");
var errorController = require("./controllers/404");


exports.get = function(request, response) {
    request.requrl = url.parse(request.url, true);
    var path = request.requrl.pathname;
    var extname = String(
        path
        .split(".")
        .pop()
        .toLowerCase()
    );

    var mimeTypes = {
        // "html": "text/html",
        js: "text/javascript",
        css: "text/css",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpg",
        gif: "image/gif",
        ico: "image/x-icon",
        mp4: "video/mp4",
        woff: "application/font-woff",
        ttf: "application/font-ttf",
        eot: "application/vnd.ms-fontobject",
        otf: "application/font-otf",
        svg: "application/image/svg+xml"
    };

    if (mimeTypes[extname] != undefined) {
        response.writeHead(200, {
            "Content-Type": mimeTypes[extname]
        });
        fs.readFile(__dirname + path, "utf8", function(err, data) {
            if (err) throw err;
            response.write(data, "utf8");
            response.end();
        });
    } else {
        testPath(path, request, response);
    }
};

function testPath(url, request, response) {
    var projectList = ["lula", "the-big-picture", "loom", "pans-labyrinth", "art-data", "stairs", "ferro-tiles", "triptychs", "such-fruit", "amplify", "co-green"];

    //current cateories
    var categoryList = [
        "hardware",
        "web-mobile",
        "software",
        "still-motion",
        "materials"
    ];

    var projectId = url.split("/")[3];
    var catId = url.split("/")[1];

    // console.log("project: " + projectId + " category: " + catId + " " + url);

    switch (true) {
        case projectList.indexOf(projectId) != -1:
            request.q = projectId;
            request.sheet = 3;
            // console.log("this is a project page");
            projectController.get(request, response);
            break;
        case categoryList.indexOf(catId) != -1:
        case projectList.indexOf(projectId) === undefined:
            request.q = catId;
            request.sheet = 2;
            // console.log("project category page");
            categoryController.get(request, response);
            break;
        case /home/.test(url):
        case "/" === url:
            request.sheet = 1;
            // console.log("this is a home page");
            homeController.get(request, response);
            break;
        case /about/.test(url):
            // console.log("about page");
            aboutController.get(request, response);
            break;
        default:
            // console.log("no matchy");
            errorController.get(request, response);
            break;
    }
}