/* jshint node: true, -W024, -W040, -W098, -W126 */

'use strict';


/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ lazy: true }),
    src = './src/',
    env = {
        sourceDir: src,
        testDir: './test/',
        buildDir: './build/',
        tempDir: './.tmp/',
        proxyPort: 7203,
        port: 3000,
        browserReloadDelay: 1000,
        js: [
            // module files in desired order
            src + 'app.module.js',
            src + 'core/core.module.js',
            src + 'framework/**/*.module.js',
            src + '**/*.module.js',

            // remaining files in desired order
            src + 'core/**/*.js',
            src + 'framework/**/*.js',
            src + '**/*.js'
        ],
        html: src + '**/*.html',

        $: $,
        args: require('yargs').argv,
        gulp: gulp,
        log: function log(msg) {
            if (typeof(msg) === 'object') {
                for (var item in msg) {
                    if (msg.hasOwnProperty(item)) {
                        $.util.log($.util.colors.blue(msg[ item ]));
                    }
                }
            } else {
                $.util.log($.util.colors.blue(msg));
            }
        },
        notify: function notify(options) {
            var notifier = require('node-notifier');
            notifier.notify(options);
        }

    };


require('./gulp-tasks/help')(env);
require('./gulp-tasks/serve')(env);
require('./gulp-tasks/vet')(env);
require('./gulp-tasks/plato')(env);
require('./gulp-tasks/styles')(env);
require('./gulp-tasks/assets')(env);
require('./gulp-tasks/clean')(env);
require('./gulp-tasks/template-cache')(env);
require('./gulp-tasks/inject')(env);
require('./gulp-tasks/optimize')(env);
require('./gulp-tasks/test')(env);
require('./gulp-tasks/bump')(env);


gulp.task('default', [ 'help' ]);

module.exports = gulp;
