//reframe html + JS template to this format
exports.build = function(title, pagetitle, content) {  
  return ['<!doctype html>',
  '<html lang="en">',
  '<meta charset="utf-8">',
  '<title>{title}</title>',
  '<link rel="stylesheet" href="/assets/style.css" />',
  '<h1>{pagetitle}</h1>',
  '<div id="content">{content}</div>']
  .join('')
  .replace(/{title}/g, title)
  .replace(/{pagetitle}/g, pagetitle)
  .replace(/{content}/g, content);
};