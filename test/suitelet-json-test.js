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

        //Check if method exists
        nsObj = require(`${__dirname}/_files/ST-process-suitelet.js`);
        should(nsObj.execute()).be.type('string');

        return done();
    });

});