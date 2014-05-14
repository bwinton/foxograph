arewecreatingyet
================

A creator/displayer for areweprettyyet-style dashboards/spec pages.

## Installation ##

Ensure the following are installed:

* [mongodb](http://www.mongodb.org/)
* [grunt](http://gruntjs.com/getting-started)

Then do the following:

1. `npm install` There will be some warnings, they can be ignored
2. Create a `grunt-settings.json` file with the following contents changing the file path to your local firefox installation:
```
{
	"firefox_bin": "/Applications/Firefox.app/Contents/MacOS/firefox-bin"
}
``` 

To run: `grunt debug`

Notes:

* If the task hangs on `Running "debug" task` start `mongod` separately and try again
* If a browser tab isn't opened automatically you can manually navigate to `127.0.0.1:3000`


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