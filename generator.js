'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app) {
  // return if the generator is already registered
  if (!isValid(app, 'generate-webtask')) return;

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

  task(app, 'webtask', 'index.js');

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

function task(app, name, pattern) {
  app.task(name, function() {
    return app.src(pattern, {cwd: __dirname})
      .pipe(app.renderFile('*'))
      .pipe(app.conflicts(app.cwd))
      .pipe(app.dest(app.cwd));
  });
}
