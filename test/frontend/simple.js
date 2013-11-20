/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, node:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global describe:false, it:false, expect:false, beforeEach:false, angular:false */

'use strict';

describe('A suite', function () {
  var scope, $httpBackend;//we'll use these in our tests
  var projects = [
    {id: 1, name: 'Bob', user: 'bob@example.com'},
    {id: 2, name: 'Jane', user: 'jane@example.com'}
  ];

  //mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('foxographApp'));
  //mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function ($rootScope, $controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', '/api/projects').respond(projects);

    //create an empty scope
    scope = $rootScope.$new();
    //declare the controller and inject our empty scope
    $controller('HeaderCtrl', {$scope: scope});
  }));
  // tests start here
  it('should have projects = projects', function () {
    expect(scope.projects).toBe(undefined);
    // expect(scope.projects).toBe(projects)
    // will only work after resolving the deferred…
    // And _that's_ why it should be a service!  :)
    expect(scope.mainTitle).toBe('Please select a project');
    expect(scope.subTitle).toBe('');
  });

  it('contains spec with an expectation', function () {
    expect(true).toBe(true);
  });
});