//home controller
var template = require('../views/template-main');  //this is the home template
var test_data = require('../model/test-data');  //data to be populated through
exports.get = function(request, response) {  
  var teamlist = test_data.teamlist;
  var strTeam = "",
    i = 0;
  for (i = 0; i < teamlist.count;) {
    strTeam = strTeam + "<li>" + teamlist.teams[i].country + "</li>";
    i = i + 1;
  }
  strTeam = "<ul>" + strTeam + "</ul>";
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.write(template.build("Test web page on node.js", "Hello there", "<p>The teams in Group " + teamlist.GroupName + " for Euro 2012 are:</p>" + strTeam));
  response.end();
};