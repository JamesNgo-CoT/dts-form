/* global dts */

const A = dts.Backbone.Model.Base.extend({})

const C = dts.Backbone.Collection.Base.extend({
  model: A
})

const M = dts.Backbone.Model.Base.extend({
  attributeTypes: {
    c: C
  }
})

const c = new C([{ h: 'h' }])

const m = new M({
  abc: 'abc',
  c: c
})

m.on('change', () => console.log('--- CHANGE ---'))

console.log('=== 1 ===')
m.set('abc', '123')

console.log('=== 2 ===')
m.get('c').push([{ a: 'a' }])

console.log('=== 3 ===')
m.get('c').at(0).set('b', 'b')

console.log('=== 4 ===')
m.get('c').reset()

console.log(m, m.toJSON())
