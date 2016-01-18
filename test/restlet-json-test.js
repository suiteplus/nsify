'use strict';

var nsify = require('../'),
    should = require('should');

describe('Restlet JSON', () => {

    it('Default', (done) => {
        let scriptPath = `${__dirname}/_files/RE-process-restlet.js`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'process-restlet');
        should(nsObj).have.property('name', 'Process Restlet');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'restlet');
        should(nsObj).have.property('alias', 'ProcessRestlet');

        return done();
    });

    it('Simple', done => {
        let scriptPath = `${__dirname}/_files/custom/restlet-simple`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-restlet-simple');
        should(nsObj).have.property('name', 'MY Restlet Simple');
        should(nsObj).have.property('desc', 'My Restlet Simple Description');
        should(nsObj).have.property('type', 'restlet');
        should(nsObj).have.property('alias', 'MyRestletSimple');

        //TODO Leandro: This can't have default properties
        should(nsObj.functions).have.property('get', 'my-get-function');
        should(nsObj.functions).have.property('post', 'my-post-function');
        should(nsObj.functions).have.property('put', 'my-put-function');
        should(nsObj.functions).have.property('delete', 'my-delete-function');

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