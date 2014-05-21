/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false, run:false */

'use strict';

/* Controllers */

foxographApp.controller({

  'NewMockupCtrl': function NewMockupCtrl($scope, $rootScope, Restangular, $filter, $state) {
    $rootScope.mainTitle = 'Create a new project';
    $rootScope.subTitle = '';
    $rootScope.p_id = null;
    $rootScope.prevMockupId = null;
    $rootScope.nextMockupId = null;
    $scope.project = {};
    $scope.selectedThemes = [];
    $scope.selectedProducts = [];
    $scope.create = function (newProject) {
      var projects = Restangular.all('projects');

      var themes = _.map($scope.selectedThemes, function(theme) {return theme._id});
      var products = _.map($scope.selectedProducts, function(product) {return product._id});
      var mockups = [{name: newProject.mockup}]
      projects.post({name: newProject.name, themes: themes, products: products, mockups: mockups}).then(function (project) {
        $rootScope.projects.push(project);
        $rootScope.projects = $filter('orderBy')($rootScope.projects, ['name', 'user']);
        $state.go('project.mockup', {'p_id': project._id, 'm_id': project.mockups[0]._id});
      });
    };
    $scope.reset = function () {
      $scope.project = {};
      $scope.selectedProducts = [];
      $scope.selectedThemes = [];
    };

    $scope.createTheme = function(theme, cb) {
      var themes = Restangular.all('themes');
      themes.post({name: theme}).then(function (newTheme) {
        $rootScope.themes.push(newTheme);
        cb(newTheme);
      })
    }

    $scope.createProduct = function(product, cb) {
      var products = Restangular.all('products');
      products.post({name: product}).then(function (newProduct) {
        $rootScope.products.push(newProduct);
        cb(newProduct);
      })
    }
  }

});
