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

  'ProjectsCtrl': function ProjectsCtrl($scope, $location, $route, $routeParams, $resource) {
    var routeChange = function routeChange() {
      $scope.project = _.findWhere($scope.projects, {_id: $routeParams.p_id});
      if (!$scope.selectedProject) {
        $scope.selectedProject = $scope.project;
      }
    };

    $scope.$on("$routeChangeSuccess", routeChange);

    $scope.setBackground = function (background) {
      $scope.background = background;
    };

    $scope.changeProject = function () {
      var project = $scope.selectedProject;
      $location.path('/' + (project ? project._id : ''));
    };

    projects($resource).query(function (projectList) {
      $scope.projects = projectList;
      routeChange();
    });
  },

  'MockupCtrl': function MockupCtrl($scope, $resource) {
    // Handle changes to the currently selected project.
    $scope.$watch('project', function (project) {
      console.log("Got project of " + project);
      if (!project) {
        $scope.mockups = null;
        $scope.mockup = null;
        //$scope.setBackground('');
        return;
      }
      mockups($resource).query({p_id: project._id}, function (mockupList) {
        $scope.mockups = mockupList;
        if (mockupList.length > 0) {
          $scope.mockup = {};
          $scope.mockup._id = mockupList[0]._id;
          $scope.mockup.name = mockupList[0].name;
          $scope.mockup.image = 'background-image: url("/r/images/bugzilla-loading.png");';
          $scope.mockup.width = 'width: 100%;';
          $scope.mockup.height = 'height: 100%;';
          $scope.mockup.position = 'background-position: 45%;';
          var image = mockupList[0].image;
          if (!image) {
            image = '/r/images/default.png';
          }
          var ctx = document.getElementById('background-canvas').getContext('2d');
          loadImage(image, function MockupView_loadImage(img) {
            ctx.drawImage(img, 1 - img.width, 1 - img.height);
            var imgData = ctx.getImageData(0, 0, 1, 1);
            var pixel = 'background-color: rgb(' + imgData.data[0] + ',' + imgData.data[1] + ',' + imgData.data[2] + ');';
            $scope.$apply(function () {
              $scope.mockup.image = 'background-image: url("' + image + '");';
              if (mockupList[0].image) {
                $scope.mockup.width = 'width: ' + img.width + 'px;';
                $scope.mockup.height = 'height: ' + img.height + 'px;';
                $scope.mockup.position = '';
              }
              $scope.setBackground(pixel);
            });
          });
        }
      });
    });

    // Handle changes to the currently selected mockup.
    $scope.$watch('mockup', function (mockup) {
      console.log("Got mockup of " + mockup);

      if (!mockup) {
        $scope.bugs = null;
        return;
      }

      bugs($resource).query({m_id: mockup._id}, function (bugList) {
        $scope.mockup.bugs = bugList;
      });
    });
  }
});
