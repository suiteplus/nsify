/**
 * @ns.id: 'my-schedule-simple'
 * @ns.desc: 'My Schedule Simple Description'
 * @ns.type: 'schedule'
 * @ns.function: 'processLegal'
 * @ns.params.my-param_s: {name: 'My Param', type: 'TEXT'}
 */
'use strict';
module.exports = {
    processLegal: function() {
        return 'legal';
    }
};
