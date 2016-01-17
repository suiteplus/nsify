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

const $RE_ID = /@ns.id:[ ]*["|']([\w -\_]*)["|']/,
    $RE_NAME = /@ns.name:[ ]*["|']([\w ]*)["|']/,
    $RE_TYPE = /@ns.type:[ ]*["|']([\w -]*)["|']/,
    $RE_ALIAS = /@ns.alias:[ ]*["|']([\w ]*)["|']/,
    $RE_DESC = /@ns.desc:[ ]*["|']([\w -\_|]*)["|']/,
    $RE_LIBS = /@ns.libs:[ ]*(["|'][\w/\.:-]*["|'],?[ ]*)*/,
    $RE_RECORD = /@ns.record:[ ]*["|']([\w ]*)["|']/,
    $RE_RECORDS = /@ns.records:[ ]*(["|'][\w/\.:-]*["|'],?[ ]*)*/,
    $RE_FUNC = /@ns.function:[ ]*["|']([\w/\.:]*)["|']/,
    $RE_FUNC_BEFORE_LOAD = /@ns.functions.beforeLoad:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_BEFORE_SMT = /@ns.functions.beforeSubmit:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_AFTER_SMT = /@ns.functions.afterSubmit:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_POST = /@ns.functions.post:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_GET = /@ns.functions.get:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_DELETE = /@ns.functions.delete:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_PUT = /@ns.functions.put:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_PAGE_INIT = /@ns.functions.pageInit:[ ]*["|']([\w\.]*)["|']/,
    $RE_FUNC_SAVE_REC = /@ns.functions.saveRecord:[ ]*["|']([\w\.]*)["|']/,
    $RE_PARAM = `@ns.params.([A-Za-z0-9-\_]*):[ ]*((["|']([A-Za-z-]*)["|'])|({([A-Za-z-:'"\., ]*)}))`;

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
 *    [records]: [string]
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
                saveRecord: $RE_FUNC_SAVE_REC.test(script) ? $RE_FUNC_SAVE_REC.exec(script)[1] : 'saveRecord'
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
                nsObj.records = $RE_RECORDS.test(script) ? $RE_RECORDS.exec(script)[0].split(',').map(parseStr) : [];
            }
            break;
        }
    }

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

    if (format === 'nsmockup') {
        return require('./nsmockup-parse')(nsObj, filePath);
    } else {
        return nsObj;
    }
};
