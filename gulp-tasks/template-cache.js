module.exports = function (env) {

    var config = {
        templateFiles: [
            env.sourceDir + '**/*.html',
            '!' + env.sourceDir + 'index.html'
        ],
        file: 'templates.js',
        destDir: env.tempDir,
        options: {
            module: 'app.core',
            root: '',
            standAlone: false
        }
    };

    env.gulp.task('templatecache', [ 'clean-code' ], function () {
        env.log('Creating an AngularJS $templateCache at ' + env.tempDir + config.file);

        return env.gulp
            .src(config.templateFiles)
            .pipe(env.$.if(env.args.verbose, env.$.bytediff.start()))
            .pipe(env.$.minifyHtml({ empty: true }))
            .pipe(env.$.if(env.args.verbose, env.$.bytediff.stop(bytediffFormatter)))
            .pipe(env.$.angularTemplatecache(
                config.file,
                config.options
            ))
            .pipe(env.gulp.dest(config.destDir));
    });


    function bytediffFormatter(data) {
        var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
        return data.fileName + ' went from ' +
            (data.startSize / 1000).toFixed(2) + ' kB to ' +
            (data.endSize / 1000).toFixed(2) + ' kB and is ' +
            formatPercent(1 - data.percent, 2) + '%' + difference;
    }


    function formatPercent(num, precision) {
        return (num * 100).toFixed(precision);
    }

};

