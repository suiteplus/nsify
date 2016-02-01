/**
 * @ns.id: 'schedule-with-require'
 * @ns.desc: 'Schedule with require()'
 * @ns.type: 'schedule'
 *
 * @ns.functions.get: 'info'
 * @ns.functions.post: 'save'
 * @ns.functions.put: 'update'
 * @ns.functions.delete: 'remove'
 *
 * @ns.custom.concat: 'user-event-complex', 'suitelet-complex'
 */
'use strict';
var store = require('./libs/store');

var $trace = 'restlet-with-require';

module.exports = {
    info: function (data) {
        if (data.type) {
            nlapiLogExecution('ERROR', $trace + '.info', 'Missing Record Type: "data.type"')
        } else
        if (data.id) {
            nlapiLogExecution('ERROR', $trace + '.info', 'Missing Internal ID: "data.id"')
        } else {
            return store.info(data);
        }
    },
    save: function (data) {
        if (data.type) {
            nlapiLogExecution('ERROR', $trace + '.save', 'Missing Record Type: "data.type"')
        } else
        if (data.init) {
            nlapiLogExecution('ERROR', $trace + '.save', 'Missing Initial Data: "data.init"')
        } else {
            return store.save(data);
        }
    },
    update: function (data) {
        if (data.type) {
            nlapiLogExecution('ERROR', $trace + '.update', 'Missing Record Type: "data.type"')
        } else
        if (data.id) {
            nlapiLogExecution('ERROR', $trace + '.update', 'Missing Internal ID: "data.id"')
        } else {
            return store.update(data);
        }
    },
    remove: function (data) {
        if (data.type) {
            nlapiLogExecution('ERROR', $trace + '.remove', 'Missing Record Type: "data.type"')
        } else
        if (data.id) {
            nlapiLogExecution('ERROR', $trace + '.remove', 'Missing Internal ID: "data.id"')
        } else {
            return store.remove(data);
        }
    }
};
