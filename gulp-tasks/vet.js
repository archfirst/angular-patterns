var gulp = require('gulp');

module.exports = function (env) {

    env.gulp.task('vet', vet);


    /**
     * vet the code and create coverage report
     * @return {Stream}
     */
    function vet() {
        env.log('Analyzing source with JSHint and JSCS');

        return env.gulp
            .src([
                env.sourceDir + '**/*.js',
                env.testDir + '**/*.js',
                './*.js'
            ])
            .pipe(env.$.if(env.args.verbose, env.$.print()))
            .pipe(env.$.jshint())
            .pipe(env.$.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe(env.$.jshint.reporter('fail'))
            .pipe(env.$.jscs());
    }
};


