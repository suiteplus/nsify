'use strict';

var nsify = require('../../'),
    should = require('should');

describe('<Client JSON>', () => {

    it('Default', (done) => {
        let scriptPath = `${__dirname}/../_files/CL-process-client.js`,
            nsObj = nsify.annotation(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'process-client');
        should(nsObj).have.property('name', 'Process Client');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'client');
        should(nsObj).have.property('alias', 'ProcessClient');

        //TODO Leandro: This can't a default
        //should(nsObj).have.not.property('functions');

        return done();
    });

    it('Simple', done => {
        let scriptPath = `${__dirname}/../_files/custom/client-simple`,
            nsObj = nsify.annotation(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-client-simple');
        should(nsObj).have.property('name', 'MY Client Simple');
        should(nsObj).have.property('desc', 'My Client Simple Description');
        should(nsObj).have.property('type', 'client');
        should(nsObj).have.property('alias', 'MyClientSimple');

        should(nsObj.functions).not.have.property('pageInit');
        should(nsObj.functions).not.have.property('saveRecord');

        return done();
    });

    it('Simple - with methods', done => {
        let scriptPath = `${__dirname}/../_files/custom/client-simple-with-methods`,
            nsObj = nsify.annotation(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-client-with-methods');
        should(nsObj).have.property('name', 'MY Client With Methods');
        should(nsObj).have.property('desc', 'My Client With Methods Description');
        should(nsObj).have.property('type', 'client');
        should(nsObj).have.property('alias', 'MyClientWithMethods');
        should(nsObj.functions).have.property('pageInit', 'myPageInit');
        should(nsObj.functions).have.property('saveRecord', 'mySaveRecord');
        should(nsObj.functions).have.property('validateField', 'myValidateField');
        should(nsObj.functions).have.property('fieldChanged', 'myFieldChanged');
        should(nsObj.functions).have.property('postSourcing', 'myPostSourcing');
        should(nsObj.functions).have.property('lineInit', 'myLineInit');
        should(nsObj.functions).have.property('validateLine', 'myValidateLine');
        should(nsObj.functions).have.property('validateInsert', 'myValidateInsert');
        should(nsObj.functions).have.property('validateDelete', 'myValidateDelete');
        should(nsObj.functions).have.property('recalc', 'myRecalc');

        return done();
    });
    /*
    it('Custom - Format: nsmockup', done => {
        let scriptPath = `${__dirname}/../_files/custom/schedule-complex`,
            nsObj = nsify.annotation(scriptPath, 'nsmockup');

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
            [`${__dirname}/../_files/custom/schedule-complex.js`, 'MySchedule'],
            [`${__dirname}/../_files/custom/schedule-simple.js`, 'MyScheduleSimple']
        ].forEach((line, i) => {
            let file = files[i];
            should(file).length(line.length);
            for (let l = 0; l < line.length; l++) {
                should(file[l]).be.equal(line[l]);
            }

        });

        return done();
    });
    */
});