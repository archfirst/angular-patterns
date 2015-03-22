module.exports = function (env) {

    env.gulp.task('fonts', ['clean-fonts'], function () {
        env.log('Copying fonts');

        var fontDir = './bower_components/bootstrap-sass/assets/fonts/**/*.*';

        return env.gulp
            .src(fontDir)
            .pipe(env.gulp.dest(env.buildDir + 'fonts'));
    });

    env.gulp.task('images', ['clean-images'], function () {
        env.log('Compressing and copying images');

        return env.gulp
            .src(env.sourceDir + 'images/**/*.*')
            .pipe(env.$.imagemin({optimizationLevel: 4}))
            .pipe(env.gulp.dest(env.buildDir + 'images'));
    });


};

