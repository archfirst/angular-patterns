module.exports = function(app) {
    var api = '/api';
    var data = '/../../data/';
    var jsonfileservice = require('./utils/jsonfileservice')();

    app.get(api + '/account', getAccountSummary);

    function getAccountSummary(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'account-summary.json');
        res.send(json);
    }
};
