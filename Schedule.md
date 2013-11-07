WORK FLOW!!!
============

* Look at the root.
    * Choose a project.
        * Choose a mockup.


BUGS!!!
=======

* After creating a bug, we don’t see the results of the bug without reloading.

Upcoming Features!
==================

## Version 1.0 ##

* Get it running on [paas.allizom.org](https://foxograph.paas.allizom.org/).
  (2 days.) ✔
    * ✔ Copy the config and readme from cupcake-dashboard.
    * ✘ Pick a new name.
    * ✔ Fix any copy/paste bugs I introduced.

* Let us create new projects.
  (2 days.) ✔
    * ✔ Create the form.
    * ✔ Hook up the back-end
    * ✔ Look into Restangular, to see if it makes sense. (It does!)
    * ✔ Change back-end to handle the protocol that Restangular (or other library) uses.
    * ✔ On Create Project, take us to the new project.

* Store new bugs and mockups on the server.
  (2 days.) ☐
    * ✔ On image drag, save the image to the back-end.
    * ✔ Add front-end code to new bug creation to call store method.
    * ✔ Add front-end code to new mockup creation to call store method.
    * Add front-end code to new project creation to call store method.
    * Add front-end code to refresh display on new bug/mockup/project creation.
    * Add front-end code to bug deletion to call delete method.
    * Add front-end code to mockup deletion to call delete method.
    * Add front-end code to project deletion to call delete method.

## Version 1.1 ##

* Add list view.
  (2 days.) ☐
    * Show all projects and mockups and bugs in tree view.
    * Filter list with text field at the top.
* Look up bug data server-side.
  (3 days.) ☐
    * Store bug data from client into server.
    * Port bugzilla.js to server-side.
    * Use server-side bugzilla.js to populate bug data.
    * Stop looking up bug data on client side.
* Edit bug numbers.
  (1 day.) ☐
    * Select bug makes number editable.
    * Typing in new number re-populates bug data.
    * Figure out how to handle bad bug numbers.
* Edit bug positions.
  (2 days.) ☐
    * Click-and-drag, I think.
    * But not too easy to do, since people might want to click on the bugs to go to the linked bug.
* Edit mockup and project titles.
  (1 day.) ☐
    * Click to edit.
    * Maybe having an "edit" mode for this and above would be better…
    * Talk to Darrin about this.

## Version 1.2 ##

* Add admin console page, if you're me, or an owner.
  (2 days.) ☐
* Add onlogin handlers to the persona directive.
  (1 day.) ☐
* Add collaborators.
  (I don't even know.) ☐

## Version 2.0 (and beyond!) ##

* Handle empty databases.
* Undo stuff?
* Support github issues, too.
* Show previous versions of mockups, perhaps animatedly?
* Add new bug creation functionality.
* Add meta-bug linking to mockup.