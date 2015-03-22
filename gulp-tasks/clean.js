var del = require('del');

module.exports = function (env) {

    env.gulp.task('clean', function (done) {
        var delconfig = [].concat(env.buildDir, './.sass-cache/', env.tempDir, './report/');

        env.log('Cleaning: ' + env.$.util.colors.blue(delconfig));

        del(delconfig, done);
    });

    env.gulp.task('clean-fonts', function (done) {
        clean(env.buildDir + 'fonts/**/*.*', done);
    });

    env.gulp.task('clean-images', function (done) {
        clean(env.buildDir + 'images/**/*.*', done);
    });

    env.gulp.task('clean-code', function (done) {
        var files = [].concat(
            env.tempDir + '**/*.js',
            env.buildDir + 'js/**/*.js',
            env.buildDir + '**/*.html'
        );

        clean(files, done);
    });

    env.gulp.task('clean-styles', function (done) {
        var files = [].concat(
            env.tempDir + '**/*.css',
            env.buildDir + 'styles/**/*.css'
        );

        clean(files, done);
    });

    function clean(path, done) {
        env.log('Cleaning: ' + env.$.util.colors.blue(path));
        del(path, done);
    }


};

