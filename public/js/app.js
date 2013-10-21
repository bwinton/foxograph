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
  ['restangular', 'ui.router', 'foxographApp.services', 'angular-tools.persona', 'angular-tools.image'])
  .config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
      $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/');
      $stateProvider.state('index', {
        url: '/',
        templateUrl: '/r/listBody.html',
        controller: 'ProjectsCtrl'
      }).state('create', {
        url: '/create',
        templateUrl: '/r/createBody.html',
        controller: 'NewMockupCtrl'
      }).state('project', {
        url: '/p/:p_id',
        templateUrl: '/r/displayBody.html',
        controller: 'ProjectsCtrl'
      }).state('mockup', {
        url: '/p/:p_id/:m_id',
        templateUrl: '/r/displayBody.html',
        controller: 'ProjectsCtrl'
      });

      RestangularProvider.setBaseUrl('/api');
      RestangularProvider.setRestangularFields({id: "_id"});
    }
  ]);
