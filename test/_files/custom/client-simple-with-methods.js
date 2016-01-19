/**
 * @ns.id: 'my-client-with-methods'
 * @ns.desc: 'My Client With Methods Description'
 * @ns.type: 'client'
 * @ns.alias: 'MyClientWithMethods'
 *
 * @ns.functions.pageInit: 'myPageInit'
 * @ns.functions.saveRecord: 'mySaveRecord'
 * @ns.functions.validateField: 'myValidateField'
 * @ns.functions.fieldChanged: 'myFieldChanged'
 * @ns.functions.postSourcing: 'myPostSourcing'
 * @ns.functions.lineInit: 'myLineInit'
 * @ns.functions.validateLine: 'myValidateLine'
 * @ns.functions.validateInsert: 'myValidateInsert'
 * @ns.functions.validateDelete: 'myValidateDelete'
 * @ns.functions.recalc: 'myRecalc'
 *
 * @ns.record: 'my_custom_record'
 */
'use strict';
module.exports = {

    myPageInit: function(){
        return 'myPageInit';
    },
    mySaveRecord: function(){
        return 'mySaveRecord';
    },
    myValidateField: function(){
        return 'myValidateField';
    },
    myFieldChanged: function(){
        return 'myFieldChanged';
    },
    myPostSourcing: function(){
        return 'myPostSourcing';
    },
    myLineInit: function(){
        return 'myLineInit';
    },
    myValidateLine: function(){
        return 'myValidateLine';
    },
    myValidateInsert: function(){
        return 'myValidateInsert';
    },
    myValidateDelete: function(){
        return 'myValidateDelete';
    },
    myRecalc: function(){
        return 'myRecalc';
    }
};