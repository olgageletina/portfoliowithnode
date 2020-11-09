var url = require("url");
var fs = require("fs");
var projectController = require("./controllers/projectpage");
var homeController = require("./controllers/index");
var errorController = require("./controllers/404");


exports.get = function (request, response) {
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
        svg: "image/svg+xml"
    };

    if (mimeTypes[extname] != undefined) {
        response.writeHead(200, {
            "Content-Type": mimeTypes[extname]
        });
        fs.readFile(__dirname + path, "utf8", function (err, data) {
            if (err) throw err;
            response.write(data, "utf8");
            response.end();
        });
    } else {
        testPath(path, request, response);
    }
};

function testPath(url, request, response) {
    var projectList = ["amplify", "lula", "loom", "putty", "ferro-tiles", "experimental-javascript", "photo-video"];

    var projectId = url.split("/")[1];

    switch (true) {
        case projectList.indexOf(projectId) != -1:
            request.q = projectId;
            request.sheet = 2;
            // console.log("this is a project page");
            projectController.get(request, response);
            break;
        case /home/.test(url):
        case "/" === url:
            request.sheet = 1;
            // console.log("this is a home page");
            homeController.get(request, response);
            break;
        default:
            // console.log("no matchy");
            errorController.get(request, response);
            break;
    }
}