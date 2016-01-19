/**
 * @ns.id: 'my-restlet-simple'
 * @ns.desc: 'My Restlet Simple Description'
 * @ns.type: 'restlet'
 *
 * @ns.functions.get: 'my_get_function'
 * @ns.functions.post: 'my_post_function'
 * @ns.functions.put: 'my_put_function'
 * @ns.functions.delete: 'my_delete_function'
 *
 * @ns.libs: 'my-lib-01','my-lib-02'
 *
 * @ns.params.my-param_FULL: {name: 'My Param FULL', type: 'TEXT'}
 * @ns.params.my-param_SiMple: 'INTEGER'
 */
'use strict';
module.exports = {
    my_get_function: function(){
        return 'my_get_function';
    },
    my_post_function: function(){
        return 'my_post_function';
    },
    my_put_function: function(){
        return 'my_put_function';
    },
    my_delete_function: function(){
        return 'my_delete_function';
    }
};
