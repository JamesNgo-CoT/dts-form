
const One = dts.Backbone.Model.Base.extend({})
const Two = dts.Backbone.Model.Base.extend({
  attributeTypes: {
    one: One,
    two: One
  }
})

const two = new Two({
  one: {
    abc: 'abc',
    def: 'def'
  },
  two: {
    abc: 'abc',
    def: 'def'
  }
})

two.on('change', () => { console.log('!!! CHANGE !!!') })
two.on('change:one', () => { console.log('!!! CHANGE : ONE !!!') })
two.on('change:two', () => { console.log('!!! CHANGE : TWO !!!') })

two.set('hij', 123)
two.unset('hij')
two.get('one').set('ghi', 'ghi')
two.set('one', { abc: 'abc' })
two.unset('two')
