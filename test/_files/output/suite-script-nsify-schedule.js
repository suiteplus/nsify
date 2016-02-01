var script = function r(n,t,o){function e(f){if(!t[f]){if(!n[f])throw"Cannot find module '"+f+"'";var u=t[f]={exports:{}};n[f][0].call(u.exports,function(r){var t=n[f][1][r];return e(t?t:r)},u,u.exports,r,n,t,o)}return t[f].exports}for(var f=0;f<o.length;f++)e(o[f]);return e}({1:[function(require,module,exports){
/**
 * @ns.id: 'my-user-event-complex'
 * @ns.desc: 'My Userevent complex Description'
 * @ns.type: 'user-event'
 *
 * @ns.functions.beforeLoad: 'mybeforeLoad'
 * @ns.functions.beforeSubmit: 'mybeforeSubmit'
 * @ns.functions.afterSubmit: 'myafterSubmit'
 *
 * @ns.libs: 'my-lib-01', 'my-lib-02'
 *
 * @ns.params.my-param_FULL: {name: 'My Param FULL', type: 'TEXT'}
 * @ns.params.my-param_SiMple: 'INTEGER'
 *
 * @ns.record: 'my_custom_record'
 */

module.exports = {

};

},{}]},{},[1]);

var MyUserEventComplex = script(1);
var script = function r(n,t,o){function e(f){if(!t[f]){if(!n[f])throw"Cannot find module '"+f+"'";var u=t[f]={exports:{}};n[f][0].call(u.exports,function(r){var t=n[f][1][r];return e(t?t:r)},u,u.exports,r,n,t,o)}return t[f].exports}for(var f=0;f<o.length;f++)e(o[f]);return e}({1:[function(require,module,exports){
/**
 * @ns.id: 'my-suitelet-complex'
 * @ns.desc: 'My Suitelet complex Description'
 * @ns.type: 'suitelet'
 *
 * @ns.function: 'myDefaultFunction'
 * @ns.libs: 'my-lib-01', 'my-lib-02'
 *
 * @ns.params.my-param_FULL: {name: 'My Param FULL', type: 'TEXT'}
 * @ns.params.my-param_SiMple: 'INTEGER'
 *
 * @ns.record: 'my_custom_record'
 */

module.exports = {

};

},{}]},{},[1]);

var MySuiteletComplex = script(1);
var script = function r(n,t,o){function e(f){if(!t[f]){if(!n[f])throw"Cannot find module '"+f+"'";var u=t[f]={exports:{}};n[f][0].call(u.exports,function(r){var t=n[f][1][r];return e(t?t:r)},u,u.exports,r,n,t,o)}return t[f].exports}for(var f=0;f<o.length;f++)e(o[f]);return e}({1:[function(require,module,exports){


/**
 * Save Record.
 *
 * @param data {{type: string, init: [object]}}
 */
exports.save = function(data) {
    var recType = data.type,
        record = nlapiCreateRecord(recType, data.init);
    nlapiSubmitRecrod(reccord);
};

/**
 * Update Record.
 *
 * @param data {{type: string, id: string, fields: [string], values: [string]}}
 */
exports.update = function(data) {
    var recType = data.type,
        recId = data.id;

    nlapiSubmitField(recType, recId, data.fields, data.values);
};

/**
 * Remove Record.
 *
 * @param data {{type: string, id: string}}
 */
exports.remove = function(data) {
    var recType = data.type,
        recId = data.id;

    nlapiDeleteRecord(recType, recId);
};

/**
 * Get info Record.
 *
 * @param data {{type: string, id: string}}
 */
exports.info = function(data) {
    var recType = data.type,
        recId = data.id;

    var record = nlapiLoadRecord(recType, recId);
    return JSON.stringify(record);
};
},{}],2:[function(require,module,exports){
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

},{"./libs/store":1}]},{},[2]);

var ScheduleWithRequire = script(2);