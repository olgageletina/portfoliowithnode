const {
  constructHeader,
  constructBody,
  constructMenu,
  renderTemplate,
} = require("./helper/HTML-constructor-helpers");

exports.build = function (features) {
  let dataJSON = JSON.parse(features);
  // console.log(dataJSON);

  return makeListContent(dataJSON)
    .then((dataJSON) => constructHeader("index", dataJSON))
    .then((dataJSON) => constructMenu("index", dataJSON))
    .then((dataJSON) => constructBody("index", dataJSON))
    .catch((error) => {
      console.log(`ERROR : template-home :: main build function ${error}`);
      throw error;
    });
};

function makeListContent(stuff) {
  let indexJSON = {};
  let projectPromises = [];

  //process data
  for (let i = 0; i < stuff.rows.length; i++) {
    projectPromises.push(renderTemplate("indexProjectParent", stuff.rows[i]));
  }

  return Promise.all(projectPromises)
    .then((result) => {
      indexJSON.projectHTML = result.join("");
      return indexJSON;
    })
    .catch((error) => {
      console.log(`ERROR : template-home :: makeListContent`);
      throw error;
    });
}
