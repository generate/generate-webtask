'use strict';

module.exports = function(context, cb) {
  console.log('webtask executed');
  cb(null, { hello: context.data.name || 'Anonymous' });
};
