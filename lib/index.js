var child_process = require('child_process');
var http = require('http');
var os = require('os');
var util = require('util');


function getGitCommit(cb) {
    child_process.exec('git rev-parse HEAD', function (err, stdout, stderr) {
        if (err)
            return cb(err);

        cb(null, (stdout || "").toString().trim());
    });
}


function echo(name, cb) {
    var client = http.request({
        agent: null,
        host: process.env.BACKEND_PORT_8080_TCP_ADDR || '127.0.0.1',
        method: 'GET',
        port: process.env.BACKEND_PORT_8080_TCP_PORT || 8080
    }, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                              `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                              `Expected application/json but received ${contentType}`);
        }
        if (error) {
            res.resume();
            return cb(err);
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                var obj = JSON.parse(rawData);
                obj.name = name;

                cb(null, obj);
            } catch (e) {
                cb(e);
            }
        });
    });

    client.once('error', cb);
    client.end();
}


function echoHandler(req, res, next) {
    getGitCommit(function (err, rev) {
        if (!err && rev)
            res.set('x-frontend-revision', rev);

        res.set('Content-Type', 'application/json');
        res.charSet('utf-8');
        echo(req.params.name, function (err, str) {
            if (err) {
                res.send(err);
            } else {
                res.send(str);
            }
            next();
        });
    });
}


module.exports = {
    echo: echo,
    echoHandler: echoHandler,
    getGitCommit: getGitCommit
};
