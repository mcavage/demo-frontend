var bunyan = require('bunyan');
var restify = require('restify');

var lib = require('./lib');

(function main() {
    var log = bunyan.createLogger({
        name: 'frontend',
        src: true
    });
    var server = restify.createServer();

    server.use(restify.plugins.requestLogger({
        log: log,
        serializers: restify.bunyan.serializers
    }));
    server.use(restify.plugins.acceptParser(server.acceptable));

    server.use(function createClient(req, res, next) {

        next();
    });
    server.get('/echo/:name', lib.echoHandler);
    server.head('/echo/:name', lib.echoHandler);

    server.listen(9080, function main() {
        log.info({
            name: server.name,
            url: server.url
        }, 'Server running');
    });
})();


