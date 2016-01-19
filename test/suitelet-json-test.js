'use strict';

var nsify = require('../'),
    should = require('should');

describe('Suitelet JSON', () => {

    it('Default', (done) => {
        let scriptPath = `${__dirname}/_files/ST-process-suitelet.js`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'process-suitelet');
        should(nsObj).have.property('name', 'Process Suitelet');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'suitelet');
        should(nsObj).have.property('alias', 'ProcessSuitelet');

        return done();
    });

    it('Complex', (done) => {
        let scriptPath = `${__dirname}/_files/custom/suitelet-complex`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-suitelet-complex');
        should(nsObj).have.property('name', 'MY Suitelet Complex');
        should(nsObj).have.property('desc', 'My Suitelet complex Description');
        should(nsObj).have.property('type', 'suitelet');
        should(nsObj).have.property('alias', 'MySuiteletComplex');

        nsObj.libs.should.eql(['my-lib-01', 'my-lib-02']);

        should(nsObj.params).have.property('my-param_FULL');
        let paramFull = nsObj.params['my-param_FULL'];
        should(paramFull).have.property('name', 'My Param FULL');
        should(paramFull).have.property('type', 'TEXT');

        should(nsObj.params).have.property('my-param_SiMple');
        let paramSimple = nsObj.params['my-param_SiMple'];
        should(paramSimple).not.have.property('name');
        should(paramSimple).have.property('type', 'INTEGER');

        return done();
    });
});