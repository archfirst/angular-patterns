var wiredep = require('wiredep').stream;

module.exports = function (env) {

    var config = {
        indexHtml: env.sourceDir + 'index.html',
        css: env.tempDir + 'styles.css',
        js: env.js
    };

    env.gulp.task('wiredep', function () {
        env.log('Wiring the bower dependencies into the html');

        var options = {
            bowerJson: require('../bower.json'),
            directory: './bower_components/',
            ignorePath: '..'
        };

        return env.gulp
            .src(config.indexHtml)
            .pipe(wiredep(options))
            .pipe(env.$.inject(env.gulp.src(config.js)))
            .pipe(env.gulp.dest(env.tempDir));
    });

    env.gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {
        env.log('Wire up css into the html, after files are ready');

        return env.gulp
            .src(config.indexHtml)
            .pipe(env.$.inject(env.gulp.src(config.css)))
            .pipe(env.gulp.dest(env.tempDir));
    });


};

