/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global foxographApp:false */

'use strict';

/* Directives */

foxographApp.directive('mockupImage', function ($document, Image, Restangular) {
  var directiveDefinitionObject = {
    restrict: 'E',
    scope: true,
    templateUrl: '/r/js/directives/mockupImageTemplate.html',
    link: function userPostLink($scope, iElement) {

      var MAX_WIDTH = 1100;
      var MAX_HEIGHT = 600;
      var BUG_WIDTH = 320;
      var BUG_HEIGHT = 60;
      var pasteboard = angular.element(iElement.children()[0]);
      var svg = angular.element(pasteboard.children()[0]);
      var image = angular.element(svg.children()[0]);

      $scope.loaded = false;
      $scope.error = false;
      $scope.dragging = false;

      $scope.$watch('mockup', function(mockup, oldMockup) {
        // load image
        if ((mockup && mockup.image && (!oldMockup || !oldMockup.image)) ||
            (mockup && oldMockup && mockup.image !== oldMockup.image)) {
          console.log("I should only run once");
          image[0].setAttributeNS("http://www.w3.org/1999/xlink", "href", mockup.image);
          Image.load(mockup.image, $scope).then(function (img) {
            var width = Math.min(img.width, MAX_WIDTH);
            var height = Math.min(img.height, MAX_HEIGHT);
            image[0].setAttribute("x", (MAX_WIDTH - width) / 2);
            image[0].setAttribute("y", (MAX_HEIGHT - height) / 2);
            image[0].setAttribute("width", width);
            image[0].setAttribute("height", height);
            $scope.loaded = true;
          }, function (err) {
            // This would show the error page if the image reader fails?
            // Modeled after existing code using the image reader
            // We are currently getting this error NS_ERROR_NOT_AVAILABLE:
            // This code does not execute, no error page appears
            $scope.error = true;
            $scope.loaded = true;
          });
        } else if (mockup && mockup.image === null) {
          $scope.loaded = true;
        }

        // load bug
        if (mockup && mockup.bugs) {
          if ($scope.bugs === undefined) {
            $scope.bugs = mockup.bugs;
          }
          Restangular.restangularizeCollection(mockup, $scope.bugs, "bugs");
        }
      }, true);

      pasteboard[0].ondragover = function(e) {
        if ($scope.auth.email !== $scope.project.user) {
          e.stopPropagation();
          return false;
        }
        this.classList.add('dragging');
        return false;
      };

      pasteboard[0].ondragleave = function(e) {
        if ($scope.auth.email !== $scope.project.user) {
          e.stopPropagation();
          return false;
        }

        this.classList.remove('dragging');
        return false;
      };

      pasteboard[0].ondrop = function(e) {
        e.preventDefault();
        this.classList.remove('dragging');

        if ($scope.auth.email !== $scope.project.user) {
          e.stopPropagation();
          return false;
        }

        var file = e.dataTransfer.files[0],
        reader = new FileReader();
        reader.onload = function (event) {
          $scope.$apply(function() {
            $scope.mockup.image = event.target.result;
          });
          $scope.mockup.put();
        };
        reader.readAsDataURL(file);
      };

      pasteboard[0].onmousedown = function(e) {

        if ($scope.auth.email !== $scope.project.user) {
          e.stopPropagation();
          return false;
        }

        var pasteboardPos = element_position(pasteboard[0]);
        var offsetTop = pasteboardPos.y;
        var offsetLeft = pasteboardPos.x;

        $scope.dragging = true;

        console.log(e);
        var bug = {
          'mockup': $scope.mockup._id,
          'number': null,
          'startX': e.pageX - offsetLeft,
          'startY': e.pageY - offsetTop,
          'endX': Math.max(0, Math.min(MAX_WIDTH - BUG_WIDTH, e.pageX - offsetLeft)),
          'endY': Math.max(0, Math.min(MAX_HEIGHT - BUG_HEIGHT, e.pageY -offsetTop - (BUG_HEIGHT / 2)))
        };

        $scope.$apply(function () {
          $scope.bugs.push(bug);
          //$scope.setCurrentBug(bug);
          console.log($scope.bugs);
        });

        console.log(pasteboard);

        pasteboard[0].onmousemove = function(e) {
          $scope.$apply(function() {
            var x = e.pageX - offsetLeft;
            var y = (e.pageY - offsetTop) - (BUG_HEIGHT / 2);
            bug.endX = Math.max(0, Math.min(MAX_WIDTH - BUG_WIDTH, x));
            bug.endY = Math.max(0, Math.min(MAX_HEIGHT - BUG_HEIGHT, y));
          });
        };

        pasteboard[0].onmouseup = function(e) {
          pasteboard[0].onmousemove = null;
          pasteboard[0].onmouseup = null;
          $scope.dragging = false;
          var oldBug = bug;
          var number = prompt('Please enter a bug number');
          if (number) {
            bug.number = number;
            $scope.bugs.post(bug).then(function (bug) {
              bug = bug[0];
              bug = Restangular.restangularizeElement($scope.mockup, bug, "bugs");
              $scope.bugs = _.without($scope.bugs, oldBug);
              $scope.bugs.push(bug);
              $scope.bugs = Restangular.restangularizeCollection($scope.mockup, $scope.bugs, "bugs");
            }, function (response) {
              console.log('Error with status code', response);
            });
          } else {
            $scope.$apply(function() {
              $scope.bugs = _.without($scope.bugs, bug);
              $scope.bugs = Restangular.restangularizeCollection($scope.mockup, $scope.bugs, "bugs");
            });
          }
        };
        e.stopPropagation();
        return false;
      };

      /*
       * Thanks to brainjam at SO for this
       * http://stackoverflow.com/questions/5755312/getting-mouse-position-relative-to-content-area-of-an-element
       */

      function getNumericStyleProperty(style, prop){
        return parseInt(style.getPropertyValue(prop),10) ;
      }

      function element_position(e) {
        var x = 0, y = 0;
        var inner = true ;
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
            var style = getComputedStyle(e,null) ;
            var borderTop = getNumericStyleProperty(style,"border-top-width") ;
            var borderLeft = getNumericStyleProperty(style,"border-left-width") ;
            y += borderTop ;
            x += borderLeft ;
            if (inner){
              var paddingTop = getNumericStyleProperty(style,"padding-top") ;
              var paddingLeft = getNumericStyleProperty(style,"padding-left") ;
              y += paddingTop ;
              x += paddingLeft ;
            }
            inner = false ;
        } while (e = e.offsetParent);
        return { x: x, y: y };
      }
    }
  };
  return directiveDefinitionObject;
});
