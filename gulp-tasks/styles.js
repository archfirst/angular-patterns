module.exports = function (env) {

    env.gulp.task('styles', ['clean-styles'], function () {
        env.log('Compiling Sass --> CSS');

        return env.gulp
            .src(env.sourceDir + 'app.scss')
            .pipe(env.$.plumber()) // exit gracefully if something fails after this
            .pipe(env.$.sass())
            .pipe(env.$.autoprefixer({browsers: ['last 2 version', '> 5%']}))
            .pipe(env.gulp.dest(env.tempDir));
    });

    env.gulp.task('sass-watcher', function () {
        env.gulp.watch([env.sourceDir + '**/*.scss'], ['styles']);
    });

};

