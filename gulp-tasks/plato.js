var plato = require('plato');
var glob = require('glob');

module.exports = function (env) {

    env.gulp.task('plato', function (done) {
        env.log('Analyzing source with Plato');
        env.log('Browse to /report/plato/index.html to see Plato results');

        startPlatoVisualizer(done);
    });

    /**
     * Start Plato inspector and visualizer
     */
    function startPlatoVisualizer(done) {
        env.log('Running Plato');

        var files = glob.sync(env.sourceDir + '**/*.js');
        var excludeFiles = /.*\.spec\.js/;

        var options = {
            title: 'Plato Inspections Report',
            exclude: excludeFiles
        };
        var outputDir = './report/plato';

        plato.inspect(files, outputDir, options, platoCompleted);

        function platoCompleted(report) {
            var overview = plato.getOverviewReport(report);
            if (env.args.verbose) {
                env.log(overview.summary);
            }
            if (done) {
                done();
            }
        }
    }

};

