/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
   strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
   boss:true, white:true, globalstrict:true, nomen:false, newcap:true */

/*global angular:false */

'use strict';

// Declare app level module which depends on filters, and services
var foxographApp = angular.module('foxographApp',
  ['restangular', 'ui.router', 'angular-tools.persona', 'angular-tools.image'])
  .config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
      $locationProvider.html5Mode(true);

      // Remove trailing slashes…
      $urlRouterProvider.rule(function ($injector, $location) {
        var path = $location.path(), search = $location.search();
        var pathEnd = path.length - 1;
        if (path[pathEnd] === '/') {
          // If it's just a single '/', then leave it.
          // pathEnd = Math.max(pathEnd, 1);
          if (JSON.stringify(search) === '{}') {
            console.log(path.substring(0, pathEnd));
            return path.substring(0, pathEnd);
          } else {
            var params = [];
            angular.forEach(search, function (v, k) {
              params.push(k + '=' + v);
            });
            console.log(path.substring(0, pathEnd) + '?' + params.join('&'));
            return path.substring(0, pathEnd) + '?' + params.join('&');
          }
        }
      });

      $urlRouterProvider.otherwise('/');
      $stateProvider.state('index', {
        url: '/',
        templateUrl: '/r/projectsList.html'
      }).state('create', {
        url: '/create',
        templateUrl: '/r/createBody.html',
        controller: 'NewMockupCtrl'
      }).state('project', {
        abstract: true,
        url: '/p/:p_id',
        templateUrl: '/r/project.html',
        controller: 'ProjectsCtrl'
      }).state('project.index', {
        url: '',
        templateUrl: '/r/mockupsList.html'
      }).state('project.mockup', {
        url: '/:m_id',
        templateUrl: '/r/mockupBody.html',
        controller: 'MockupCtrl'
      });

      RestangularProvider.setBaseUrl('/api');
      RestangularProvider.setRestangularFields({id: "_id"});
    }
  ]);
