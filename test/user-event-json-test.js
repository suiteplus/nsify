'use strict';

var nsify = require('../'),
    should = require('should');

describe('User Event JSON', () => {

    it('Default', (done) => {
        let scriptPath = `${__dirname}/_files/UE-process-userevent.js`,
            nsObj = nsify.annotation(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'process-userevent');
        should(nsObj).have.property('name', 'Process Userevent');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'user-event');
        should(nsObj).have.property('alias', 'ProcessUserevent');

        return done();
    });

    it('Complex', (done) => {
        let scriptPath = `${__dirname}/_files/custom/user-event-complex`,
            nsObj = nsify.annotation(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-user-event-complex');
        should(nsObj).have.property('name', 'MY User Event Complex');
        should(nsObj).have.property('desc', 'My Userevent complex Description');
        should(nsObj).have.property('type', 'user-event');
        should(nsObj).have.property('alias', 'MyUserEventComplex');

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