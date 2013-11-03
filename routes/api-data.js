/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

"use strict";

var mongoose = require('mongoose');
var error = require('./api-utils').error;
var extend = require('./api-utils').extend;

var BugInfo = mongoose.model('BugInfo', new mongoose.Schema({
  number: String,
  summary: String,
  status: String,
  blocking: String,
  assigned: String
}));

var Bug = mongoose.model('Bug', new mongoose.Schema({
  number: String,
  startX: Number,
  startY: Number,
  endX: Number,
  endY: Number,
  mockup: String
}));

var Mockup = mongoose.model('Mockup', new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  creationDate: Date,
  project: String
}));

var Project = mongoose.model('Project', new mongoose.Schema({
  name: String,
  creationDate: Date,
  user: String
}));


// Projects.

exports.getProjects = function (req, res) {
  console.log('Getting all projects');
  return Project.find(function (err, projects) {
    console.log(JSON.stringify(projects));
    return res.json(projects);
  });
};

exports.postProject = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  if (!req.body || !req.body.name) {
    return error(res, 'Missing name.');
  }
  console.log('Creating project:');
  req.body.user = req.session.email;
  req.body.creationDate = new Date();
  var project = new Project(req.body);
  console.log(project);
  project.save(function (err) {
    if (err) {
      console.error(err);
      return error(res, err, console);
    }
    return res.json(project);
  });
};

exports.getProject = function (req, res) {
  console.log('Getting project ' + req.params.project_id);
  return Project.find({_id: req.params.project_id}, function (err, projects) {
    if (err) {
      return error(res, err, console);
    }
    console.log(JSON.stringify(projects[0]));
    return res.json(projects[0]);
  });
};

exports.deleteProject = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  console.log('Deleting project ' + req.params.project_id);
  Project.findOne({_id: req.params.project_id}, function (err, project) {
    if (project.user !== req.session.email) {
      return error(res, 'Cannot delete a project you didn’t create!');
    }

    // Delete all the mockups and bugs for this project.
    Mockup.find({project: req.params.project_id}, function (err, mockups) {
      if (err) {
        return error(res, err, console);
      }
      mockups.forEach(function (mockup) {
        console.log('  Deleting mockup ' + mockup._id);
        Bug.find({mockup: mockup._id}).remove();
      });
    }).remove();

    // Delete the project itself!
    Project.findOneAndRemove({_id: req.params.project_id}, function (err, project) {
      if (err) {
        return error(res, err, console);
      }
      console.log(JSON.stringify(project));
      return res.json(project);
    });
  });
};


// Mockups.

exports.getMockups = function (req, res) {
  console.log('Looking for mockups for project ' + req.params.project_id);
  return Mockup.find({project: req.params.project_id}, function (err, mockups) {
    if (err) {
      return error(res, err, console);
    }
    // console.log(JSON.stringify(mockups));
    return res.json(mockups);
  });
};

exports.postMockup = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  if (!req.body || !req.body.name) {
    return error(res, 'Missing name.');
  }
  Project.findOne({_id: req.params.project_id}, function (err, project) {
    if (err) {
      return error(res, err, console);
    }
    if (project.user !== req.session.email) {
      return error(res, 'Cannot add a mockup to a project you didn’t create!');
    }
    console.log('Creating mockup:');
    req.body.creationDate = new Date();
    req.body.project = req.params.project_id;
    // req.body.slug = makeSlug(req.body.name);
    var mockup = new Mockup(req.body);
    console.log(mockup);
    mockup.save(function (err) {
      if (err) {
        return error(res, err, console);
      }
      return res.json(mockup);
    });
  });
};

exports.getMockup = function (req, res) {
  console.log('Getting mockup ' + req.params.mockup_id);
  return Mockup.find({_id: req.params.mockup_id}, function (err, mockups) {
    if (err) {
      return error(res, err, console);
    }
    console.log(JSON.stringify(mockups[0]));
    return res.json(mockups[0]);
  });
};

exports.putMockup = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  if (!req.body || !req.body.image) {
    return error(res, 'Missing image.');
  }
  Project.findOne({_id: req.body.project}, function (err, project) {
    if (project.user !== req.session.email) {
      return error(res, 'Cannot update a mockup in a project you didn’t create!');
    }
    console.log('Updating mockup:');
    console.log(req.body);
    var id = req.body._id;
    delete req.body._id;
    Mockup.update({_id: id}, req.body, function (err, mockup) {
      if (err) {
        return error(res, err, console);
      }
      return res.json(mockup);
    });
  });
};



exports.deleteMockup = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  console.log('Deleting mockup ' + req.params.mockup_id);
  Mockup.findOne({_id: req.params.mockup_id}, function (err, mockup) {
    Project.findOne({_id: mockup.project}, function (err, project) {
      if (project.user !== req.session.email) {
        return error(res, 'Cannot delete a project you didn’t create!');
      }

      // Delete all the bugs for this mockup.
      Bug.find({mockup: req.params.mockup_id}).remove();

      // Delete the mockup itself!
      Mockup.findOneAndRemove({_id: req.params.mockup_id}, function (err, mockup) {
        if (err) {
          return error(res, err, console);
        }
        console.log(JSON.stringify(mockup));
        return res.json(mockup);
      });
    });
  });
};


