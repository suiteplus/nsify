'use strict';
var nsify = require('../.'),
    should = require('should'),
    fs = require('fs'),
    through = require('through2');

describe('<Generate NetSuite Pack>', () => {

    it('run nsify with require()', done => {
        let file = `${__dirname}/_files/custom/restlet-with-require.js`;

        nsify(file)
            .pipe(through.obj(function (chunk) {
                var buffer = chunk.contents;

                let out = `${__dirname}/_files/output/suite-script-nsify-restlet.js`,
                    content = fs.readFileSync(out, 'utf8');

                should(buffer).be.ok();
                should(buffer.toString()).be.equal(content);
                return done();
            }));
    });

    it('run nsify with require() and concat', done => {
        let file = `${__dirname}/_files/custom/schedule-with-require.js`;

        nsify(file)
            .pipe(through.obj(function (chunk) {
                var buffer = chunk.contents;

                let out = `${__dirname}/_files/output/suite-script-nsify-schedule.js`,
                    content = fs.readFileSync(out, 'utf8');

                should(buffer).be.ok();
                should(buffer.toString()).be.equal(content);
                return done();
            }));
    });
});
