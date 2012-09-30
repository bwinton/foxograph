define([], function() {


//bugzillaMockup.js by Alex Faaborg, based on bugzilla.js by Atul Varma
//details on how to leverage this file here: http://people.mozilla.com/~faaborg/files/firefox4Mockups/liveMockups.png


// bugzilla.js by Atul
var Bugzilla = {
  BASE_URL: "https://api-dev.bugzilla.mozilla.org/latest",
  BASE_UI_URL: "https://bugzilla.mozilla.org",
  DEFAULT_OPTIONS: {
    method: "GET"
  },
  getShowBugURL: function Bugzilla_getShowBugURL(id) {
    return this.BASE_UI_URL + "/show_bug.cgi?id=" + id;
  },
  queryString: function Bugzilla_queryString(data) {
    var parts = [];
    for (name in data) {
      var values = data[name];
      if (!values.forEach)
        values = [values];
      values.forEach(
        function(value) {
          parts.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
        });
    }
    return parts.join("&");
  },
  ajax: function Bugzilla_ajax(options) {
    var newOptions = {__proto__: this.DEFAULT_OPTIONS};
    for (name in options)
      newOptions[name] = options[name];
    options = newOptions;

    function onLoad() {
      var response = JSON.parse(xhr.responseText);
      if (!response.error)
        options.success(response);
      // TODO: We should really call some kind of error callback
      // if this didn't work.
    }

    var xhr = options.xhr ? options.xhr : new XMLHttpRequest();
    var url = this.BASE_URL + options.url;

    if (options.data)
      url = url + "?" + this.queryString(options.data);
    xhr.open(options.method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", onLoad, false);
    xhr.send(null);
    return xhr;
  },
  getBug: function Bugzilla_getBug(id, cb) {
    return this.ajax({url: "/bug/" + id,
                      success: cb});
  },
  search: function Bugzilla_search(query, cb) {
    return this.ajax({url: "/bug",
                      data: query,
                      success: cb});
  }
};

//add an onload function to the existing mockup file
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    }
    else {
      window.onload = function() {
      if (oldonload) {
          oldonload();
      }
        func();
      };
    }
}


function run(){
  debug("Loaded bugzilaMockup.js");

  window.scroll(0,0);

  //set up the title and favicon
  //modifyHead();

  //add the navigation and action bar
  //createNavBar();

  //invoke analytics for the page
  //googleAnalytics();

  //Find all of the new divs added in Fireworks and overlay new bug panels
  var newPanels = [];
  var panel;
  var bugNumber;
  var divs =  document.getElementsByTagName("div");
  for(var i = 0; i < divs.length; i++){
    var div = divs[i];

    if(div.id.substr(0,4) == "bug-"){
      //debug("found a bug div: " + div.id);

      bugNumber = div.id.substr(4,6);

      if (document.getElementById("panel-" + bugNumber)) continue;

      var newPanel = document.createElement("div");
      newPanels.push(newPanel);

      newPanel.id = "panel-" + bugNumber;
      newPanel.className = "panel";

      //set the location of the panel based on the Fireworks div
      newPanel.style.top = div.getBoundingClientRect().top + "px";
      newPanel.style.left = div.getBoundingClientRect().left + "px";

      document.body.appendChild(newPanel);
    }
  }

  //Set all of the panels to the loading state so they fade in
  for(var j = 0; j < newPanels.length; j++){
    panel = newPanels[j];

    if(panel.id.substr(0,6) == "panel-"){
      //debug("found a panel div: " + panel.id);

      panel.className = "panel loading";
      panel.innerHTML = "<img src='http://areweprettyyet.com/bugzillaMockup/loading.png'>";
    }

  }

  //Populate each panel with live data from bugzilla
  for(var k = 0; k < newPanels.length; k++){
    panel = newPanels[k];

    if(panel.id.substr(0,6) == "panel-"){
      //debug("found a panel div: " + panel.id);

      bugNumber = panel.id.substr(6,6);

      var bug = Bugzilla.getBug(bugNumber,fillData);
    }
  }

  //set the scroll position if the URL had a hash
  location.hash = location.hash;

}

//Inject an onload event to add the bug data
addLoadEvent(run);


//Populate a specific panel with bug data
function fillData(bug){

  var panel = document.getElementById("panel-" + bug.id);
  var panelClass;
  var blockingClass = "inactive";
  var assignedClass = "inactive";

  var status = "At Risk";
  if(bug.status == "RESOLVED" || bug.status == "VERIFIED"){
    if(bug.resolution == "FIXED"){
      status = "Fixed";
    }
    if(bug.resolution == "DUPLICATE"){
      status = "Duplicate";
    }
    if(bug.resolution == "INVALID"){
      status = "Invalid";
    }
    if(bug.resolution == "WONTFIX"){
      status = "Won't Fix";
    }
    if(bug.resolution == "WORKSFORME"){
      status = "Works for Me";
    }
    if(bug.resolution == "INCOMPLETE"){
      status = "Incomplete";
    }
  }

  var assigned = "Unassigned";
  if(bug.assigned_to.real_name != "Nobody; OK to take it and work on it"){
    assigned = bug.assigned_to.real_name;
    assignedClass = "active";
  }

  var blocking = "Not blocking";
  if(bug.cf_blocking_20 !== null){
    if(bug.cf_blocking_20.substr(-1) === "+"){blocking = "Blocking"; blockingClass = "active";}
    if(bug.cf_blocking_20 == "-"){blocking = "Blocking rejected"; blockingClass = "rejected";}
    if(bug.cf_blocking_20 == "?"){blocking = "Nominated"; blockingClass = "inactive";}
  }

  if(status == "Fixed"){
    panelClass = "complete";
  }
  else if(status == "Duplicate"){
    panelClass = "duplicate";
  }
  else if(status == "Invalid" || status == "Won't Fix" || status == "Works for Me" || status == "Incomplete"){
    panelClass = "atRisk";
  }
  else if(blocking == "Nominated"){
    status = "Nominated";
    panelClass = "nominated";
  }
  else if(blocking == "Blocking" ){
    status = "Blocker";
    panelClass = "blocking";
  }
  else if(assigned != "Unassigned"){
    status = "Grassroots";
    panelClass = "grassRoots";
  }
  else if((blocking == "Not blocking" || blocking == "Blocking rejected") && assigned == "Unassigned"){
    status = "At Risk";
    panelClass = "atRisk";
  }

//  //grab the planned beta from the whiteboard
//  var plannedBeta = "No Target";
//  var plannedClass = "inactive"
//  var whiteboard = bug.whiteboard;
//  if(whiteboard != null){
//    if(whiteboard.match("target-beta9") != null){
//      plannedBeta = "Beta 9";
//      plannedClass = "active";
//    }
//    if(whiteboard.match("target-beta10")){
//      plannedBeta = "Beta 10";
//      plannedClass = "active";
//    }
//    if(whiteboard.match("target-beta11")){
//      plannedBeta = "Beta 11";
//      plannedClass = "active";
//    }
//    if(whiteboard.match("target-beta12")){
//      plannedBeta = "Beta 12";
//      plannedClass = "active";
//    }
//  }




  panel.className = "panel done " + panelClass;

  panel.innerHTML = "<a href='https://bugzilla.mozilla.org/show_bug.cgi?id=" + bug.id + "'>" + bug.id + ", " + bug.summary + "</a><br>" +
  "<span class=" + panelClass + ">" + status + ":</span> " +
  "<span class=" + blockingClass + ">" + blocking + "</span>, " +
//  "<span class=" + plannedClass + ">" + plannedBeta + "</span>, " +
  "<span class=" + assignedClass + ">" + assigned + "</span>";
}

function createNavBar(){

  var newBug = "https://bugzilla.mozilla.org/enter_bug.cgi?alias=&assigned_to=nobody%40mozilla.org&blocked=&bug_severity=normal&bug_status=NEW&cc=faaborg%40mozilla.com&comment=%5BFiled%20from%20the%20visual%20bug%20tracker.%20%20After%20a%20quick%20review%20this%20bug%20may%20appear%20on%20one%20of%20the%20annotated%20mockups%5D&component=General&contenttypeentry=&contenttypemethod=autodetect&contenttypeselection=text%2Fplain&data=&dependson=&description=&flag_type-203=X&flag_type-325=X&flag_type-37=X&flag_type-4=X&flag_type-5=X&flag_type-607=X&flag_type-625=X&flag_type-647=X&flag_type-691=X&flag_type-692=X&form_name=enter_bug&keywords=&maketemplate=Remember%20values%20as%20bookmarkable%20template&op_sys=All&priority=--&product=Firefox&qa_contact=general%40firefox.bugs&rep_platform=All&short_desc=&status_whiteboard=&target_milestone=---&version=unspecified";

  var allBugs = "https://bugzilla.mozilla.org/buglist.cgi?quicksearch=";

  var divs = document.getElementsByTagName("div");
  for(var i=0; i < divs.length; i++){
    var bugs = divs[i];

    if(bugs.id.substr(0,4) == "bug-"){
      var bugNumber = bugs.id.substr(4,6);

      allBugs = allBugs + bugNumber + "%2C";
    }
  }

  debug("allBugs: " + allBugs);

  var bar = document.createElement("div");
  bar.id = "header";
  bar.innerHTML = ""+
    "<div id='nav-main' role='navigation'>" +
      "<ul>" +
        "<li class='first'><a href=''>Clean Up</a>" +
          "<ul>" +
            "<li class='first'><a href='http://areweprettyyet.com/4/mainWindow'>Main Window</a></li>" +
            "<li><a href='https://people.mozilla.com/~jboriss/livemockup/addons_manager.htm'>Add-ons Manager</a></li>" +
            "<li><a href='http://areweprettyyet.com/4/firefoxMenu'>Firefox Menu</a></li>" +
            "<li><a href='http://areweprettyyet.com/4/traditionalMenu'>Traditional Menus</a></li>" +
            "<li><a href='http://areweprettyyet.com/4/notifications'>Notification</a></li>" +
            "<li><a href='javascript:alert(\"Sync mockup is Coming Soon\")'>Coming Soon - Sync</a></li>" +
            "<li><a href='http://areweprettyyet.com/4/syncJpake'>Sync JPAKE</a></li>" +
            "<li><a href='http://areweprettyyet.com/4/panorama')'>Panorama</a></li>" +
          "</ul>" +
        "</li>" +
        "<li class='first'><a href=''>New Projects</a>" +
          "<ul>" +
            "<li><a href='http://areweprettyyet.com/5/syncPromotion'>Sync Promotion</a></li>" +
            "<li><a href='javascript:alert(\"Panorama mockup is Coming Soon\")'>Coming Soon - Panorama</a></li>" +
          "</ul>" +
        "</li>" +
        "<li><a href=''>Actions</a>" +
          "<ul>" +
            "<li class='first'><a href='" + allBugs + "'>View all bugs in a Bugzilla Table</a></li>" +
            "<li><a href='" + newBug + "'>File New Visual Bug</a></li>" +
            "<li><a href='http://people.mozilla.com/~faaborg/files/firefox4Mockups/liveMockups.png'>About</a></li>" +
          "</ul>" +
        "</li>" +
      "</ul>" +
    "</div>";

  document.body.appendChild(bar);
}

function modifyHead(){

  //Title
  document.title = "Are we Pretty Yet?";

  //Favicon
  var favicon = document.createElement("link");
  favicon.innerHTML = "<link rel='icon' type='image/png' href='../../favicon.png' />";
  document.head.appendChild(favicon);
}


function googleAnalytics(){
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-862218-4']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}


function debug(message){
  console.log(message);
}

return {'run': run};

});
