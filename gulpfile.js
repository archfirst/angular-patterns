/* jshint node: true, -W024, -W040, -W098, -W126 */

'use strict';

var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var $ = require('gulp-load-plugins')({
    lazy: true
});

var colors = $.util.colors;
var port = process.env.PORT || config.defaultPort;

var env = {
    sourceDir: './src/',
    testDir: './test/',
    buildDir: './build/',
    tempDir: './.tmp/',
    port: process.env.PORT || 3000,

    $: require('gulp-load-plugins')({ lazy: true }),
    args: require('yargs').argv,
    gulp: require('gulp'),
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
    }

};


require('./gulp-tasks/help')(env);
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

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', [ 'build-specs' ], function (done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', [ 'templatecache' ], function (done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var templateCache = config.temp + config.templateCache.file;
    var options = config.getWiredepDefaultOptions();
    var specs = config.specs;

    if (args.startServers) {
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }
    options.devDependencies = true;

    return gulp
        .src(config.specRunner)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.testlibraries),
            { name: 'inject:testlibraries', read: false }))
        .pipe($.inject(gulp.src(config.specHelpers),
            { name: 'inject:spechelpers', read: false }))
        .pipe($.inject(gulp.src(specs),
            { name: 'inject:specs', read: false }))
        .pipe($.inject(gulp.src(templateCache),
            { name: 'inject:templates', read: false }))
        .pipe(gulp.dest(config.client));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', [ 'optimize', 'images', 'fonts' ], function () {
    log('Building everything');
    del(config.temp);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', [ 'inject' ], function () {
    serve(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', [ 'build' ], function () {
    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    log(msg);
    notify(msg);
    serve(false /*isDev*/);
});


////////////////

/**
 * Add watches to build and reload using browser-sync.
 * Use this XOR the browser-sync option.files, not both.
 * @param  {Boolean} isDev - dev or build mode
 */
//function addWatchForFileReload(isDev) {
//    if (isDev) {
//        gulp.watch([config.sass], ['styles', browserSync.reload]);
//        gulp.watch([config.client + '**/*', '!' + config.sass], browserSync.reload)
//            .on('change', function(event) { changeEvent(event); });
//    }
//    else {
//        gulp.watch([config.sass, config.js, config.html], ['build', browserSync.reload])
//            .on('change', function(event) { changeEvent(event); });
//    }
//}

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
    var debug = args.debug || args.debugBrk;
    var exec;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [ config.server ]
    };

    if (debug) {
        log('Running node-inspector. Browse to http://localhost:8080/debug?port=5858');
        exec = require('child_process').exec;
        exec('node-inspector');
        nodeOptions.nodeArgs = [ '--debug=5858' ];
    }

    return $.nodemon(nodeOptions)
        .on('restart', [ 'vet' ], function (ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches sass, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([ config.sass ], [ 'styles' ])
            .on('change', changeEvent);
    } else {
        gulp.watch([ config.sass, config.js, config.html ], [ 'optimize', browserSync.reload ])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.sass,
            config.temp + '**/*.css'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'angular-template',
        notify: true,
        reloadDelay: 0 //1000
    };
    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync(options);
}

/**
 * Log an error message and emit the end of a task
 */
function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[ item ]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    notifier.notify(options);
}

module.exports = gulp;
