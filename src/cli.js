#!/usr/bin/env node
'use strict';

var yarr = require('yargs')
    .usage('Usage: nsify <file> [options]')
    .demand(1)
    .version(function() {
        return require('../package').version;
    })
    .argv;

var fs = require('fs'),
    path = require('path'),
    files = yarr._,
    file = path.resolve(files[0]);

if (fs.existsSync(file)) {
    var nsify = require('.'),
        cat = require('gulp-cat');
    nsify(file).pipe(cat());
} else {
    console.log('Cannot find file:', files[0]);
}