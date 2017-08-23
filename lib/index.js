var child_process = require('child_process');
var os = require('os');


function getGitCommit(cb) {
    child_process.exec('git rev-parse HEAD', function (err, stdout, stderr) {
        if (err)
            return cb(err);

        cb(null, (stdout || "").toString().trim());
    });
}


function echo(name) {
    var str = 'Hello, ' + name + os.EOL;
    return str;
}


function echoHandler(req, res, next) {
    getGitCommit(function (err, rev) {
        if (!err && rev)
            res.set('x-frontend-revision', rev);

        res.set('Content-Type', 'text/plain');
        res.charSet('utf-8');
        res.send(echo(req.params.name));
        next();
    });
}


module.exports = {
    echo: echo,
    echoHandler: echoHandler,
    getGitCommit: getGitCommit
};
