'use strict';

/* global dts */

var A = dts.Backbone.Model.Base.extend({});

var C = dts.Backbone.Collection.Base.extend({
  model: A
});

var M = dts.Backbone.Model.Base.extend({
  attributeTypes: {
    c: C
  }
});

var c = new C([{ h: 'h' }]);

var m = new M({
  abc: 'abc',
  c: c
});

m.on('change', function () {
  return console.log('--- CHANGE ---');
});

console.log('=== 1 ===');
m.set('abc', '123');

console.log('=== 2 ===');
m.get('c').push([{ a: 'a' }]);

console.log('=== 3 ===');
m.get('c').at(0).set('b', 'b');

console.log('=== 4 ===');
m.get('c').reset();

console.log(m, m.toJSON());