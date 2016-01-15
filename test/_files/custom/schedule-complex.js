/**
 * @ns.id: 'my-schedule-complex'
 * @ns.name: 'Schedule My Complex'
 * @ns.desc: 'My Schedule Description, Very Complex'
 * @ns.type: 'schedule'
 * @ns.alias: 'MySchedule'
 * @ns.function: 'processLegal'
 * @ns.params.my-param_FULL: {name: 'My Param FULL', type: 'TEXT'}
 * @ns.params.my-param_SiMple: 'INTEGER'
 * @ns.libs: 'schedule-simple'
 */
'use strict';
module.exports = {
    processLegal: function() {
        return 'legal';
    }
};
