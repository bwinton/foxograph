/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global foxographApp:false */

'use strict';

/* Directives */

foxographApp.directive('listEditor', function (Restangular) {
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
          scope.items = _.map(scope.items, function(item) {
            if (item._id === updatedItem._id) {
              item.name = updatedItem.name;
            }
            return item;
          });
        });
      };

      scope.delete = function(item, $index) {
        if (window.confirm("Permantely delete " + item.name + "?")) {
          item.remove().then(function(item) {
              scope.items.splice($index, 1);
          });
        }
      };
    }
  };
  return directiveDefinitionObject;
});
