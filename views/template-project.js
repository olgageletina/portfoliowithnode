const {
  constructHeader,
  constructBody,
  renderTemplate,
  constructMenu,
  constructScripts,
} = require("./helper/HTML-constructor-helpers");

exports.build = function (features) {
  let dataJSON = JSON.parse(features);

  return makeListContent(dataJSON)
    .then((dataJSON) => constructHeader("project", dataJSON))
    .then((dataJSON) => constructMenu("project", dataJSON))
    .then((dataJSON) => constructScripts("project", dataJSON))
    .then((dataJSON) => constructBody("project", dataJSON))
    .catch((error) => {
      console.log(`ERROR : template-project :: main build function ${error}`);
      throw error;
    });
};

function makeListContent(stuff) {
  let projectJSON = {};
  let contentPromises = []; //create a promise array
  let titlePromise;
  let nextProjectPromise;

  //process data
  for (let i = 0; i < stuff.rows.length; i++) {
    const pInfo = stuff.rows[i];

    if (pInfo.section === "about-project") {
      titlePromise = renderTemplate("projectAbout", {
        pImg: pInfo.img,
        imgDesc: pInfo.imgdesc,
        pslug: pInfo.pslug,
        text: pInfo.text,
        pName: pInfo.pname,
        pDesc: pInfo.description,
        pCats: pInfo.categories.split(","),
      });
      
    } else if (pInfo.section === "content") {
      contentPromises.push(
        renderTemplate("projectContent", {
          divtext: pInfo.divtext,
        })
      ); //push promise to promise array
    } else if (pInfo.section === "next-project") {
      nextProjectPromise = renderTemplate("nextProject", {
        nextImg: pInfo.img,
        nextSlug: pInfo.nextslug,
        nextDescription: pInfo.description,
        nextName: pInfo.nextname,
      });
    }
  }

  let allcontentPromises = Promise.all(contentPromises); //daisy chaining promises – using promise all on the array of content promises

  return Promise.all([titlePromise, allcontentPromises, nextProjectPromise])
    .then((result) => {
      let [title, content, footer] = result;

      projectJSON.projectAboutHTML = title;
      projectJSON.projectContentHTML = content.join("");
      projectJSON.nextProjectHTML = footer;
      return projectJSON;
    })
    .catch((error) => {
      console.log(`ERROR : template-project :: makeListContent`);
      throw error;
    });
}
