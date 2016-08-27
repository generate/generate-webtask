'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var bddStdin = require('bdd-stdin');
var npm = require('npm-install-global');
var del = require('delete');
var generator = require('../');
var pkg = require('../package');
var app;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, re, cb) {
  if (typeof re === 'function') {
    cb = re;
    re = new RegExp(/./);
  }

  return function(err) {
    if (err) return cb(err);
    var filepath = actual(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      var str = fs.readFileSync(filepath, 'utf8');
      assert(re.test(str));
      del(actual(), cb);
    });
  };
}

describe('generate-webtask', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  before(function(cb) {
    del(actual(), cb);
  });

  beforeEach(function() {
    app = generate({silent: true});
    app.cwd = actual();
    app.option('dest', actual());
  });

  afterEach(function(cb) {
    del(actual(), cb);
  });

  describe('tasks', function() {
    beforeEach(function() {
      app.use(generator);
    });

    it('should run the `default` task with .build', function(cb) {
      app.build('default', exists('index.js', cb));
    });

    it('should run the `default` task with .generate', function(cb) {
      app.generate('default', exists('index.js', cb));
    });

    it('should run the `webtask` task with .build', function(cb) {
      app.build('webtask', exists('index.js', cb));
    });

    it('should run the `webtask` task with .generate', function(cb) {
      app.generate('webtask', exists('index.js', cb));
    });

    it('should run the `webtask-simple` task with .build', function(cb) {
      app.build('webtask-simple', exists('index.js', cb));
    });

    it('should run the `webtask-simple` task with .generate', function(cb) {
      app.generate('webtask-simple', exists('index.js', cb));
    });

    it('should run the `simple` task with .build', function(cb) {
      app.build('simple', exists('index.js', cb));
    });

    it('should run the `simple` task with .generate', function(cb) {
      app.generate('simple', exists('index.js', cb));
    });

    it('should run the `webtask-context` task with .build', function(cb) {
      app.build('webtask-context', exists('index.js', cb));
    });

    it('should run the `webtask-context` task with .generate', function(cb) {
      app.generate('webtask-context', exists('index.js', cb));
    });

    it('should run the `context` task with .build', function(cb) {
      app.build('context', exists('index.js', cb));
    });

    it('should run the `context` task with .generate', function(cb) {
      app.generate('context', exists('index.js', cb));
    });

    it('should run the `webtask-http` task with .build', function(cb) {
      app.build('webtask-http', exists('index.js', cb));
    });

    it('should run the `webtask-http` task with .generate', function(cb) {
      app.generate('webtask-http', exists('index.js', cb));
    });

    it('should run the `http` task with .build', function(cb) {
      app.build('http', exists('index.js', cb));
    });

    it('should run the `http` task with .generate', function(cb) {
      app.generate('http', exists('index.js', cb));
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('generator (CLI)', function() {
      beforeEach(function() {
        bddStdin('\n');
        app.use(generator);
      });

      it('should run the default task using the `generate-webtask` name', function(cb) {
        app.generate('generate-webtask', exists('index.js', cb));
      });

      it('should run the default task using the `generator` generator alias', function(cb) {
        app.generate('webtask', exists('index.js', cb));
      });
    });
  }

  describe('generator (API)', function() {
    beforeEach(function() {
      bddStdin('\n');
    });

    it('should run the default task on the generator', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask', exists('index.js', cb));
    });

    it('should run the `webtask` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:webtask', exists('index.js', cb));
    });

    it('should run the `default` task when defined explicitly', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:default', exists('index.js', cb));
    });

    it('should run the `webtask-simple` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:webtask-simple', exists('index.js', cb));
    });

    it('should run the `simple` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:simple', exists('index.js', cb));
    });

    it('should run the `webtask-context` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:webtask-context', exists('index.js', cb));
    });

    it('should run the `context` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:context', exists('index.js', cb));
    });

    it('should run the `webtask-http` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:webtask-http', exists('index.js', cb));
    });

    it('should run the `http` task', function(cb) {
      app.register('webtask', generator);
      app.generate('webtask:http', exists('index.js', cb));
    });
  });

  describe('sub-generator', function() {
    beforeEach(function() {
      bddStdin('\n');
    });

    it('should work as a sub-generator', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask', exists('index.js', cb));
    });

    it('should run the `default` task by default', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask', exists('index.js', cb));
    });

    it('should run the `webtask:default` task when defined explicitly', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:default', exists('index.js', cb));
    });

    it('should run the `webtask:webtask` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:webtask', exists('index.js', cb));
    });

    it('should run the `webtask:webtask-simple` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:webtask-simple', exists('index.js', cb));
    });

    it('should run the `webtask:simple` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:simple', exists('index.js', cb));
    });

    it('should run the `webtask:webtask-context` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:webtask-context', exists('index.js', cb));
    });

    it('should run the `webtask:context` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:context', exists('index.js', cb));
    });

    it('should run the `webtask:webtask-http` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:webtask-http', exists('index.js', cb));
    });

    it('should run the `webtask:http` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('webtask', generator);
      });
      app.generate('foo.webtask:http', exists('index.js', cb));
    });

    it('should work with nested sub-generators', function(cb) {
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator);
      app.generate('foo.bar.baz', exists('index.js', cb));
    });
  });
});
