var tap = require('tap');

var lib = require('../lib');


tap.test('getGitCommit', function (t) {
    lib.getGitCommit(function (err, rev) {
        t.ifError(err);
        t.ok(rev);
        t.end();
    });
});

tap.test('echo', function (t) {
    t.equal('Hello, Mark\n', lib.echo('Mark'));
    t.end();
});
