/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global _:true */

'use strict';

/* Remote Models */

var mockups = function ($resource) {
  return $resource('/api/mockups/:m_id');
};

var pages = function ($resource) {
  return $resource('/api/mockups/:m_id/pages/:p_id');
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
// mockups.save($scope.newMockup, backToList);

/* Controllers */

function MockupsCtrl($scope, $location, $resource) {
  $scope.mockup = null;
  mockups($resource).query(function (mockupList) {
    $scope.mockups = mockupList;
    var m_id = $location.path().slice(3);
    $scope.mockup = _.findWhere(mockupList, {_id: m_id});

    $scope.$watch('mockup', function (mockup) {
      if (mockup) {
        $location.path('/m/' + mockup._id);
      } else {
        $location.path('/');
        $scope.background = '';
      }
    });

    $scope.setBackground = function (background) {
      $scope.background = background;
    };
  });

}

function MockupCtrl($scope, $resource) {
  $scope.$watch('mockup', function (mockup) {
    if (mockup) {
      pages($resource).query({m_id: mockup._id}, function (pageList) {
        $scope.pages = pageList;
        if (pageList.length > 0) {
          $scope.page = pageList[0];
          $scope.image = 'background-image: url("/images/bugzilla-loading.png");';
          $scope.width = 'width: 100%;';
          $scope.height = 'height: 100%;';
          $scope.position = 'background-position: 45%;';
          var image = pageList[0].image;
          var ctx = document.getElementById('background-canvas').getContext('2d');
          loadImage(image, function PageView_loadImage(img) {
            ctx.drawImage(img, 1 - img.width, 1 - img.height);
            var imgData = ctx.getImageData(0, 0, 1, 1);
            var pixel = 'background-color: rgb(' + imgData.data[0] + ',' + imgData.data[1] + ',' + imgData.data[2] + ');';
            $scope.$apply(function () {
              $scope.image = 'background-image: url("' + image + '");';
              if (image !== '/images/default.png') {
                $scope.width = 'width: ' + img.width + 'px;';
                $scope.height = 'height: ' + img.height + 'px;';
                $scope.position = '';
              }
              $scope.setBackground(pixel);
            });
          });
        }
      });
    }
  });
}
MockupCtrl.$inject = ['$scope', '$resource'];