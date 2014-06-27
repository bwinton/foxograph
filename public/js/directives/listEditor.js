/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global foxographApp:false */

'use strict';

/* Directives */

// HACK: theme/product collections were out of sync with themes/products
// internal to projects. We are just refetching everything from the server
// when a theme/product is updated/deleted

foxographApp.directive('listEditor', function ($rootScope, Restangular) {
  var directiveDefinitionObject = {
    restrict: 'E',
    scope: {
      items: '=items'
    },
    templateUrl: '/r/js/directives/listEditor.html',
    link: function userPostLink(scope) {

      scope.save = function(item, name) {
        item.name = name;
        item.put().then(function (updatedItem) {
          $rootScope.load(); // HACK
        });
      };

      scope.delete = function(item, $index) {
        if (window.confirm("Permantely delete " + item.name + "?")) {
          item.remove().then(function(item) {
            $rootScope.load(); // HACK
          });
        }
      };
    }
  };
  return directiveDefinitionObject;
});
