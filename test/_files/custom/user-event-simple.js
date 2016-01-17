/**
 * @ns.id: 'my-user-event-simple'
 * @ns.type: 'user-event'
 * @ns.functions.beforeLoad: 'preLoad'
 * @ns.functions.beforeSubmit: 'beforeSubmitMy'
 * @ns.functions.afterSubmit: 'afterSubmitMy'
 */
'use strict';
module.exports = {
    preLoad: function() {
        return 'default';
    },
    beforeSubmitMy: function() {
        return 'default';
    },
    afterSubmitMy: function() {
        return 'default';
    }
};
