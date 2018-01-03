'use strict';

var One = dts.Backbone.Model.Base.extend({});
var Two = dts.Backbone.Model.Base.extend({
  attributeTypes: {
    one: One,
    two: One
  }
});

var two = new Two({
  one: {
    abc: 'abc',
    def: 'def'
  },
  two: {
    abc: 'abc',
    def: 'def'
  }
});

two.on('change', function () {
  console.log('!!! CHANGE !!!');
});
two.on('change:one', function () {
  console.log('!!! CHANGE : ONE !!!');
});
two.on('change:two', function () {
  console.log('!!! CHANGE : TWO !!!');
});

two.set('hij', 123);
two.unset('hij');
two.get('one').set('ghi', 'ghi');
two.set('one', { abc: 'abc' });
two.unset('two');