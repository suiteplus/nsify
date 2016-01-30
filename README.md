# nsify [![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

*NetSuite-side require() the node.js*  

You can use `require()` the node.js freely on yours JavaScripts.

## Required
 * node.js 4+

## Install [![Dependency Status][david-image]][david-url] [![devDependency Status][david-image-dev]][david-url-dev]
```bash
    sudo npm install nsify -g
```

### Command Line
  
  Generate your SuiteScripts:
  
 * input: [restlet-with-require.js](./test/_files/custom/restlet-with-require.js)
 * output: [suite-script-nsify-restlet.js](./test/_files/output/suite-script-nsify-restlet.js) 
 
```bash
    nsify ./test/_files/RE-process-restlet.js >> suite-script-process-restlet.js
```

### Usage NS Annotations

```javascript
var nsify = require('nsify'),
    filePath = './test/_files/custom/schedule-simple.js',
    nsObj = nsify.annotation(filePath);

console.log(nsObj); // see output
```

 * input: [schedule-simple.js](./test/_files/custom/schedule-simple.js)
 * output: 
```json
{
    "id": "sp-schedule",
    "type": "schedule",
    "alias": "MySchedule",
    "function": "MySchedule.process",
    "libs": [
        "my-lib.js"
    ],
    "params": {
        "param1": {"name": "Param 1", "type": "INTEGER"}
    }
}
```

#### Compatibility with [nsmockup](https://github.com/suiteplus/nsmockup)

```javascript
var nsify = require('nsify'),
    nsmockup = require('nsmockup');


nsmockup.init(function() {
    let filePath = './test/_files/custom/schedule-simple.js',
        script = nsify.annotation(filePath, 'nsmockup');

    console.log(script); // see output
    
    nsmockup.createSuiteScript(script.type, script, function($ctx) {
        let alias = script.alias;
        if ($ctx[alias]) {
            console.log(':D works!!');
        }
    });
});

```

[npm-url]: https://npmjs.org/package/nsify
[npm-image]: http://img.shields.io/npm/v/nsify.svg

[travis-url]: https://travis-ci.org/suiteplus/nsify
[travis-image]: https://img.shields.io/travis/suiteplus/nsify.svg

[coveralls-url]: https://coveralls.io/r/suiteplus/nsify
[coveralls-image]: http://img.shields.io/coveralls/suiteplus/nsify/master.svg

[david-url]: https://david-dm.org/suiteplus/nsify
[david-image]: https://david-dm.org/suiteplus/nsify.svg

[david-url-dev]: https://david-dm.org/suiteplus/nsify#info=devDependencies
[david-image-dev]: https://david-dm.org/suiteplus/nsify/dev-status.svg