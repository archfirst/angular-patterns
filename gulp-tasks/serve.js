var browserSync = require('browser-sync');

module.exports = function (env) {

    var gulp = env.gulp,
        args = env.args,
        log = env.log,
        notify = env.notify,
        $ = env.$,
        config = {
            sass: 'app.scss',
            server: './mock-server/',
            nodeServer: './mock-server/app.js',
            js: env.js,
            html: env.html
        };

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

    function serve(isDev) {
        var debug = args.debug || args.debugBrk;
        var exec;
        var nodeOptions = {
            script: config.nodeServer,
            delayTime: 1,
            env: {
                'PORT': env.proxyPort,
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
                }, env.browserReloadDelay);
            })
            .on('start', function () {
                log('*** nodemon started');
                startBrowserSync(isDev);
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
    function startBrowserSync(isDev) {
        if (args.nosync || browserSync.active) {
            return;
        }

        log('Starting BrowserSync on port ' + env.port);

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
            proxy: 'localhost:' + env.proxyPort,
            port: env.port,
            files: isDev ? [
                env.sourceDir + '**/*.*',
                '!' + config.sass,
                env.tempDir + '**/*.*'
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
            logPrefix: 'angular-patterns',
            notify: true,
            reloadDelay: 0 //1000
        };

        browserSync(options);
    }


    function changeEvent(event) {
        var srcPattern = new RegExp('/.*(?=/' + env.sourceDir + ')/');
        log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
    }
};

