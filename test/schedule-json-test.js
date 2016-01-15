'use strict';

var nsify = require('../'),
    should = require('should');

describe('Schedule JSON', () => {
    it('Default', (done) => {
        let scriptPath = `${__dirname}/_files/SC-process-schedule.js`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'process-schedule');
        should(nsObj).have.property('name', 'Process Schedule');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'schedule');
        should(nsObj).have.property('alias', 'ProcessSchedule');
        should(nsObj).have.property('function', 'process');
        return done();
    });

    it('Custom - Simple', done => {
        let scriptPath = `${__dirname}/_files/custom/schedule-simple`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-schedule-simple');
        should(nsObj).have.property('name', 'MY Schedule Simple');
        should(nsObj).have.property('desc', 'My Schedule Simple Description');
        should(nsObj).have.property('type', 'schedule');
        should(nsObj).have.property('alias', 'MyScheduleSimple');
        should(nsObj).have.property('function', 'processLegal');
        should(nsObj).have.property('params');
        should(nsObj.params).have.property('my-param_s');
        let myParam = nsObj.params['my-param_s'];
        should(myParam).have.property('name', 'My Param');
        should(myParam).have.property('type', 'TEXT');
        return done();
    });

    it('Custom - Complex', done => {
        let scriptPath = `${__dirname}/_files/custom/schedule-complex`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-schedule-complex');
        should(nsObj).have.property('name', 'Schedule MY Complex');
        should(nsObj).have.property('desc', 'My Schedule Description, Very Complex');
        should(nsObj).have.property('type', 'schedule');
        should(nsObj).have.property('alias', 'MySchedule');
        should(nsObj).have.property('function', 'processLegal');
        should(nsObj).have.property('params');

        should(nsObj.params).have.property('my-param_FULL');
        let paramFull = nsObj.params['my-param_FULL'];
        should(paramFull).have.property('name', 'My Param FULL');
        should(paramFull).have.property('type', 'TEXT');

        should(nsObj.params).have.property('my-param_SiMple');
        let paramSimple = nsObj.params['my-param_SiMple'];
        should(paramSimple).not.have.property('name');
        should(paramSimple).have.property('type', 'INTEGER');

        should(nsObj).have.property('libs');
        should(nsObj.libs).have.containEql('schedule-simple');
        return done();
    });

    it('Custom - Format: nsmockup', done => {
        let scriptPath = `${__dirname}/_files/custom/schedule-complex`,
            nsObj = nsify(scriptPath, 'nsmockup');

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'customscriptmy-schedule-complex');
        should(nsObj).have.property('name', 'Schedule MY Complex');
        should(nsObj).have.property('desc', 'My Schedule Description, Very Complex');
        should(nsObj).have.property('type', 'schedule');
        should(nsObj).have.property('alias', 'MySchedule');
        should(nsObj).have.property('function', 'MySchedule.processLegal');
        should(nsObj).have.property('params');

        should(nsObj.params).have.property('my-param_FULL');
        let myParam = nsObj.params['my-param_FULL'];
        should(myParam).have.property('name', 'My Param FULL');
        should(myParam).have.property('type', 'TEXT');

        should(nsObj).not.have.property('libs');
        should(nsObj).have.property('files').length(2);
        let files = nsObj.files;
        [
            [`${__dirname}/_files/custom/schedule-complex.js`, 'MySchedule'],
            [`${__dirname}/_files/custom/schedule-simple.js`, 'MyScheduleSimple']
        ].forEach((line, i) => {
            let file = files[i];
            should(file).length(line.length);
            for (let l = 0; l < line.length; l++) {
                should(file[l]).be.equal(line[l]);
            }

        });
        return done();
    });
});