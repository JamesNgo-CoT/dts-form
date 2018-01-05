/* global Backbone */

/* global dts */
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
    if (models && this.chainEvent) {
      if (!Array.isArray(models)) {
        models = [models]
      }
      const l = models.length
      for (let i = 0; i < l; i++) {
        if (!(models[i] instanceof this.model || models[i] instanceof Backbone.Model)) {
          models[i] = new this.model(models[i])
        }
        this.listenTo(models[i], 'change', () => {
          this.trigger('update')
        })
      }
    }
    Backbone.Collection.prototype.add.call(this, models, opts)
  },

  remove: function(models, opts) {
    if (models && this.chainEvent) {
      if (!Array.isArray(models)) {
        models = [models]
      }
      const l = models.length
      for (let i = 0; i < l; i++) {
        if (models[i] instanceof this.model || models[i] instanceof Backbone.Model) {
          this.stopListening(models[i], 'change')
        }
      }
    }
    Backbone.Collection.prototype.remove.call(this, models, opts)
  },

  reset: function(models, opts) {
    if (this.chainEvent) {
      this.stopListening()
    }
    Backbone.Collection.prototype.reset.call(this, models, opts)
  }
})

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.Model.Base = Backbone.Model.extend({
  attributeTypes: {},

  chainEvent: true,

  set: function(attr, opts, opts2) {

    // Parpare data.
    if (typeof attr === 'string') {
      attr = { [attr]: opts }
      opts = opts2
    }

    // Format data.
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

    // Manage event chain.
    if (this.chainEvent) {
      for (const k in attr) {

        // Remove event chain.
        if (this.get(k) instanceof Backbone.Model) {
          this.stopListening(this.get(k), 'change')
        } else if (this.get(k) instanceof Backbone.Collection) {
          this.stopListening(this.get(k), 'reset')
          this.stopListening(this.get(k), 'sort')
          this.stopListening(this.get(k), 'update')
        }

        // Add event chain.
        if (attr[k] instanceof Backbone.Model) {
          this.listenTo(attr[k], 'change', () => {
            this.trigger('change')
            this.trigger('change:' + k)
          })
        } else if (attr[k] instanceof Backbone.Collection) {
          this.listenTo(attr[k], 'reset', () => {
            this.trigger('change')
            this.trigger('change:' + k)
          })
          this.listenTo(attr[k], 'sort', () => {
            this.trigger('change')
            this.trigger('change:' + k)
          })
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
