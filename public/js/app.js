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
  ['restangular', 'foxographApp.services', 'angular-tools.persona', 'angular-tools.image'])
  .config(['$routeProvider', '$locationProvider', 'RestangularProvider', function ($routeProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/').when('/:p_id').when('/:p_id/:m_id').otherwise({redirectTo: '/'});
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({id: "_id"});
  }]);