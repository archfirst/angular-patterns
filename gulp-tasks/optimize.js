var del = require('del');

module.exports = function (env) {

    var gulp = env.gulp,
        $ = env.$,
        log = env.log;

    gulp.task('build', [ 'optimize', 'images', 'fonts' ], function () {
        log('Building everything');
        del(env.tempDir);
    });

    gulp.task('optimize', [ 'inject', 'test' ], function () {
        log('Optimizing the js, css, and html');

        var assets = $.useref.assets({ searchPath: './' });

        // Filters are named for the gulp-useref path
        var cssFilter = $.filter('**/*.css');
        var jsAppFilter = $.filter('**/app.js');
        var jslibFilter = $.filter('**/lib.js');

        var templateCacheFile = env.tempDir + 'templates.js';

        return env.gulp
            .src(env.sourceDir + 'index.html')
            .pipe($.plumber())
            .pipe($.inject(gulp.src(templateCacheFile),
                { name: 'inject:templates', read: false }))
            .pipe(assets) // Gather all assets from the html with useref
            // Get the css
            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore())
            // Get the custom javascript
            .pipe(jsAppFilter)
            .pipe($.ngAnnotate({ add: true }))
            .pipe($.uglify())
            .pipe(getHeader())
            .pipe(jsAppFilter.restore())
            // Get the vendor javascript
            .pipe(jslibFilter)
            .pipe($.uglify()) // another option is to override wiredep to use min files
            .pipe(jslibFilter.restore())
            // Take inventory of the file names for future rev numbers
            .pipe($.rev())
            // Apply the concat and file replacement with useref
            .pipe(assets.restore())
            .pipe($.useref())
            // Replace the file names in the html with rev numbers
            .pipe($.revReplace())
            .pipe(gulp.dest(env.buildDir));
    });


    function getHeader() {
        var pkg = require('../package.json');
        var template = [ '/**',
            ' * <%= pkg.name %> - <%= pkg.description %>',
            ' * @authors <%= pkg.authors %>',
            ' * @version v<%= pkg.version %>',
            ' * @link <%= pkg.homepage %>',
            ' * @license <%= pkg.license %>',
            ' */',
            ''
        ].join('\n');
        return $.header(template, {
            pkg: pkg
        });
    }

};

