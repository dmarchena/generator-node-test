// Karma configuration
// Generated on Sat Oct 17 2015 22:01:45 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'browserify',<%
      if (testFramework === 'jasmine') { %>
      'jasmine',<%
      } else if (testFramework === 'mocha') { %>
      'mocha',<%
        if (chai) { %>
      'chai',<%
        }
      } %>
    ],


    // list of files / patterns to load in the browser
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'src/**/*.js',
      'test/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {<%
      if (react) { %>
      'src/**/*.js*': [
        'browserify',<%
        if (coverage) { %>
        'coverage',<%
        } %>
      ],<%
      } else { %>
      'src/**/*.js': [
        'browserify',<%
        if (coverage) { %>
        'coverage',<%
        } %>
      ],<%
      } %>
      'test/**/*.spec.js': ['browserify'],
    },

    browserify: {
      debug: true,
      extensions: [
        '.js',<%
      if (react) { %>
        '.jsx',<%
      } %>
      ],
      transform: [<%
      if (es2015 || react) { %>
        'babelify',<%
      }
      if (coverage) { %>
        'browserify-istanbul',<%
      } %>
      ]
    },

    watchify: {
      poll: true
    },

    eslint: {
      stopOnError: true,
      stopOnWarning: true
    },

    plugins: [
      'karma-browserify',<%
      if (coverage) { %>
      'karma-coverage',<%
      } %>
      'karma-firefox-launcher',<%
      if (testFramework === 'jasmine') { %>
      'karma-jasmine',<%
      } else if (testFramework === 'mocha') { %>
      'karma-mocha',<%
      } %>
      'karma-phantomjs-launcher'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'progress',<%
      if (coverage) { %>
      'coverage',<%
      } %>
    ],
    <% if (coverage) { %>
    coverageReporter: {
      dir: 'coverage',
      reporters: [<%
      if (covReporters.indexOf('console') > -1) { %>
        { type: 'text' },<%
      }
      if (covReporters.indexOf('html') > -1) { %>
        { type: 'html', subdir: 'html' },<%
      }
      if (covReporters.indexOf('coveralls') > -1) { %>
        { type: 'lcov', subdir: 'coveralls' },<%
      } %>
      ]
    },
    <% } %>

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO, // Disabled because an istanbul html bug: https://github.com/tsargent/styleguide/commit/c5c2f78fa3712ddc0110e20c006c59a5e67d594d


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [ process.env.CI_TRAVIS ? 'Firefox' : 'PhantomJS' ]


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  })
}
