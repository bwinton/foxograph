/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false */

'use strict';

/* Directives */

foxographApp.directive('mockupImage', function ($http) {
  var directiveDefinitionObject = {
    restrict: 'A',
    scope: false,

    link: function userPostLink(scope, iElement, iAttrs) {
      iElement.on('dragover', function () {
        iElement.addClass('hover');
        return false;
      });
      iElement.on('dragleave', function () {
        iElement.removeClass('hover');
        return false;
      });
      iElement.on('drop', function (e) {
        e.preventDefault();

        iElement.removeClass('hover');

        var data = e.dataTransfer;
        if (!data) {
          data = e.originalEvent.dataTransfer;
        }

        var file = data.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
          scope.$apply(function () {
            scope.mockup.image = event.target.result;
          });
        };
        reader.readAsDataURL(file);

        return false;
      });
    }
  };
  return directiveDefinitionObject;
});