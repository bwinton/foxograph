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
  'ProjectsCtrl': function ProjectsCtrl($scope, $location, $resource) {
    $scope.project = null;
    //$scope.$id = "Projects";
    projects($resource).query(function (projectList) {
      $scope.projects = projectList;
      var p_id = $location.path().slice(3);
      $scope.project = _.findWhere(projectList, {_id: p_id});

      $scope.$watch('project', function (project) {
        if (project) {
          $location.path('/p/' + project._id);
        } else {
          $location.path('/');
          $scope.background = '';
        }
      });

      $scope.setBackground = function (background) {
        $scope.background = background;
      };
    });
  },
  'MockupCtrl': function MockupCtrl($scope, $resource) {
    //$scope.$id = "Project";
    $scope.$watch('project', function (project) {
      if (!project) {
        $scope.mockups = null;
        $scope.mockup = null;
        return;
      }
      mockups($resource).query({p_id: project._id}, function (mockupList) {
        $scope.mockups = mockupList;
        if (mockupList.length > 0) {
          $scope.mockup = {};
          $scope.mockup.image = 'background-image: url("/images/bugzilla-loading.png");';
          $scope.mockup.width = 'width: 100%;';
          $scope.mockup.height = 'height: 100%;';
          $scope.mockup.position = 'background-position: 45%;';
          var image = mockupList[0].image;
          var ctx = document.getElementById('background-canvas').getContext('2d');
          loadImage(image, function MockupView_loadImage(img) {
            ctx.drawImage(img, 1 - img.width, 1 - img.height);
            var imgData = ctx.getImageData(0, 0, 1, 1);
            var pixel = 'background-color: rgb(' + imgData.data[0] + ',' + imgData.data[1] + ',' + imgData.data[2] + ');';
            $scope.$apply(function () {
              $scope.mockup.image = 'background-image: url("' + image + '");';
              if (image !== '/images/default.png') {
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
  }
});
