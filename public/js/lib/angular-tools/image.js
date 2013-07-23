/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global angular:false */

'use strict';

/* Directives */

angular.module('angular-tools.image', [])
  .factory('Image', function ($q) {

    var load = function (imageSrc, scope) {
      var deferred = $q.defer();
      var img = new Image();

      var onLoad = function (img, deferred) {
        var ctx = document.getElementById('background-canvas').getContext('2d');
        ctx.drawImage(img, 1 - img.width, 1 - img.height);
        var bottomLeftPixel = ctx.getImageData(0, 0, 1, 1);
        deferred.resolve({
          width: img.width,
          height: img.height,
          r: bottomLeftPixel.data[0],
          g: bottomLeftPixel.data[1],
          b: bottomLeftPixel.data[2]
        });
        scope.$apply();
        img.onload = function () {};
      }.bind(null, img, deferred);

      img.src = imageSrc;
      if (img.complete) {
        setTimeout(onLoad, 0);
      } else {
        img.onload = onLoad;
        img.onerror = function () {
          alert('Could not load image.');
        };
      }
      return deferred.promise;
    };

    return {
      load: load
    };
  });
