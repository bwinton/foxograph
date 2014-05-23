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
      var project = {
        name: newProject.name, 
        themes: $scope.selectedThemes, 
        products: $scope.selectedProducts, 
        mockups: mockups
      }

      projects.post(project).then(function (project) {
          $rootScope.projects.push(project);
          
          // add newly created products to rootscope
          var newProducts = _.where(project.products, function(product) {
            return ! _.some($rootScope.products, {_id: product._id})  
          });
          
          // delete any newly created products that were unsaved
          $rootScope.products = _.filter($rootScope.products.concat(newProducts), "_id");


          // add newly created themes to rootscope
          var newThemes = _.where(project.themes, function(theme) {
            return ! _.some($rootScope.themes, {_id: theme._id})  
          });

          // delete any newly created themes that were unsaved
          $rootScope.themes = _.filter($rootScope.themes.concat(newThemes), "_id");
          
          $state.go('project.mockup', {'project_id': project._id, 'mockup_id': project.mockups[0]._id});
      });
    };

    $scope.reset = function () {
      $scope.project = {};
      $scope.selectedProducts = [];
      $scope.selectedThemes = [];
    };

    $scope.$on('$destroy', function() {
      $rootScope.themes = _.filter($rootScope.themes, "_id");
      $rootScope.products = _.filter($rootScope.products, "_id");
    });
  }
});
