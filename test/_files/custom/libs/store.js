'use strict';

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