// Bugs.
function returnBugsForMockups(mockups, res) {
  console.log('Looking for bugs for mockups ' + mockups);
  return Bug.find({mockup: {$in: mockups}}, function (err, bugs) {
    if (err) {
      return error(res, err, console);
    }
    var bugNumbers = bugs.map(function (bug) {
      return bug.number;
    });
    return BugInfo.find({number: {$in: bugNumbers}}, function (err, bugInfos) {
      console.log("BW3 -", bugInfos.length, err);
      if (err) {
        return error(res, err, console);
      }
      var retval = bugs.map(function (bug) {
        console.log("BW4 -", bug);
        var bugInfo = bugInfos.filter(function (bugInfo) {
          return bugInfo.number === bug.number;
        });
        console.log("BW4 -", bugInfo.length);
        if (!bugInfo.length) {
          bugInfo = [{
            number: bug.number,
            summary: "This is my bug summary.",
            status: "VERIFIED",
            resolution: "",
            cf_blocking_20: "",
            assigned_to: {"real_name": "Nobody; OK to take it and work on it"}
          }];
        }
        console.log("BW5 -", bugInfo.length ? bugInfo[0] : {});
        console.log("BW6 -", extend(bug, bugInfo.length ? bugInfo[0] : {}));
        return extend(bug.toObject(), bugInfo.length ? bugInfo[0] : {});
      });
      console.log("BW7 - retval", retval);
      return res.json(retval);
    });
  });
}

exports.getBugs = function (req, res) {
  if (req.params.mockup_id) {
    return returnBugsForMockups([req.params.mockup_id], res);
  } else if (req.params.project_id) {
    return Mockup.find({project: req.params.project_id}, function (err, mockups) {
      if (err) {
        return error(res, err, console);
      }
      var keys = mockups.map(function (mockup) {
        return mockup._id;
      });
      return returnBugsForMockups(keys, res);
    });
  }
};


exports.postBug = function (req, res) {
  console.log(req.body);
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  if (!req.body || !req.body.number) {
    return error(res, 'Missing number.');
  }
  Mockup.findOne({_id: req.params.mockup_id}, function (err, mockup) {
    Project.findOne({_id: mockup.project}, function (err, project) {
      if (project.user !== req.session.email) {
        return error(res, 'Cannot add a bug to a project you didn’t create!');
      }
      console.log('Creating bug:');
      req.body.mockup = req.params.mockup_id;

      var bug = new Bug(req.body);
      console.log(bug);
      bug.save(function (err) {
        if (err) {
          return error(res, err, console);
        }
        BugInfo.findOne({number: bug.number}, function (err, bugInfo) {
          if (err) {
            return error(res, err, console);
          }
          if (bugInfo) {
            return extend(bug, bugInfo || {});
          }
          console.log("AAAAAAAA -", err, bugInfo);

        });
      });
    });
  });
};

exports.getBug = function (req, res) {
  console.log('Getting bug ' + req.params.bug_id);
  return Bug.find({_id: req.params.bug_id}, function (err, bugs) {
    if (err) {
      return error(res, err, console);
    }
    console.log(JSON.stringify(bugs));
    return res.json(bugs[0]);
  });
};

exports.deleteBug = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  console.log('Deleting bug ' + req.params.bug_id);
  Bug.findOne({_id: req.params.bug_id}, function (err, bug) {
    Mockup.findOne({_id: bug.mockup}, function (err, mockup) {
      Project.findOne({_id: mockup.project}, function (err, project) {
        if (project.user !== req.session.email) {
          return error(res, 'Cannot delete a bug from a project you didn’t create!');
        }
        bug.remove();
      });
    });
  });
};

exports.getBugInfo = function (req, res) {
  console.log('Getting bug info ' + req.params.bug_id);
  return BugInfo.find({_id: req.params.bug_id}, function (err, bugs) {
    if (err) {
      return error(res, err, console);
    }
    console.log(JSON.stringify(bugs));
    return res.json(bugs[0]);
  });
};

exports.dump = function (req, res) {
  Bug.find(function (err, bugs) {
    if (err) {
      return error(res, err, console);
    }
    Mockup.find(function (err, mockups) {
      if (err) {
        return error(res, err, console);
      }
      Project.find().sort('creationDate').exec(function (err, projects) {
        if (err) {
          return error(res, err, console);
        }
        var rv = [];
        projects.forEach(function (project) {
          var currentProject = {};
          currentProject.name = project.name;
          currentProject.creationDate = project.creationDate;
          currentProject.user = project.user;
          currentProject.mockups = [];
          mockups.filter(function (mockup) {
            return mockup.project === project._id;
          }).forEach(function (mockup) {
            var currentMockup = {};
            currentMockup.image = mockup.image;
            currentMockup.bugs = [];
            bugs.filter(function (bug) {
              return bug.mockup === mockup._id;
            }).forEach(function (bug) {
              var currentBug = {};
              currentBug.number = bug.number;
              currentBug.x = bug.x;
              currentBug.y = bug.y;
              currentMockup.bugs.push(currentBug);
            });
            currentProject.mockups.push(currentMockup);
          });
          rv.push(currentProject);
        });
        console.log(JSON.stringify(rv));
        return res.json(rv);
      });
    });
  });
};
