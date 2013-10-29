/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global angular:false, foxographApp:false */

'use strict';

/* Services */


// Demonstrate how to register services
foxographApp.service('modelService', function () {
  this.sayHello = function (text) {
    return "Service says \"Hello " + text + "\"";
  };
  this.sayGoodbye = function (text) {
    return "Service says \"Goodbye " + text + "\"";
  };
});
// I think I should be using these for some of the models, instead of the rootScope, maybe.
