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

  // The HeaderCtrl handles getting the list of projects, selecting a
  // project, and automatically selecting the appropriate mockup in that
  // project.
  'HeaderCtrl': function HeaderCtrl($scope, $rootScope, Restangular, $filter, $state) {

    // Load in the projects.
    Restangular.all('projects').getList().then(function (projectList) {
      // Sort the projects by ['name','user'].
      console.log("BW - Loaded projects.");
      $rootScope.projects = $filter('orderBy')(projectList, ['name', 'user']);
    });

    Restangular.all('themes').getList().then(function (themeList) {
      $rootScope.themes = themeList;
    });

    Restangular.all('products').getList().then(function (productList) {
      $rootScope.products = productList;
    });
    
/*
    var pIdChanged = function (p_id) {
      $scope.selectedProject = _.findWhere($rootScope.projects, {_id: p_id});
      $rootScope.mainTitle = 'Please select a project';
      if ($scope.selectedProject) {
        $rootScope.mainTitle = $scope.selectedProject.name;
        // Load in the mockups for that project.
        $scope.selectedProject.all('mockups').getList().then(function (mockupList) {
          // Sort the projects by ['name','user'].
          console.log("BW - Loaded mockups.");
          $rootScope.mockups = $filter('orderBy')(mockupList, ['creationDate']);
        });
      } else {
        $rootScope.mockups = null;
      }
    };
    $rootScope.$watch('p_id', pIdChanged);
    $rootScope.$watch('projects', function () {
      pIdChanged($rootScope.p_id);
    });

    var mIdChanged = function (m_id) {
      $scope.selectedMockup = _.findWhere($rootScope.mockups, {_id: m_id});
      console.log($scope.selectedMockup);
      console.log("BW - setting selected mockup to " + m_id);
      $rootScope.subTitle = '';
      var mockup = _.findWhere($rootScope.mockups, {_id: m_id});
      if (mockup) {
        $rootScope.subTitle = mockup.name;
        // Load in the mockups for that project.
        mockup.all('bugs').getList().then(function (bugList) {
          // Sort the bugs by ['number'].
          console.log("BW - Loaded bugs.", bugList);
          $rootScope.bugs = $filter('orderBy')(bugList, ['number']);
        });
      } else {
        $rootScope.bugs = null;
      }
    };
    $rootScope.$watch('m_id', mIdChanged);
    $rootScope.$watch('mockups', function () {
      mIdChanged($rootScope.m_id);
    });

    // Something about $rootScope.subTitle = $scope.mockup.name;

    $scope.$watch('selectedProject', function (project, oldProject) {
      if (project) {
        $rootScope.m_id = null;
        $state.go('project.index', {'p_id': project._id});
      } else {
        $rootScope.p_id = null;
        $rootScope.m_id = null;
        $state.go('index', {});
      }
    });

    $scope.$watch('selectedMockup', function (mockup, oldMockup) {
      $rootScope.m_id = mockup._id
      $state.go('project.mockup', {'p_id': $rootScope.p_id, 'm_id': mockup._id});
    });



    $scope.addMockup = function (p_id) {
      console.log("Add mockup to:", p_id);
      var title = prompt('Please enter a title for the new mockup.');
      if (!title) {
        return;
      }
      var project = $scope.selectedProject;
      project.all('mockups').post({name: title}).then(function (mockup) {
        project.getList('mockups').then(function (mockupList) {
          console.log("Going to the newly created ", mockup);
          $rootScope.mockups = mockupList;
          $state.go('project.mockup', {'p_id': project._id, 'm_id': mockup._id});
        });
      });
    };
*/
  }
});
