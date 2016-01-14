# nsify
NetSuite-side require() the node.js 

## Required
 * node.js 4+

## Install [![Dependency Status][david-image]][david-url] [![devDependency Status][david-image-dev]][david-url-dev]
```bash
    npm install nsify -save-dev
```

### Usage

```javascript
var nsify = require('nsify'),
    nsObj = nsify('./my-schedule.js');

console.log(nsObj); // see output
```

#### my-schedule.js
```javascript
/**
 * @ns.id: 'sp-schedule'
 * @ns.type: 'schedule'
 * @ns.alias: 'MySchedule'
 * @ns.libs: 'my-lib.js'
 * @ns.function: 'process'
 * @ns.params.param1: {name:'Param 1', type: 'INTEGER'}
 */
'use strict';

module.exports = {
    process: function() {
        nlapiLogExecution('DEBUG', 'nsify', 'test ok!')
    }
}
``` 

#### output my-schedule.js
```json
{
    "id": "sp-schedule",
    "type": "schedule",
    "alias": "MySchedule",
    "function": "MySchedule.process"
    "libs": [
        "my-lib.js"
    ],
    "params": {
        "param1": {"name": "Param 1", "type": "INTEGER"}
    }
}
```