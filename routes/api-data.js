/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
   strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
   moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
   globalstrict:true, nomen:false, newcap:false */

'use strict';

var deferred = require('deferred');
var mongoose = require('mongoose');

var bugzilla = require('./api-bugzilla');
var error = require('./api-utils').error;
var extend = require('./api-utils').extend;

var BugInfo = mongoose.model('BugInfo', new mongoose.Schema({
  number: String,
  summary: String,
  status: String,
  resolution: String,
  blocking: String,
  assigned: String,
  last_got: Date
}));

var Bug = mongoose.model('Bug', new mongoose.Schema({
  number: String,
  startX: Number,
  startY: Number,
  endX: Number,
  endY: Number,
  mockup: String
}));

var mockupSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  creationDate: { type: Date, default: Date.now }
});
var Mockup = mongoose.model('Mockup', mockupSchema);

var Theme = mongoose.model('Theme', new mongoose.Schema({
  name: String
}));

var Product = mongoose.model('Product', new mongoose.Schema({
  name: String
}));

var Project = mongoose.model('Project', new mongoose.Schema({
  name: String,
  creationDate: Date,
  user: String,
  themes: [{type: mongoose.Schema.ObjectId, ref: 'Theme'}],
  products: [{type: mongoose.Schema.ObjectId, ref: 'Product'}],
  mockups: [mockupSchema]
}));



var BUGZILLA_FETCH_DELAY = 4 * 60 * 60 * 1000; // 4 hours.

// Themes
exports.getThemes = function (req, res) {
  return Theme.find(function (err, themes) {
    return res.json(themes);
  });
};

exports.postTheme = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }  
  if (!req.body || !req.body.name) {
    return error(res, 'Missing name.');
  }
  var theme = new Theme(req.body);
  theme.save(function (err) {
    if (err) {
      console.error(err);
      return error(res, err, console);
    }
    return res.json(theme);
  });
};

// Products
exports.getProducts = function (req, res) {
  return Product.find(function (err, products) {
    return res.json(products);
  });
};

exports.postProduct = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }  
  if (!req.body || !req.body.name) {
    return error(res, 'Missing name.');
  }
  var product = new Product(req.body);
  product.save(function (err) {
    if (err) {
      console.error(err);
      return error(res, err, console);
    }
    return res.json(product);
  });
};

// Projects.

exports.getProjects = function (req, res) {
  return Project.find({}).populate('themes').populate('products').exec(function(error, projects) {
    return res.json(projects);
  })
};

/*
exports.getProjects = function (req, res) {
  return Project.find(function (err, projects) {
    return res.json(projects);
  });
};*/

exports.postProject = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  if (!req.body || !req.body.name) {
    return error(res, 'Missing name.');
  }
  req.body.user = req.session.email;
  req.body.creationDate = new Date();
  var project = new Project(req.body);
  project.save(function (err) {
    if (err) {
      console.error(err);
      return error(res, err, console);
    }
    return res.json(project);
  });
};

exports.getProject = function (req, res) {
  return Project.find({_id: req.params.project_id}, function (err, projects) {
    if (err) {
      return error(res, err, console);
    }
    return res.json(projects[0]);
  });
};

exports.deleteProject = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
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
        Bug.find({mockup: mockup._id}).remove();
      });
    }).remove();

    // Delete the project itself!
    Project.findOneAndRemove({_id: req.params.project_id}, function (err, project) {
      if (err) {
        return error(res, err, console);
      }
      return res.json(project);
    });
  });
};


// Mockups.

exports.getMockups = function (req, res) {
  return Mockup.find({project: req.params.project_id}, function (err, mockups) {
    if (err) {
      return error(res, err, console);
    }
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
    req.body.creationDate = new Date();
    req.body.project = req.params.project_id;
    // req.body.slug = makeSlug(req.body.name);
    var mockup = new Mockup(req.body);
    mockup.save(function (err) {
      if (err) {
        return error(res, err, console);
      }
      return res.json(mockup);
    });
  });
};

