/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, define:true */

define(['backbone'], function (Backbone) {
  "use strict";

  var AppRouter = Backbone.Router.extend({
    routes: {
      "m/new": "newMockup",
      "m/:mid": "getMockup",
      "m/:mid/p/:pid": "getPage"
    }
  });

  // Instantiate the router
  var router = new AppRouter();

  return {'router': router};
});