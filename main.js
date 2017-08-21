var bunyan = require('bunyan');
var restify = require('restify');

function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    return next();
}

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

    server.get('/hello/:name', respond);
    server.head('/hello/:name', respond);

    server.listen(8080, function main() {
        log.info({
            name: server.name,
            url: server.url
        }, 'Server running');
    });
})();


