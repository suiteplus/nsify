'use strict';

var nsify = require('../../.'),
    should = require('should');

describe('<Library JSON>', () => {

    it('Default', (done) => {
        let scriptPath = `${__dirname}/../_files/library.js`,
            nsObj = nsify.annotation(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('type', 'library');
        return done();
    });
});