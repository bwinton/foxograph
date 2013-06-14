/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global _:true, foxographApp:true */

'use strict';

/* Remote Models */

var projects = function ($resource) {
  return $resource('/api/projects/:p_id');
};

var mockups = function ($resource) {
  return $resource('/api/projects/:p_id/mockups/:m_id');
};

var bugs = function ($resource) {
  return $resource('/api/mockups/:m_id/bugs/:b_id');
};

var projectBugs = function ($resource) {
  return $resource('/api/projects/:p_id/bugs/:b_id');
}

function loadImage(imageSrc, callback)
{
  var img = new Image();
  img.src = imageSrc;
  if (img.complete) {
    setTimeout(function () {
      callback(img);
    }, 0);
    img.onload = function () {};
  } else {
    img.onload = function () {
      callback(img);
      // clear onLoad, IE behaves erratically with animated gifs otherwise
      img.onload = function () {};
    };
    img.onerror = function () {
      alert('Could not load image.');
    };
  }
}


// http://www.jacopretorius.net/2013/04/using-ngresource-with-angularjs.html
// projects.save($scope.newProject, backToList);

/* Controllers */

foxographApp.controller({

  // The ProjectsCtrl handles getting the list of projects, selecting a
  // project, and automatically selecting the appropriate mockup in that
  // project.
  'ProjectsCtrl': function ProjectsCtrl($scope, $location, $route, $routeParams, $resource) {

    // Handle the change in route by setting the various ids.
    var routeChange = function routeChange() {
      console.log("$routeParams (project) = " + JSON.stringify($routeParams));
      $scope.p_id = $routeParams.p_id;
      $scope.m_id = $routeParams.m_id;
    };
    $scope.$on("$routeChangeSuccess", routeChange);


    // Handle a change in project id by setting the project.
    var changeProject = function changeProject() {
      if (!$scope.projects) {
        // console.log("No projects yet.  Skipping " + $scope.p_id + "…");
        return;
      }
      $scope.project = _.findWhere($scope.projects, {_id: $scope.p_id});
      // console.log("$scope.project = " + $scope.project);
    };
    $scope.$watch('p_id', changeProject);


    // Handle a change in mockup id by setting the mockup.
    var changeMockup = function changeMockup() {
      if (!$scope.mockups) {
        //console.log("No mockups yet.  Skipping " + $scope.m_id + "…");
        return;
      }
      $scope.mockup = _.findWhere($scope.mockups, {_id: $scope.m_id});
      // console.log("$scope.mockup = " + $scope.mockup);
    };
    $scope.$watch('m_id', changeMockup);


    // Load in the projects.
    projects($resource).query(function (projectList) {
      $scope.projects = projectList;
      changeProject();
    });


    $scope.$watch('project', function (project) {
      if (!project) {
        $scope.mockups = null;
        $scope.mockup = null;
        $scope.bugs = null;
        //$scope.setBackground('');
        return;
      }
      mockups($resource).query({p_id: project._id}, function (mockupList) {
        $scope.mockups = mockupList;
        changeMockup();
      });
    });

    // Event handlers!
    $scope.setBackground = function setBackground(background) {
      $scope.background = background;
    };

    $scope.onProjectSelect = function onProjectSelect() {
      var project = $scope.selectedProject;
      $location.path('/' + (project ? project._id : ''));
    };


  },

  'MockupCtrl': function MockupCtrl($scope, $route, $routeParams, $resource) {
    // Handle changes to the currently selected project.
    $scope.$watch('project', function (project) {
      if (!project) {
        return;
      }
      projectBugs($resource).query({p_id: project._id}, function (bugList) {
        $scope.bugs = bugList;
        setTimeout(function () {
          $scope.$apply(function () {
            //console.log("Running!  1");
            run();
          });
        }, 15);
      });
    });
    $scope.$watch('mockups', function (mockupList) {
      if (mockupList && mockupList.length > 0) {
        console.log("(Sub) Got mockups!!!");
        // $scope.mockup = {};
        // $scope.mockup._id = mockupList[0]._id;
        // $scope.mockup.name = mockupList[0].name;
        // $scope.mockup.image = 'background-image: url("/r/images/bugzilla-loading.png");';
        // $scope.mockup.width = 'width: 100%;';
        // $scope.mockup.height = 'height: 100%;';
        // $scope.mockup.position = 'background-position: 45%;';
        // var image = mockupList[0].image;
        // if (!image) {
        //   image = '/r/images/default.png';
        // }
        // var ctx = document.getElementById('background-canvas').getContext('2d');
        // loadImage(image, function MockupView_loadImage(img) {
        //   ctx.drawImage(img, 1 - img.width, 1 - img.height);
        //   var imgData = ctx.getImageData(0, 0, 1, 1);
        //   var pixel = 'background-color: rgb(' + imgData.data[0] + ',' + imgData.data[1] + ',' + imgData.data[2] + ');';
        //   $scope.$apply(function () {
        //     $scope.mockup.image = 'background-image: url("' + image + '");';
        //     if (mockupList[0].image) {
        //       $scope.mockup.width = 'width: ' + img.width + 'px;';
        //       $scope.mockup.height = 'height: ' + img.height + 'px;';
        //       $scope.mockup.position = '';
        //     }
        //     $scope.setBackground(pixel);
        //   });
        // });
      }
    });

    // Handle changes to the currently selected mockup.
    $scope.$watch('mockup', function (mockup) {
      //console.log("Got mockup of " + mockup);
      if (!mockup) {
        return;
      }
      setTimeout(function () {
        $scope.$apply(function () {
          //console.log("Running!  2");
          run();
        });
      }, 15);
      bugs($resource).query({m_id: mockup._id}, function (bugList) {
        $scope.mockup.bugs = bugList;
      });
    });
  }
});
