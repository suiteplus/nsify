'use strict';
var fs = require('fs'),
    path = require('path'),
    nsAnnotation = require('./ns-annotation'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gulp = require('gulp'),
    through = require('through2');

function nsify(scriptPath) {
    let script = nsAnnotation(scriptPath),
        custom = script.custom || {};
    custom.clientProof = custom.clientProof === 'true' || script.type === 'client';

    let finalName = `${script.id}.js`,
        config = custom || {};

    if (finalName.indexOf('_') === 0) {
        finalName = finalName.substr(1);
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
            .pipe(source(finalName));
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
                    pos = `\nvar ${script.alias} = script(${idx});`;
                content = pre + content + pos;
            }

            // verify - concat libs
            let filesJs = [];
            if (config.concat) {
                let dirPath = path.dirname(scriptPath),
                    concat = config.concat.split(',');
                for (let c = 0; c < concat.length; c++) {
                    let lib = concat[c];
                    if (!lib || !lib.trim()) {
                        continue;
                    } else {
                        lib = lib.replace(/['"]/g, '').trim();
                        let libPath = path.join(dirPath, lib);
                        filesJs.push(libPath);
                    }
                }
            }

            let that = this,
                chunks = [],
                actual = 0,
                verifyEnd = () => {
                    if (++actual === filesJs.length + 1) {
                        let finalContent = '';
                        for (let k = 0; k < chunks.length; k++) {
                            let libChunk = chunks[k],
                                append = libChunk.contents.toString();
                            finalContent += `${append}\n`;
                        }
                        finalContent += content;

                        chunk.contents = new Buffer(finalContent);
                        that.push(chunk);
                        return cb();
                    }
                };

            for (let f = 0; f < filesJs.length; f++) {
                let libPath = filesJs[f];
                nsify(libPath).pipe(through.obj(function (chunk) {
                    chunks.push(chunk);
                    verifyEnd();
                }));
            }
            verifyEnd();
        }));

}
nsify.annotation = nsAnnotation;

module.exports = nsify;