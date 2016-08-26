'use strict';

module.exports = function(cb) {
  console.log('webtask executed');
  cb(null, { i_am: 'done ' });
};
