/**
 * @ns.id: 'my-schedule'
 * @ns.name: 'My Schedule'
 * @ns.desc: 'My Schedule Description'
 * @ns.type: 'schedule'
 * @ns.alias: 'MySchedule'
 * @ns.function: 'processLegal'
 * @ns.params.my-param: {name: 'My Param', type: 'TEXT'}
 */
'use strict';
module.exports = {
    processLegal: function() {
        return 'legal';
    }
};
