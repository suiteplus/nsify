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

const $RE_ID = /@ns.id:[ ]*("|')([\w -\_]*)("|')/,
    $RE_NAME = /@ns.name:[ ]*("|')([\w ]*)("|')/,
    $RE_TYPE = /@ns.type:[ ]*("|')([\w ]*)("|')/,
    $RE_ALIAS = /@ns.alias:[ ]*("|')([\w ]*)("|')/,
    $RE_DESC = /@ns.desc:[ ]*("|')([\w ]*)("|')/,
    $RE_LIBS = /@ns.libs:[ ]*(("|')([\w/\.:]*)("|'),?[ ]*)*/,
    $RE_FUNC = (f) => new RegExp(`@ns.function.${f}:[ ]*("|')([\w\.]*)("|')`),
    $RE_FUNC_PROCESS = $RE_FUNC('process'),
    $RE_FUNC_EXECUTE = $RE_FUNC('execute'),
    $RE_FUNC_BEFORE_LOAD = $RE_FUNC('beforeLoad'),
    $RE_FUNC_BEFORE_SMT = $RE_FUNC('beforeSubmit'),
    $RE_FUNC_AFTER_SMT = $RE_FUNC('afterSubmit'),
    $RE_FUNC_POST = $RE_FUNC('post'),
    $RE_FUNC_GET = $RE_FUNC('get'),
    $RE_FUNC_DELETE = $RE_FUNC('delete'),
    $RE_FUNC_PUT = $RE_FUNC('put'),
    $RE_FUNC_PAGE_INIT = $RE_FUNC('pageInit'),
    $RE_FUNC_SAVE_REC = $RE_FUNC('saveRecord'),
    $RE_PARAM = `@ns.params.([A-Za-z0-9\_-]*):[ ]*((("|')([A-Za-z-]*)("|'))|({([A-Za-z-:'"\., ]*)}))`;

module.exports = (scriptPath) => {
    if (!scriptPath || ! fs.existsSync(scriptPath)) {
        return null;
    }

    let script = fs.readFileSync(scriptPath, 'utf8'),
        name = path.basename(scriptPath, '.js'),
        prefix = name.substr(0, 2).toLowerCase(),
        type = $TYPES[prefix],
        id = (type ? name.substr(3) : name).replace(/[ ;:+=\|\\]/g, '_');

    let nsId = $RE_ID.test(script) ? $RE_ID.exec(script)[2] : id,
        nsObj = {
            id: nsId,
            name: $RE_NAME.test(script) ? $RE_NAME.exec(script)[2] : nsId.replace(/[_-]/g, ' '),
            type: $RE_TYPE.test(script) ? $RE_TYPE.exec(script)[2] : type,
            alias: $RE_ALIAS.test(script) ? $RE_ALIAS.exec(script)[2] : nsId,
            desc: $RE_DESC.test(script) ? $RE_DESC.exec(script)[2] : '',
            libs: $RE_LIBS.test(script) ? $RE_LIBS.exec(script)[0].replace(/(@ns.libs:)|[' ]/g, '').split(',') : [],
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
    nsObj.alias = camelcase(nsObj.alias);

    switch (nsObj.type) {
        case 'client':
            nsObj.functions = {
                pageInit: $RE_FUNC_PAGE_INIT.test(script) ? $RE_FUNC_PAGE_INIT.exec(script)[2] : 'pageInit',
                saveRecord: $RE_FUNC_SAVE_REC.test(script) ? $RE_FUNC_SAVE_REC.exec(script)[2] : 'saveRecord'
            };
            break;
        case 'schedule':
            nsObj.function = $RE_FUNC_PROCESS.test(script) ? $RE_FUNC_PROCESS.exec(script)[2] : 'process';
            break;
        case 'suitelet':
            nsObj.function = $RE_FUNC_EXECUTE.test(script) ? $RE_FUNC_EXECUTE.exec(script)[2] : 'execute';
            break;
        case 'restlet':
            nsObj.functions = {
                get: $RE_FUNC_GET.test(script) ? $RE_FUNC_GET.exec(script)[2] : 'get',
                delete: $RE_FUNC_DELETE.test(script) ? $RE_FUNC_DELETE.exec(script)[2] : 'delete',
                post: $RE_FUNC_POST.test(script) ? $RE_FUNC_POST.exec(script)[2] : 'post',
                put: $RE_FUNC_PUT.test(script) ? $RE_FUNC_PUT.exec(script)[2] : 'put'
            };
            break;
        case 'user-event':
            nsObj.functions = {
                beforeLoad: $RE_FUNC_BEFORE_LOAD.test(script) ? $RE_FUNC_BEFORE_LOAD.exec(script)[2] : 'beforeLoad',
                beforeSubmit: $RE_FUNC_BEFORE_SMT.test(script) ? $RE_FUNC_BEFORE_SMT.exec(script)[2] : 'beforeSubmit',
                afterSubmit: $RE_FUNC_AFTER_SMT.test(script) ? $RE_FUNC_AFTER_SMT.exec(script)[2] : 'afterSubmit'
            };
            break;
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

    return nsObj;
};
