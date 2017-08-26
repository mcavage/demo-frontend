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
    const name = 'mark'
    lib.echo(name, function (err, obj) {
        t.ifError(err);
        t.ok(obj);
        t.equal(name, obj.name);
        t.ok(obj.time);
        t.end();
    });
});
