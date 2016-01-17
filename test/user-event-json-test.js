'use strict';

var nsify = require('../'),
    should = require('should');

describe('Schedule JSON', () => {
    it('Default', (done) => {
        let scriptPath = `${__dirname}/_files/UE-process-user-event.js`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'process-user-event');
        should(nsObj).have.property('name', 'Process User Event');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'user-event');
        should(nsObj).have.property('alias', 'ProcessUserEvent');

        should(nsObj).have.property('functions');
        let functions = nsObj.functions;
        should(functions).have.property('beforeLoad', 'beforeLoad');
        should(functions).have.property('beforeSubmit', 'beforeSubmit');
        should(functions).have.property('afterSubmit', 'afterSubmit');

        should(nsObj).have.property('records').length(0);
        return done();
    });

    it('Custom - Simple', done => {
        let scriptPath = `${__dirname}/_files/custom/user-event-simple.js`,
            nsObj = nsify(scriptPath);

        should(nsObj).be.ok();
        should(nsObj).have.property('id', 'my-user-event-simple');
        should(nsObj).have.property('name', 'MY User Event Simple');
        should(nsObj).have.property('desc', '');
        should(nsObj).have.property('type', 'user-event');
        should(nsObj).have.property('alias', 'MyUserEventSimple');

        should(nsObj).have.property('functions');
        let functions = nsObj.functions;
        should(functions).have.property('beforeLoad', 'preLoad');
        should(functions).have.property('beforeSubmit', 'beforeSubmitMy');
        should(functions).have.property('afterSubmit', 'afterSubmitMy');
        return done();
    });
});