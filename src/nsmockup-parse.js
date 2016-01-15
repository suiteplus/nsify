'use strict';
var path = require('path'),
    nsify = require('./index');

module.exports = (nsObj, filePath) => {
    let nskObj = JSON.parse(JSON.stringify(nsObj));
    if (nskObj.id.indexOf('customscript') !== 0) {
        nskObj.id = `customscript${nskObj.id}`;
    }

    let dir = path.dirname(filePath);
    nskObj.files = [
        [filePath, nskObj.alias]
    ];

    nskObj.libs.forEach(lib => {
        let ext = ~lib.indexOf('.js') ? '' : '.js',
            libPath = path.resolve(`${dir}/${lib}${ext}`),
            libScript = nsify(libPath);

        nskObj.files.push([libPath, libScript.alias]);
    });

    let alias = nskObj.alias,
        scriptObj = require(filePath);
    if (nskObj.functions) {
        let funcs = nskObj.functions;
        Object.keys(nskObj.functions).forEach(func => {
            let funcName = funcs[func].trim();
            funcName = funcName.indexOf(`${alias}.`) === 0 ? funcName.replace(`${alias}.`, '') : funcName;
            if (scriptObj[funcName]) {
                funcs[func] = `${alias}.${funcName}`;
            } else {
                delete funcs[func];
            }
        });
    } else if (nskObj.function) {
        let funcName = nskObj.function.trim();
        funcName = funcName.indexOf(`${alias}.`) === 0 ? funcName.replace(`${alias}.`, '') : funcName;
        if (scriptObj[funcName]) {
            nskObj.function = `${alias}.${funcName}`;
        } else {
            delete nskObj.function;
        }
    }

    ['libs'].forEach(prop => {
        delete nskObj[prop];
    });
    return nskObj;
};
