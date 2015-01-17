'use strict';

var Writable = require('../writable');
var Sima = require('sima');

var sima = Sima('example')
  .useDefaultLevels();

sima.pipe(Writable({
  host: 'localhost:9200'
}));

sima.info('hello');
sima.error('hello');
sima.debug('qq');
sima.trace('123123');
