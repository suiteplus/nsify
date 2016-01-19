'use strict';
var fs = require('fs'),
    path = require('path'),
    camelcase = require('uppercamelcase');

const $TYPES = {
    cl: 'client',
    re: 'restlet',
    sc: 'schedule',
    st: 'suitelet',
    ue: 'user-event'
};

const
    /**
     * SuiteScript ID
     */
    $RE_ID = /@ns.id:[ ]*["|']([\w -\_]*)["|']/,
    /**
     * SuiteScript Name
     */
    $RE_NAME = /@ns.name:[ ]*["|']([\w ]*)["|']/,
    /**
     * SuiteScript Type
     * @defaults ['client', 'schedule', 'suitelet', 'restlet', 'user-event']
     */
    $RE_TYPE = /@ns.type:[ ]*["|']([\w -]*)["|']/,
    /**
     * SuiteScript Alias
     */
    $RE_ALIAS = /@ns.alias:[ ]*["|']([\w ]*)["|']/,
    /**
     * SuiteScript Description
     */
    $RE_DESC = /@ns.desc:[ ]*["|']([\w -\_|]*)["|']/,
    /**
     * Others libraries for SuiteScript
     */
    $RE_LIBS = /@ns.libs:[ ]*(['|"][\w\/'", -]*\n)/,
    /**
     * Configure any record for Client or User Event
     */
    $RE_RECORD = /@ns.record:[ ]*["|']([\w ]*)["|']/,
    $RE_RECORDS = /@ns.records:[ ]*(['|"][\w\/'", -]*\n)/,

    /**
     * SuiteScript Functions
     */
    /** Function for Schedule or Suitelet */
    $RE_FUNC = /@ns.function:[ ]*["|']([\w/\.:]*)["|']/,
    /** Functions for User Event */
    $RE_FUNC_BEFORE_LOAD = /@ns.functions.beforeLoad:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_BEFORE_SMT = /@ns.functions.beforeSubmit:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_AFTER_SMT = /@ns.functions.afterSubmit:[ ]*["|']([\w\.]*)["|']/,
    /** Functions for RESTlet */
    $RE_FUNC_POST = /@ns.functions.post:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_GET = /@ns.functions.get:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_DELETE = /@ns.functions.delete:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_PUT = /@ns.functions.put:[ ]*["|']([\w\.]*)["|']/,
    /** Functions for Client */
    $RE_FUNC_PAGE_INIT = /@ns.functions.pageInit:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_SAVE_REC = /@ns.functions.saveRecord:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_VALIDATE_FIELD = /@ns.functions.validateField:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_FIELD_CHANGED = /@ns.functions.fieldChanged:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_POST_SOURCING = /@ns.functions.postSourcing:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_LINE_INIT = /@ns.functions.lineInit:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_VALIDATE_LINE = /@ns.functions.validateLine:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_VALIDATE_INSERT = /@ns.functions.validateInsert:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_VALIDATE_DELETE = /@ns.functions.validateDelete:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_RECALC = /@ns.functions.recalc:[ ]*["|']([\w\.]*)["|']/,
    /**
     * SuiteScript Parameters
     */
    $RE_PARAM = `@ns.params.([A-Za-z0-9-\_]*):[ ]*((["|']([A-Za-z-]*)["|'])|({([A-Za-z-:'"\., ]*)}))`,

    /**
     * Validate if functions exists in script.
     *
     * @param func {string} Function name.
     */
    $RE_FUNC_VALIDATE = (func) => new RegExp(`${func}[ \\n]*[:=][ \\n]*function[ \n]*\\(`, 'g'),

    /**
     * Custom Annotations
     */
    $RE_CUSTOM = `@ns.custom.([A-Za-z0-9-\_]*):[ ]*["|']([A-Za-z-\_ ]*)["|']`;

var parseStr = (l) => l.replace(/['|"]/g, '').trim();

/**
 *
 * @param scriptPath {string}
 * @param [format] {'nsmockup'}
 * @returns {{
 *    id: string,
 *    name: string,
 *    desc: string,
 *    alias: string,
 *    [function]: string,
 *    [functions]: {
 *      [post]: string,
 *      [get]: string,
 *      [delete]: string,
 *      [put]: string,
 *      [afterSubmit]: string,
 *      [beforeSubmit]: string,
 *      [beforeLoad]: string,
 *      [pageInit]: string,
 *      [saveRecord]: string
 *    },
 *    libs: [string],
 *    params: object,
 *    [records]: [string],
 *    [custom]: object
 * }}
 */
module.exports = (scriptPath, format) => {
    if (!scriptPath) {
        return null;
    }
    let ext = ~scriptPath.indexOf('.js') ? '' : '.js',
        filePath = `${scriptPath}${ext}` ;
    if (!fs.existsSync(filePath)) {
        return null;
    }

    let script = fs.readFileSync(filePath, 'utf8'),
        name = path.basename(filePath, '.js'),
        prefix = name.substr(0, 2).toLowerCase(),
        type = $TYPES[prefix],
        id = (type ? name.substr(3) : name).replace(/[ ;:+=\|\\]/g, '_');

    if (!type) {
        type = 'library';
    }

    let nsId = ($RE_ID.test(script) ? $RE_ID.exec(script)[1] : id).replace('customscript', ''),
        nsObj = {
            id: nsId,
            name: $RE_NAME.test(script) ? $RE_NAME.exec(script)[1] : nsId.replace(/[_-]/g, ' '),
            type: $RE_TYPE.test(script) ? $RE_TYPE.exec(script)[1] : type,
            alias: $RE_ALIAS.test(script) ? $RE_ALIAS.exec(script)[1] : nsId,
            desc: $RE_DESC.test(script) ? $RE_DESC.exec(script)[1] : '',
            libs: $RE_LIBS.test(script) ? $RE_LIBS.exec(script)[1].split(',').map(parseStr) : [],
            params: {}
        };

    nsObj.type = nsObj.type.toLowerCase();
    nsObj.name = nsObj.name.split(' ').map(word => {
        if (word.length === 2) {
            // Uppercase team abbreviations like FC, CD, SD
            return word.toUpperCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }).join(' ');
    if (/[ -;:/]/.test(nsObj.alias)) {
        nsObj.alias = camelcase(nsObj.alias);
    }

    switch (nsObj.type) {
        case 'client': {
            nsObj.functions = {
                pageInit: $RE_FUNC_PAGE_INIT.test(script) ? $RE_FUNC_PAGE_INIT.exec(script)[1] : 'pageInit',
                saveRecord: $RE_FUNC_SAVE_REC.test(script) ? $RE_FUNC_SAVE_REC.exec(script)[1] : 'saveRecord',
                validateField: $RE_FUNC_VALIDATE_FIELD.test(script) ? $RE_FUNC_VALIDATE_FIELD.exec(script)[1] : 'validateField',
                fieldChanged: $RE_FUNC_FIELD_CHANGED.test(script) ? $RE_FUNC_FIELD_CHANGED.exec(script)[1] : 'fieldChanged',
                postSourcing: $RE_FUNC_POST_SOURCING.test(script) ? $RE_FUNC_POST_SOURCING.exec(script)[1] : 'postSourcing',
                lineInit: $RE_FUNC_LINE_INIT.test(script) ? $RE_FUNC_LINE_INIT.exec(script)[1] : 'lineInit',
                validateLine: $RE_FUNC_VALIDATE_LINE.test(script) ? $RE_FUNC_VALIDATE_LINE.exec(script)[1] : 'validateLine',
                validateInsert: $RE_FUNC_VALIDATE_INSERT.test(script) ? $RE_FUNC_VALIDATE_INSERT.exec(script)[1] : 'validateInsert',
                validateDelete: $RE_FUNC_VALIDATE_DELETE.test(script) ? $RE_FUNC_VALIDATE_DELETE.exec(script)[1] : 'validateDelete',
                recalc: $RE_FUNC_RECALC.test(script) ? $RE_FUNC_RECALC.exec(script)[1] : 'recalc'
            };
            let record = $RE_RECORD.test(script) ? $RE_RECORD.exec(script)[1] : null;
            if (record) {
                nsObj.records = [record];
            } else {
                nsObj.records = $RE_RECORDS.test(script) ? $RE_RECORDS.exec(script)[0].split(',').map(parseStr) : [];
            }
            break;
        }
        case 'schedule':
            nsObj.function = $RE_FUNC.test(script) ? $RE_FUNC.exec(script)[1] : 'process';
            break;
        case 'suitelet':
            nsObj.function = $RE_FUNC.test(script) ? $RE_FUNC.exec(script)[1] : 'execute';
            break;
        case 'restlet':
            nsObj.functions = {
                get: $RE_FUNC_GET.test(script) ? $RE_FUNC_GET.exec(script)[1] : 'get',
                delete: $RE_FUNC_DELETE.test(script) ? $RE_FUNC_DELETE.exec(script)[1] : 'delete',
                post: $RE_FUNC_POST.test(script) ? $RE_FUNC_POST.exec(script)[1] : 'post',
                put: $RE_FUNC_PUT.test(script) ? $RE_FUNC_PUT.exec(script)[1] : 'put'
            };
            break;
        case 'user-event': {
            nsObj.functions = {
                beforeLoad: $RE_FUNC_BEFORE_LOAD.test(script) ? $RE_FUNC_BEFORE_LOAD.exec(script)[1] : 'beforeLoad',
                beforeSubmit: $RE_FUNC_BEFORE_SMT.test(script) ? $RE_FUNC_BEFORE_SMT.exec(script)[1] : 'beforeSubmit',
                afterSubmit: $RE_FUNC_AFTER_SMT.test(script) ? $RE_FUNC_AFTER_SMT.exec(script)[1] : 'afterSubmit'
            };
            let record = $RE_RECORD.test(script) ? $RE_RECORD.exec(script)[1] : '';
            if (record) {
                nsObj.records = [record];
            } else {
                nsObj.records = $RE_RECORDS.test(script) ? $RE_RECORDS.exec(script)[1].split(',').map(parseStr) : [];
            }
            break;
        }
    }

    // Verify Parameters
    let reParam = new RegExp($RE_PARAM, 'g');
    for (let match; (match = reParam.exec(script)); ) {
        let param = match[1],
            value = match[2];
        if (value[0] === '{') {
            let obj, paramObj = {};
            eval('obj = ' + value);
            ['type', 'name'].forEach(prop => {
                paramObj[prop] = obj[prop];
            });
            nsObj.params[param] = paramObj;
        } else {
            nsObj.params[param] = {type: value.substring(1, value.length-1)};
        }
    }

    // Verify Custom Annotations
    let reCustom = new RegExp($RE_CUSTOM, 'g');
    for (let match; (match = reCustom.exec(script)); ) {
        if (!nsObj.custom) nsObj.custom = {};

        let param = match[1],
            value = match[2];
        nsObj.custom[param] = value;
    }

    // Remove uncreated functions
    let alias = nsObj.alias,
        verifyFunction = (objBase, funcName, defFunc) => {
            funcName = funcName.indexOf(`${alias}.`) === 0 ? funcName.replace(`${alias}.`, '') : funcName;
            if ($RE_FUNC_VALIDATE(funcName).test(script)) {
                objBase[defFunc] = funcName;
            } else {
                delete objBase[defFunc];
            }
        };
    if (nsObj.functions) {
        let funcs = nsObj.functions;
        Object.keys(nsObj.functions).forEach(func => {
            let funcName = funcs[func].trim();
            verifyFunction(funcs, funcName, func);
        });
    } else if (nsObj.function) {
        let funcName = nsObj.function.trim();
        verifyFunction(nsObj, funcName, 'function');
    }

    if (format === 'nsmockup') {
        return require('./nsmockup-parse')(nsObj, filePath);
    } else {
        return nsObj;
    }
};
