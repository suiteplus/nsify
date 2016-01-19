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

        libScript && nskObj.files.push([libPath, libScript.alias]);
    });

    let alias = nskObj.alias;
    if (nskObj.functions) {
        let funcs = nskObj.functions;
        Object.keys(nskObj.functions).forEach(func => {
            funcs[func] = `${alias}.${funcs[func]}`;
        });
    } else if (nskObj.function) {
        nskObj.function = `${alias}.${nskObj.function}`;
    }

    ['libs', 'custom'].forEach(prop => {
        delete nskObj[prop];
    });
    return nskObj;
};
