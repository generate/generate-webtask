'use strict';

var path = require('path');
var through = require('through2');
var isValid = require('is-valid-app');

module.exports = function(app) {
  // return if the generator is already registered
  if (!isValid(app, 'generate-webtask')) return;

  app.use(require('generate-defaults'));

  /**
   * Generate a `index.js` file to the current working directory. Learn how to [customize
   * behavior(#customization) or override built-in templates.
   *
   * ```sh
   * $ gen webtask:webtask
   * ```
   * @name webtask:webtask
   * @api public
   */

  task(app, 'webtask-simple', 'index_simple.js');
  task(app, 'webtask-context', 'index_context.js');
  task(app, 'webtask-http', 'index_http.js');
  app.task('webtask', ['webtask-simple']);
  app.task('simple', ['webtask-simple']);
  app.task('context', ['webtask-context']);
  app.task('http', ['webtask-http']);

  /**
   * Alias for running the [webtask](#webtask) task with the following command:
   *
   * ```sh
   * $ gen webtask
   * ```
   * @name webtask
   * @api public
   */

  app.task('default', ['webtask']);
};

/**
 * Create a task with the given `name` and glob `pattern`
 */

function task(app, name, pattern, dependencies) {
  app.task(name, dependencies || [], function(cb) {
    if (!pattern) return cb();
    return file(app, pattern);
  });
}

function file(app, pattern) {
  var src = app.options.srcBase || path.join(__dirname, 'templates');
  return app.src(pattern, {cwd: src})
    .pipe(app.renderFile('*')).on('error', console.log)
    .pipe(through.obj(function(file, enc, next) {
      if (file.stem.indexOf('index_') === 0) {
        file.stem = 'index';
      }
      next(null, file);
    }))
    .pipe(app.conflicts(app.cwd))
    .pipe(app.dest(app.cwd));
}
