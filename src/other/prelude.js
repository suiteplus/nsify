/*eslint semi: [0]*/
/*eslint no-unused: [0]*/

// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles
(function outer (modules, cache, entry) {
    function newRequire(name){
        if(!cache[name]) {
            if(!modules[name]) {
                throw 'Cannot find module \'' + name + '\'';
            }
            var m = cache[name] = {exports:{}};
            modules[name][0].call(m.exports, function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports,outer,modules,cache,entry);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) {
        newRequire(entry[i]);
    }

    // Override the current require with this new one
    return newRequire;
})
