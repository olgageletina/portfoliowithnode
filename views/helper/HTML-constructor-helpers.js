const _ = require("underscore");
const fs = require("fs");

function constructHeader(templateName, dataJSON) {
  return renderTemplate("headHTML", dataJSON)
    .then((result) => {
      return Object.assign({}, dataJSON, { headerHTML: result });
    })
    .catch((error) => {
      console.log(
        `ERROR : template-${templateName} :: constructHeader error rendering headHTML`
      );
      throw error;
    });
}

module.exports.constructHeader = constructHeader;

function constructMenu(templateName, dataJSON) {
  return renderTemplate("menu", dataJSON)
    .then((result) => {
      return Object.assign({}, dataJSON, { menu: result });
    })
    .catch((error) => {
      console.log(
        `ERROR : template-${templateName} :: constructHeader error rendering headHTML`
      );
      throw error;
    });
}

module.exports.constructMenu = constructMenu;

function constructScripts(templateName, dataJSON) {
  return renderTemplate("scripts", dataJSON)
    .then((result) => {
      return Object.assign({}, dataJSON, { scripts: result });
    })
    .catch((error) => {
      console.log(
        `ERROR : template-${templateName} :: constructHeader error rendering headHTML`
      );
      throw error;
    });
}

module.exports.constructScripts = constructScripts;

function constructBody(templateName, dataJSON) {
  return renderTemplate(templateName, dataJSON)
    .then((finalHTML) => {
      return finalHTML.toString();
    })
    .catch((error) => {
      console.log(
        `ERROR : template-${templateName} :: constructBody error rendering headHTML`
      );
      throw error;
    });
}

module.exports.constructBody = constructBody;

function renderTemplate(_templateName, _data) {
  return new Promise((resolve, reject) => {
    return fs.readFile(
      "./templates/" + _templateName + ".html",
      (err, _templateString) => {
        //NOTE TO SELF: when testing locally make sure that the path is adjusted as needed
        if (err) {
          // console.log('mooooooooo')
          reject(err);
        } else {
          var _template = _.template(_templateString.toString());
          var templateHtml = _template(_data);
          if (templateHtml) {
            resolve(templateHtml);
          } else {
            reject(new Error(`ERROR : render-template :: faulty data`));
          }
        }
      }
    );
  }).catch((error) => {
    console.log(
      `ERROR : render-template :: renderTemplate error rendering ${_templateName}`
    );
    throw error;
  });
}

module.exports.renderTemplate = renderTemplate;
