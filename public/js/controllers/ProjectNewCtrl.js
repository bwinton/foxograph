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

  'ProjectNewCtrl': function ProjectNewCtrl($scope, $rootScope, Restangular, $filter, $state) {
    $scope.project = {};
    $scope.selectedThemes = [];
    $scope.selectedProducts = [];
    
    $scope.create = function (newProject) {
      var projects = Restangular.all('projects');

      var mockups = [{name: newProject.mockup}]
      projects.post({
        name: newProject.name, 
        themes: $scope.selectedThemes, 
        products: $scope.selectedProducts, 
        mockups: mockups}).then(function (project) {
          console.log(project);
          $rootScope.projects.push(project);
          $rootScope.projects = $filter('orderBy')($rootScope.projects, ['name', 'user']);
          $rootScope.products = _.uniq($rootScope.products.concat(project.products), function(product) {return product._id})
          $rootScope.themes = _.uniq($rootScope.themes.concat(project.themes), function(theme) {return theme._id})
          $state.go('project.mockup', {'project_id': project._id, 'mockup_id': project.mockups[0]._id});
      });
    };

    $scope.reset = function () {
      console.log($scope.selectedThemes);
      console.log($scope.selectedProducts);
      $scope.project = {};
      $scope.selectedProducts = [];
      $scope.selectedThemes = [];
    };
  }
});
