/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global _:true */

'use strict';

/* Controllers */

function MockupsCtrl($scope, $location) {
  // Eventually, it should be more like this:
  // $scope.mockups = Mockup.query();
  $scope.mockups = [
    {slug: "test1", shortuser: "bwinton", name: "First Test"},
    {slug: "trial2", shortuser: "jess@mozillafoundation.com", name: "Second Test"},
    {slug: "my_mockup", shortuser: "bwinton", name: "Third Test"},
  ];

  $scope.mockup = _.findWhere($scope.mockups, {slug: $location.path().slice(3)});

  $scope.$watch('mockup', function (mockup) {
    if (mockup) {
      $location.path('/m/' + mockup.slug);
    } else {
      $location.path('/');
    }
  });
}

function MyCtrl1() {
}
MyCtrl1.$inject = [];