exports.getMockup = function (req, res) {
  return Mockup.find({_id: req.params.mockup_id}, function (err, mockups) {
    if (err) {
      return error(res, err, console);
    }
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
        return res.json(mockup);
      });
    });
  });
};


// Bugs.

var makeFullBug = function (bug, bugInfo) {
  var retval = {};
  if (bug.toObject) {
    bug = bug.toObject();
  }
  if (bugInfo.toObject) {
    bugInfo = bugInfo.toObject();
  }
  extend(retval, bugInfo, bug);
  return retval;
};

var getBugzillaInfo = function (bug, bugInfo) {
  var def = deferred();
  if (bugInfo.last_got && Date.now() - bugInfo.last_got.getTime() < BUGZILLA_FETCH_DELAY) {
    console.log('Too soon to fetch bug data for', bug.number);
    setTimeout(function () {
      def.resolve(makeFullBug(bug, bugInfo));
    }, 0);
    return def.promise;
  }
  bugzilla.getBug(bug.number, function (err, response, body) {
    var bugzillaInfo = {};
    if (!err && response.statusCode === 200) {
      bugzillaInfo = bugzilla.getInfo(body);
    }
    if (bugzillaInfo.number) {
      var bugInfo = new BugInfo(bugzillaInfo);
      bugInfo.save(function () {
        def.resolve(makeFullBug(bug, bugInfo));
      });
    } else {
      // Figure out how to handle errors.
      // The form is: { error: true, code: 102, message: 'Access Denied' }
      // At the least, we need to remove the bug from the db.
      // Or do we?  For now, let's return the error, and filter it out.
      def.resolve(makeFullBug(bug, body));
    }
  });
  return def.promise;
};

var addBugInfos = function (bugs, callback) {
  var bugNumbers = bugs.map(function (bug) {
    return bug.number;
  });
  BugInfo.find({number: {$in: bugNumbers}}, function (err, bugInfos) {
    if (err) {
      console.error(err);
    }
    deferred.map(bugs, function (bug) {
      var bugInfo = bugInfos.filter(function (bugInfo) {
        return bugInfo.number === bug.number;
      });
      bugInfo = bugInfo.length ? bugInfo[0].toObject() : {};
      // Kick off a bugzilla request.
      return getBugzillaInfo(bug, bugInfo);
    }).then(function (result) {
      result = result.filter(function (bug) {
        return !bug.error;
      });
      callback(result);
    }, function (response) {
      console.log('addBugInfos 5 Error:', response);
      callback(response);
    });
  });
};


function returnBugsForMockups(mockups, res) {
  return Bug.find({mockup: {$in: mockups}}, function (err, bugs) {
    if (err) {
      return error(res, err, console);
    }
    addBugInfos(bugs, function (bugs) {
      return res.json(bugs);
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
      req.body.mockup = req.params.mockup_id;

      var bug = new Bug(req.body);
      bug.save(function (err) {
        if (err) {
          return error(res, err, console);
        }
        addBugInfos([bug], function (bugs) {
          return res.json(bugs);
        });
      });
    });
  });
};

exports.getBug = function (req, res) {
  return Bug.find({_id: req.params.bug_id}, function (err, bugs) {
    if (err) {
      return error(res, err, console);
    }
    addBugInfos(bugs, function (bugs) {
      return res.json(bugs[0]);
    });
  });
};

exports.deleteBug = function (req, res) {
  if (!req.session.email) {
    return error(res, 'Not logged in.');
  }
  Bug.findOne({_id: req.params.bug_id}, function (err, bug) {
    Mockup.findOne({_id: bug.mockup}, function (err, mockup) {
      Project.findOne({_id: mockup.project}, function (err, project) {
        if (project.user !== req.session.email) {
          return error(res, 'Cannot delete a bug from a project you didn’t create!');
        }
        Bug.findOneAndRemove({_id: req.params.bug_id}, function (err, bug) {
          if (err) {
            return error(res, err, console);
          }
          return res.json(bug);
        });
      });
    });
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
        return res.json(rv);
      });
    });
  });
};
