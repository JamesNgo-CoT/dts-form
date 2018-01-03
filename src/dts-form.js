
window.dts = window.dts || {}

////////////////////////////////////////////////////////////////////////////////

dts.Backbone = dts.Backbone || {}
dts.Backbone.Collection = dts.Backbone.Collection || {}
dts.Backbone.Model = dts.Backbone.Model || {}
dts.Backbone.View = dts.Backbone.View || {}

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.Collection.Base = Backbone.Collection.extend({
  chainEvent: true,

  add: function(models, opts) {
    return Backbone.Collection.prototype.add.call(models, opts)
  },

  remove: function(models, opts) {
    return Backbone.Collection.prototype.remove.call(models, opts)
  },

  reset: function(models, opts) {
    return Backbone.Collection.prototype.reset.call(models, opts)
  },

  set: function(models, opts) {
    return Backbone.Collection.prototype.set.call(models, opts)
  },

  push: function(models, opts) {
    return Backbone.Collection.prototype.push.call(models, opts)
  },

  pop: function(opts) {
    return Backbone.Collection.prototype.pop.call(opts)
  },

  unshift: function(models, opts) {
    return Backbone.Collection.prototype.unshift.call(models, opts)
  },

  shift: function(opts) {
    return Backbone.Collection.prototype.shift.call(opts)
  },

  slice: function(begin, end) {
    return Backbone.Collection.prototype.slice.call(begin, end)
  },

  sort: function(opts) {
    return Backbone.Collection.prototype.sort.call(opts)
  }
})

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.Model.Base = Backbone.Model.extend({
  attributeTypes: {},

  chainEvent: true,

  set: function(attr, opts, opts2) {
    if (typeof attr === 'string') {
      attr = { [attr]: opts }
      opts = opts2
    }

    for (const k in this.attributeTypes) {
      if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] != null && attr.hasOwnProperty(k) && attr[k] != null) {
        const args = Array.isArray(attr[k]) ? attr[k] : [attr[k]]

        if (typeof this.attributeTypes[k] === 'string' && typeof attr[k] !== this.attributeTypes[k]) {
          switch (this.attributeTypes[k]) {
            case 'boolean':
            attr[k] = (new Boolean(...args)).valueOf()
            break

            case 'number':
            attr[k] = (new Number(...args)).valueOf()
            break

            case 'string':
            attr[k] = (new String(...args)).valueOf()
            break

            case 'function':
            attr[k] = new Function(...args)
            break
          }
        } else if (typeof this.attributeTypes[k] === 'function' && !(attr[k] instanceof this.attributeTypes[k])) {
          attr[k] = new this.attributeTypes[k](...args)
        }
      }
    }

    if (this.chainEvent) {
      for (const k in attr) {
        if (this.get(k) instanceof Backbone.Model) {
          this.stopListening(attr[k], 'change')
        } else if (this.get(k) instanceof Backbone.Collection) {
          this.stopListening(attr[k], 'update')
        }

        if (attr[k] instanceof Backbone.Model) {
          this.listenTo(attr[k], 'change', (...args) => {
            this.trigger('change')
            this.trigger('change:' + k)
          })
        } else if (attr[k] instanceof Backbone.Collection) {
          this.listenTo(attr[k], 'update', () => {
            this.trigger('change')
            this.trigger('change:' + k)
          })
        }
      }
    }

    return Backbone.Model.prototype.set.call(this, attr, opts)
  },

  toJSON: function(opts) {
    const json = Backbone.Model.prototype.toJSON.call(this, opts)

    for (const k in json) {
      if (json.hasOwnProperty(k) && json[k] != null && (json[k] instanceof Backbone.Model || json[k] instanceof Backbone.Collection)) {
        json[k] = json[k].toJSON(opts)
      }
    }

    return json
  }
})

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.View.Base = Backbone.View.extend({})
