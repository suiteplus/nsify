'use strict';

var nsify = require('../'),
    should = require('should');

describe('Default JSON', () => {

    describe('Schedule', () => {
        it('Simple', done => {
            let scriptPath = `${__dirname}/_files/custom/schedule-simple`,
                nsObj = nsify(scriptPath);

            should(nsObj).be.ok();
            should(nsObj).have.property('id', 'my-schedule');
            should(nsObj).have.property('name', 'MY Schedule');
            should(nsObj).have.property('desc', 'My Schedule Description');
            should(nsObj).have.property('type', 'schedule');
            should(nsObj).have.property('alias', 'MySchedule');
            should(nsObj).have.property('function', 'MySchedule.processLegal');
            should(nsObj).have.property('params');
            should(nsObj.params).have.property('my-param');
            let myParam = nsObj.params['my-param'];
            should(myParam).have.property('name', 'My Param');
            should(myParam).have.property('type', 'TEXT');
            return done();
        });
    });
});