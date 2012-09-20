/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.sendfile('www/index.html');
};

exports.getMockups = function (req, res) {
  return res.json([
    {'name': 'Mockup 1',},
    {'name': 'Mockup 2',}
  ]);
};