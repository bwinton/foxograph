"use strict";

var mongoose = require('mongoose');
var error = require('./api-utils').error;


// The current user.

exports.getUser = function(req, res) {
  console.log('Getting user');
  console.log(JSON.stringify({'email': req.session.email || ''}));
  return res.json({'email': req.session.email || ''});
};

exports.logout = function(req, res) {
  console.log('Logging out');
  delete req.session.email;
  console.log(JSON.stringify({'email': req.session.email || ''}));
};

// Admin-ish stuff.

exports.deleteAll = function(req, res) {
  console.log('Deleting everything!');
  if (!req.session.email || req.session.email !== 'bwinton@mozilla.com')
    return error(res, 'Not logged in.');
  mongoose.connection.db.dropDatabase(function(err, result) {
    return res.json(err === null ? 200 : 500, {'result': result});
  });
};

exports.dump = function(req, res) {
  Bug.find(function (err, bugs) {
    if (err)
      return error(res, err, console);
    Page.find(function (err, pages) {
      if (err)
        return error(res, err, console);
      Mockup.find().sort('creationDate').exec(function(err, mockups) {
        if (err)
          return error(res, err, console);
        var rv = [];
        mockups.forEach(function (mockup) {
          var currentMockup = {};
          currentMockup.name = mockup.name;
          currentMockup.creationDate = mockup.creationDate;
          currentMockup.user = mockup.user;
          currentMockup.pages = [];
          pages.filter(function (page) {
            return page.mockup == mockup._id;
          }).forEach(function (page) {
            var currentPage = {};
            currentPage.image = page.image;
            currentPage.bugs = [];
            bugs.filter(function (bug) {
              return bug.page == page._id;
            }).forEach(function (bug) {
              var currentBug = {};
              currentBug.number = bug.number;
              currentBug.x = bug.x;
              currentBug.y = bug.y;
              currentPage.bugs.push(currentBug);
            });
            currentMockup.pages.push(currentPage);
          });
          rv.push(currentMockup);
        });
        console.log(JSON.stringify(rv));
        return res.json(rv);
      });
    });
  });
};
