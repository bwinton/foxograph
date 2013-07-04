/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global angular:false */

'use strict';

/* Directives */

angular.module('angular-tools.persona', [])
  .directive('user', function ($http) {
    var personaOptions = {
      headers: {'Content-Type': 'application/json'},
      transformRequest: function (data) {
        return JSON.stringify(data);
      },
      transformResponse: function (data) {
        var rv;
        try {
          rv = JSON.parse(data);
        } catch (ex) {
          // oh no, we didn't get valid JSON from the server
          rv = {'status': 'exception', 'reason': ex};
        }
        return rv;
      }
    };

    var directiveDefinitionObject = {
      restrict: 'E',
      template: '<div id="user">' +
                '  <div ng-hide="email" class="button login" title="Click to sign in.">sign in</div>' +
                '  <div ng-show="email" class="email" title="Click to sign out.">{{email}}</div>' +
                '</div>',

      link: function userPostLink(scope, iElement, iAttrs) {

        // Log in when we click the login button.
        iElement.find('.button.login').on('click', function () {
          navigator.id.get(function (assertion) {
            if (!assertion) {
              return;
            }

            $http.post('/persona/verify', {assertion: assertion}, personaOptions)
              .success(function (data, status, headers, config) {
                if (data.status === 'okay') {
                  console.log(data.email);
                  scope.email = data.email;
                } else {
                  console.log('Login failed because ' + data.reason);
                  scope.email = null;
                }
              }).error(function (data, status, headers, config) {
                console.log('Login failed (' + status + ') with data ' + data);
                scope.email = null;
              });
          });
        });

        // Log out when we click the email address.
        iElement.find('.email').on('click', function () {
          $http.post('/persona/logout', {}, personaOptions)
            .success(function (data, status, headers, config) {
              if (data.status === 'okay') {
                console.log('Logout succeeded.');
                scope.email = null;
              } else {
                console.log('Login failed because ' + data.reason);
                scope.email = null;
              }
            }).error(function (data, status, headers, config) {
              console.log('Logout failed (' + status + ') with data ' + JSON.stringify(data));
              scope.email = null;
            });
        });

      }
    };
    return directiveDefinitionObject;
  });