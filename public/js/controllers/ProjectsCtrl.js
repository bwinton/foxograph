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

  // The ProjectsCtrl handles getting the list of projects, selecting a
  // project, and automatically selecting the appropriate mockup in that
  // project.
  'ProjectsCtrl': function ProjectsCtrl($scope, $location, $route, $routeParams, Restangular, $filter) {

    // Handle the change in route by setting the various ids.
    var routeChange = function routeChange() {
      console.log("$routeParams (project) = " + JSON.stringify($routeParams));
      $scope.p_id = $routeParams.p_id;
      console.log("1 Setting m_id to " + $routeParams.m_id);
      $scope.m_id = $routeParams.m_id;
    };
    $scope.$on("$routeChangeSuccess", routeChange);


    // Handle a change in project id by setting the project.
    var changeProject = function changeProject() {
      if (!$scope.projects) {
        return;
      }
      if (!$scope.p_id) {
        // $scope.p_id = $scope.projects[0]._id;
        $scope.project = null;
        $scope.selectedProject = $scope.project;
        $scope.mockup = null;
        return;
      }
      $scope.project = _.findWhere($scope.projects, {_id: $scope.p_id});
      $scope.selectedProject = $scope.project;
      $scope.onProjectSelect();
    };
    $scope.$watch('p_id', changeProject);


    // Handle a change in mockup id by setting the mockup.
    var changeMockup = function changeMockup() {
      if (!$scope.mockups) {
        return;
      }
      if (!$scope.p_id) {
        $scope.project = null;
        $scope.selectedProject = $scope.project;
        $scope.mockup = null;
        return;
      }
      if ($scope.p_id && !$scope.m_id) {
        console.log("2 Setting m_id to " + $scope.mockups[0]._id);
        $location.path('/' + $scope.mockups[0].project + '/' + $scope.mockups[0]._id);
        return;
      }
      $scope.mockup = _.find($scope.mockups, function (mockup) {
        return mockup._id === $scope.m_id;
      });
      if (!$scope.mockup) {
        // Probably an old m_id from a previously-selected project.
        console.log("3 Setting m_id to " + $scope.mockups[0]._id);
        $scope.mockup = $scope.mockups[0];
        $location.path('/' + $scope.mockup.project + '/' + $scope.mockup._id);
        return;
      }
      var mockupIndex = _.indexOf($scope.mockups, $scope.mockup);
      $scope.prevMockupId = (mockupIndex > 0) ?
                            $scope.mockups[mockupIndex - 1]._id : null;
      $scope.nextMockupId = (mockupIndex < $scope.mockups.length - 1) ?
                            $scope.mockups[mockupIndex + 1]._id : null;
      console.log("$scope.mockup = " + $scope.mockup);
    };
    $scope.$watch('m_id', changeMockup);


    // Load in the projects.
    $scope.loadProjects = function (p_id) {
      Restangular.all('projects').getList().then(function (projectList) {
        // Sort the projects by ['name','user'].
        $scope.projects = $filter('orderBy')(projectList, ['name', 'user']);
        if (p_id) {
          $scope.p_id = p_id;
        } else {
          changeProject();
        }
      });
    };
    $scope.loadProjects();

    $scope.deleteProject = function (project) {
      alert('deleting project ' + project.name);
      project.remove().then(function (data) {
        $scope.projects = _.without($scope.projects, project);
        $scope.p_id = null;
        console.log("4 Setting m_id to null.");
        $location.path('/' + $scope.mockups[0].project);
      });
    };

    $scope.addMockup = function (project) {
      project.all('mockups').post({name: 'Add name here…'}).then(function (mockup) {
        project.getList('mockups').then(function (mockupList) {
          $scope.mockups = _.sortBy(mockupList, function (mockup) {
            return mockup.creationDate;
          });
          console.log("5 Setting m_id to " + mockup._id);
          $location.path('/' + mockup.project + '/' + mockup._id);
        });
      });
    };

    $scope.deleteMockup = function (mockup) {
      var index = _.indexOf($scope.mockups, mockup);
      console.log("6 deleting " + mockup._id);
      mockup.remove().then(function (data) {
        $scope.mockups = _.without($scope.mockups, mockup);
        if (index >= $scope.mockups.length) {
          index = $scope.mockups.length - 1;
        }
        if (index < 0) {
          index = 0;
        }
        var nextMockup = null;
        if ($scope.mockups.length > 0) {
          nextMockup = $scope.mockups[index];
        }
        console.log("6 Setting m_id to " + nextMockup._id);
        $location.path('/' + nextMockup.project + '/' + nextMockup._id);
      });
    };

    // If we get a project, load in the mockups.
    $scope.$watch('project', function (project) {
      if (!project) {
        $scope.mockups = null;
        $scope.mockup = null;
        $scope.prevMockupId = null;
        $scope.nextMockupId = null;
        $scope.bugs = null;
        $scope.setBackground('');
        return;
      }
      project.getList('mockups').then(function (mockupList) {
        $scope.mockups = _.sortBy(mockupList, function (mockup) {
          return mockup.creationDate;
        });
        changeMockup();
      });
    });

    // Event handlers!
    $scope.setBackground = function setBackground(background) {
      $scope.background = background;
    };

    $scope.onProjectSelect = function onProjectSelect() {
      var project = $scope.selectedProject;
      // If we have no project, that means they selected the "Create New Project" option!
      $location.path('/' + (project ? project._id : 'create'));
    };
  }

});
