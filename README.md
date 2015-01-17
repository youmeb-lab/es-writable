es-writable
===========

ElasticSearch writable stream

```javascript
var Writable = require('es-writable');
var stream = new Writable({
  host: 'localhost:9200'
});

stream.write({/*...*/});
stream.write({/*...*/});
stream.write({/*...*/});
```
