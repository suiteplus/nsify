'use strict';
var should = require('should'),
    fs = require('fs'),
    childProcess = require('child_process'),
    spawn = childProcess.spawn;

describe('<Command Line>', () => {
    let pack = require('../package'),
        exec = pack.bin.nsify,
        file = `${__dirname}/_files/custom/restlet-with-require.js`,
        args = [exec, file];

    it('execute nsify in commad line', done => {
        let child = spawn('node', args);
        child.stdout.on('data', function (buffer) {
            let out = `${__dirname}/_files/output/suite-script-nsify-restlet.js`,
                content = fs.readFileSync(out, 'utf8');
            should(buffer).be.ok();
            should(buffer.toString()).be.equal(content);
        });
        child.stdout.on('end', done);
    });
});
