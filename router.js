const url = require("url");
const fs = require("fs");
const projectController = require("./controllers/projectpage");
const homeController = require("./controllers/index");
const errorController = require("./controllers/404");

exports.get = function (request, response) {
  request.requrl = url.parse(request.url, true);
  const path = request.requrl.pathname;
  const extname = String(path.split(".").pop().toLowerCase());

  const mimeTypes = {
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
    svg: "image/svg+xml",
  };

  if (mimeTypes[extname] != undefined) {
    if (
      mimeTypes[extname] === "image/x-icon" &&
      path === "/favicon.ico" &&
      request.method === "GET"
    ) {
      response.setHeader("Content-Type", "image/x-icon");
      fs.createReadStream("./favicon.ico").pipe(response);
      return; //favicon fix need to figure out why the PNGs are not working
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[extname],
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
  const projectList = [
    "amplify",
    "lula",
    "putty",
    "ferro-tiles",
    "experimental-javascript",
    "photo-video",
    "archives"
  ];

  const projectId = url.split("/")[1];

  switch (true) {
    case projectList.indexOf(projectId) != -1:
      request.q = { name: "pslug", value: projectId };
      request.sheet = 2;
      projectController.get(request, response);
      break;
    case /home/.test(url):
    case "/" === url:
      request.sheet = 1;
      homeController.get(request, response);
      break;
    default:
      errorController.get(request, response);
      break;
  }
}
