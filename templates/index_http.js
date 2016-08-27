---
rename:
  basename: 'index.js'
---
'use strict';

module.exports = function(context, req, res) {
  console.log('webtask executed');
  res.writeHead(200, { 'Content-Type': 'text/html '});
  res.end('<h1>Hello, world!</h1>');
};
