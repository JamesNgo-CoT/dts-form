'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

window.dts = window.dts || {};

////////////////////////////////////////////////////////////////////////////////

dts.Backbone = dts.Backbone || {};
dts.Backbone.Collection = dts.Backbone.Collection || {};
dts.Backbone.Model = dts.Backbone.Model || {};
dts.Backbone.View = dts.Backbone.View || {};

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.Collection.Base = Backbone.Collection.extend({
  chainEvent: true,

  add: function add(models, opts) {
    return Backbone.Collection.prototype.add.call(models, opts);
  }
});

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.Model.Base = Backbone.Model.extend({
  attributeTypes: {},

  chainEvent: true,

  set: function set(attr, opts, opts2) {
    var _this = this;

    if (typeof attr === 'string') {
      attr = _defineProperty({}, attr, opts);
      opts = opts2;
    }

    for (var k in this.attributeTypes) {
      if (this.attributeTypes.hasOwnProperty(k) && this.attributeTypes[k] != null && attr.hasOwnProperty(k) && attr[k] != null) {
        var args = Array.isArray(attr[k]) ? attr[k] : [attr[k]];

        if (typeof this.attributeTypes[k] === 'string' && _typeof(attr[k]) !== this.attributeTypes[k]) {
          switch (this.attributeTypes[k]) {
            case 'boolean':
              attr[k] = new (Function.prototype.bind.apply(Boolean, [null].concat(_toConsumableArray(args))))().valueOf();
              break;

            case 'number':
              attr[k] = new (Function.prototype.bind.apply(Number, [null].concat(_toConsumableArray(args))))().valueOf();
              break;

            case 'string':
              attr[k] = new (Function.prototype.bind.apply(String, [null].concat(_toConsumableArray(args))))().valueOf();
              break;

            case 'function':
              attr[k] = new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(args))))();
              break;
          }
        } else if (typeof this.attributeTypes[k] === 'function' && !(attr[k] instanceof this.attributeTypes[k])) {
          attr[k] = new (Function.prototype.bind.apply(this.attributeTypes[k], [null].concat(_toConsumableArray(args))))();
        }
      }
    }

    if (this.chainEvent) {
      var _loop = function _loop(_k) {
        if (_this.get(_k) instanceof Backbone.Model) {
          _this.stopListening(attr[_k], 'change');
        } else if (_this.get(_k) instanceof Backbone.Collection) {
          _this.stopListening(attr[_k], 'update');
        }

        if (attr[_k] instanceof Backbone.Model) {
          _this.listenTo(attr[_k], 'change', function () {
            _this.trigger('change');
            _this.trigger('change:' + _k);
          });
        } else if (attr[_k] instanceof Backbone.Collection) {
          _this.listenTo(attr[_k], 'update', function () {
            _this.trigger('change');
            _this.trigger('change:' + _k);
          });
        }
      };

      for (var _k in attr) {
        _loop(_k);
      }
    }

    return Backbone.Model.prototype.set.call(this, attr, opts);
  },

  toJSON: function toJSON(opts) {
    var json = Backbone.Model.prototype.toJSON.call(this, opts);

    for (var k in json) {
      if (json.hasOwnProperty(k) && json[k] != null && (json[k] instanceof Backbone.Model || json[k] instanceof Backbone.Collection)) {
        json[k] = json[k].toJSON(opts);
      }
    }

    return json;
  }
});

////////////////////////////////////////////////////////////////////////////////

dts.Backbone.View.Base = Backbone.View.extend({});