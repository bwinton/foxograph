arewecreatingyet
================

A creator/displayer for areweprettyyet-style dashboards/spec pages.

To get set up, install [mongodb](http://www.mongodb.org/), then type `volo add;npm install`.

To run type `volo debug`.


## Design ##

The main page should show the list of mockups, and let you create one (after logging in with BrowserID).

After choosing a mockup from the list, the first page of the mockup should be displayed, with links to the following pages.

The creation page should let us drag an image to use it as the background, and click anywhere to open an input field which accepts a bug number, and then puts a div at that location which links to bugzilla similarly to [areweprettyyet](http://areweprettyyet.com/thunderbird/).

We should be able to easily link to any page in any mockup.


## Models ##

The main app should have a list of mockups.

Each mockup should have a title, a list of pages, and a creator.

Each page should have a background picture and a list of bugs.

Each bug should have a bug number, and an (x,y) position on the page.

I think that will be enough to get us going.


## Future Enhancements ##

Each mockup could have a list of approved editors.

Having done/not-done summary charts per page and per mockup would be good.

Maybe some burndown charts, too?