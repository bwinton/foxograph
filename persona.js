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
  .directive('user', function ($http, $location) {
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
      scope: {'loggedInUser' : '=loggedInUser'},
      template: '<div id="user">' +
                '  <a ng-hide="loggedInUser.email || progress" class="button login" title="Click to sign in.">Sign In</a>' +
                '  <p ng-show="progress">Signing In...</p>' +
                '  <p ng-show="loggedInUser.email"><img src="http://avatars.io/email/{{ loggedInUser.email }}" width=24 height=24 /><a class="profileLink" ng-href="/profile">{{ UI.displayName(loggedInUser) }}</a> <small class="text-label">{{ permissions.userType }}</small> |  <a class="email" title="Click to sign out.">Sign Out</a></p>' +
                '</div>',

      link: function userPostLink(scope, iElement, iAttrs) {

        var removeUser = function () {
          delete scope.loggedInUser.email;
        };

        // Log in when we click the login button.
        iElement.find('.button.login').on('click', function () {
          navigator.id.get(function (assertion) {
            if (!assertion) {
              return;
            }
            scope.progress = true;
            scope.$apply(function (e) {
              $http.post('/persona/verify', {assertion: assertion}, personaOptions).success(function (data, status, headers, config) {
                scope.progress = false;
                if (data.status === 'okay') {
                  scope.loggedInUser.email = data.email;
                } else {
                  console.log('Login failed because ' + data.reason);
                  removeUser();
                }
              }).error(function (data, status, headers, config) {
                console.log('Login failed (' + status + ') with data ' + data);
                removeUser();
              });
            });
          });
        });

        // Log out when we click the email address.
        iElement.find('.email').on('click', function () {
          scope.$apply(function (e) {
            $http.post('/persona/logout', {}, personaOptions)
              .success(function (data, status, headers, config) {
                if (data.status === 'okay') {
                  console.log('Logout succeeded.');
                  removeUser();
                  $location.path("/");
                } else {
                  console.log('Login failed because ' + data.reason);
                  removeUser();
                }
              }).error(function (data, status, headers, config) {
                console.log('Logout failed (' + status + ') with data ' + JSON.stringify(data));
                removeUser();
              });
          });
        });

      }
    };
    return directiveDefinitionObject;
  });