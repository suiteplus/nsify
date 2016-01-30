'use strict';
var fs = require('fs'),
    nsAnnotation = require('./ns-annotation'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gulp = require('gulp'),
    through = require('through2');


function nsify(scriptPath, opts) {
    opts = opts || {};

    let script = nsAnnotation(scriptPath),
        custom = script.custom || {};
    custom.clientProof = custom.clientProof === 'true' || script.type === 'client';

    let finalName = `${script.id}.js`,
        sobj = {
            alias: script.alias,
            name: finalName,
            config: custom || {}
        },
        name = sobj.name,
        config = sobj.config;

    if (name.indexOf('_') === 0) {
        name = name.substr(1);
    }

    let bns,
        nodeBased = config.noAlias !== 'true';
    if (nodeBased) {
        let prelude = fs.readFileSync(`${__dirname}/other/prelude.js`, 'utf8'),
            opts_ = {
                prelude: prelude
            };
        let bwf = browserify(scriptPath, opts_);
        bwf.pipeline.get('dedupe');
        bns = bwf.bundle()
            .pipe(source(~name.indexOf('.js') ? name : `${name}.js`));
    } else {
        bns = gulp.src(scriptPath);
    }

    return bns.pipe(buffer())
        .pipe(through.obj(function (chunk, enc, cb) {
            var content = chunk.contents.toString();

            content = content.replace(/['"]use strict['"];?/g, '');

            if (nodeBased) {
                let lastFunc = content.lastIndexOf('['),
                    idx = content.substr(lastFunc).replace(/[^\d]/g, '').trim();

                var pre = `var script = `,
                    pos = `\nvar ${sobj.alias} = script(${idx});`,
                    out = pre + content + pos;
                chunk.contents = new Buffer(out);
            } else {
                chunk.contents = new Buffer(content);
            }
            this.push(chunk);
            return cb();
        }));
}
nsify.annotation = nsAnnotation;

module.exports = nsify;