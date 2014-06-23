/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global foxographApp:false */

'use strict';

/* Filters */

foxographApp.filter('statusClass', function styleFactory() {
  return function statusClass(bug) {
    if (!bug) {
      return '';
    }

    if (!bug.status) {
      return 'loading';
    }

    var status = 'atRisk';
    if (bug.status === 'RESOLVED' || bug.status === 'VERIFIED') {
      if (bug.resolution === 'FIXED') {
        status = 'complete';
      } else if (bug.resolution === 'DUPLICATE') {
        status = 'duplicate';
      } else if (bug.resolution === 'INVALID') {
        status = 'atRisk';
      } else if (bug.resolution === 'WONTFIX') {
        status = 'atRisk';
      } else if (bug.resolution === 'WORKSFORME') {
        status = 'atRisk';
      } else if (bug.resolution === 'INCOMPLETE') {
        status = 'atRisk';
      } else if (bug.blocking === '?') {
        status = 'nominated';
      } else if (bug.blocking.substr(-1) === '+') {
        status = 'blocking';
      } else if (bug.assigned === 'Nobody; OK to take it and work on it') {
        status = 'grassRoots';
      }
    }
    return 'done ' + status;
  };
}).filter('statusText', function styleFactory() {
  return function statusText(bug) {
    if (!bug || !bug.status) {
      return '';
    }

    var status = 'At Risk';
    if (bug.status === 'RESOLVED' || bug.status === 'VERIFIED') {
      if (bug.resolution === 'FIXED') {
        status = 'Fixed';
      } else if (bug.resolution === 'DUPLICATE') {
        status = 'Duplicate';
      } else if (bug.resolution === 'INVALID') {
        status = 'Invalid';
      } else if (bug.resolution === 'WONTFIX') {
        status = 'Won\'t Fix';
      } else if (bug.resolution === 'WORKSFORME') {
        status = 'Works for Me';
      } else if (bug.resolution === 'INCOMPLETE') {
        status = 'Incomplete';
      } else if (bug.blocking === '?') {
        status = 'Nominated';
      } else if (bug.blocking.substr(-1) === '+') {
        status = 'Blocker';
      } else if (bug.assigned === 'Nobody; OK to take it and work on it') {
        status = 'Grassroots';
      }
    }
    return status;
  };
}).filter('assignedClass', function styleFactory() {
  return function assignedClass(bug) {
    if (!bug || !bug.assigned) {
      return '';
    }

    var assigned = 'inactive';
    if (bug.assigned !== 'Nobody; OK to take it and work on it') {
      assigned = 'active';
    }
    return assigned;
  };
}).filter('assignedText', function styleFactory() {
  return function assignedText(bug) {
    if (!bug || !bug.assigned) {
      return '';
    }

    var assigned = 'Unassigned';
    if (bug.assigned !== 'Nobody; OK to take it and work on it') {
      assigned = bug.assigned;
    }
    return assigned;
  };
}).filter('blockingClass', function styleFactory() {
  return function blockingClass(bug) {
    if (!bug || !bug.blocking) {
      return '';
    }

    var blocking = 'inactive';
    if (bug.blocking !== null) {
      if (bug.blocking.substr(-1) === '+') {
        blocking = 'active';
      } else if (bug.blocking === '-') {
        blocking = 'rejected';
      } else if (bug.blocking === '?') {
        blocking = 'inactive';
      }
    }
    return blocking;
  };
}).filter('blockingText', function styleFactory() {
  return function blockingText(bug) {
    if (!bug || !bug.blocking) {
      return '';
    }

    var blocking = 'Not blocking';
    if (bug.blocking !== null) {
      if (bug.blocking.substr(-1) === '+') {
        blocking = 'Blocking';
      } else if (bug.blocking === '-') {
        blocking = 'Blocking rejected';
      } else if (bug.blocking === '?') {
        blocking = 'Nominated';
      }
    }
    return blocking;
  };
}).filter('filterThemes', function() {
   return function(projects, themes) {
    if (themes.length === 0) {
      return projects;
    } else {
      var filteredProjects = [];
      var themesMap = {};
      for (var i = 0; i < themes.length; i++) {
        themesMap[themes[i]._id] = true;
      }
      for (i = 0; i < projects.length; i++) {
        for (var k = 0; k < projects[i].themes.length; k++) {
          if (themesMap[projects[i].themes[k]._id]) {
            filteredProjects.push(projects[i]);
            break;
          }
        }
      }
      return filteredProjects;
    }
  }; /* redundant but we want an OR relatioship within products and themes, and AND between */
}).filter('filterProducts', function() {
   return function(projects, products) {
    if (products.length === 0) {
      return projects;
    } else {
      var filteredProjects = [];
      var productsMap = {};
      for (var i = 0; i < products.length; i++) {
        productsMap[products[i]._id] = true;
      }
      for (i = 0; i < projects.length; i++) {
        for (var k = 0; k < projects[i].products.length; k++) {
          if (productsMap[projects[i].products[k]._id]) {
            filteredProjects.push(projects[i]);
            break;
          }
        }
      }
      return filteredProjects;
    }
  };
}).filter('active', function() {
  return function(items) {
    return _.filter(items, function(item) {
      return !item.archived;
    });
  };
}).filter('archived', function() {
  return function(items) {
    return _.filter(items, function(item) {
      return item.archived;
    });
  };
});
