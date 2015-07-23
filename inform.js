(function (global) {
  var process = {
    title: 'browser',
    browser: true,
    env: {},
    argv: [],
    nextTick: function (fn) {
      setTimeout(fn, 0)
    },
    cwd: function () {
      return '/'
    },
    chdir: function () {
    }
  };
  // Require module
  function require(file, callback) {
    if ({}.hasOwnProperty.call(require.cache, file))
      return require.cache[file];
    // Handle async require
    if (typeof callback == 'function') {
      require.load(file, callback);
      return
    }
    var resolved = require.resolve(file);
    if (!resolved)
      throw new Error('Failed to resolve module ' + file);
    var module$ = {
      id: file,
      require: require,
      filename: file,
      exports: {},
      loaded: false,
      parent: null,
      children: []
    };
    var dirname = file.slice(0, file.lastIndexOf('/') + 1);
    require.cache[file] = module$.exports;
    resolved.call(module$.exports, module$, module$.exports, dirname, file);
    module$.loaded = true;
    return require.cache[file] = module$.exports
  }
  require.modules = {};
  require.cache = {};
  require.resolve = function (file) {
    return {}.hasOwnProperty.call(require.modules, file) ? require.modules[file] : void 0
  };
  // define normal static module
  require.define = function (file, fn) {
    require.modules[file] = fn
  };
  // source: /Users/dtai/work/verus/inform/node_modules/little-emitter/emitter.js
  require.define('little-emitter/emitter', function (module, exports, __dirname, __filename) {
    /*!
 * little-emitter - A tiny event emitter for node and browser.
 * https://github.com/Alex1990/little-emitter
 * Under the MIT license | (c)2015 Alex Chao
 */
    !function (root, factory) {
      // Uses CommonJS, AMD or browser global to create a jQuery plugin.
      // See: https://github.com/umdjs/umd
      if (typeof define === 'function' && define.amd) {
        // Expose this plugin as an AMD module. Register an anonymous module.
        define(factory)
      } else if (typeof exports === 'object') {
        // Node/CommonJS module
        module.exports = factory()
      } else {
        // Browser globals
        factory(root)
      }
    }(this, function (root) {
      'use strict';
      // Shortand
      var slice = Array.prototype.slice;
      var proto;
      // Constructor to initialize an `Emitter` instance.
      function Emitter(obj) {
        if (obj) {
          obj._events = {};
          return mixin(obj, proto)
        }
        this._events = {}
      }
      // Shortand
      proto = Emitter.prototype;
      // Add a listener for a given event.
      proto.on = proto.addEventListener = function (type, fn) {
        (this._events[type] = this._events[type] || []).push(fn);
        return this
      };
      // Add a listener for a given event.
      // This listener can be called once, the will be removed.
      proto.one = proto.once = function (type, fn) {
        var wrapper = function () {
          this.off(type, wrapper);
          fn.apply(this, arguments)
        };
        wrapper.fn = fn;
        return this.on(type, wrapper)
      };
      // Remove the all events listeners
      // or remove the given event listeners
      // or remove the specified listener for the given event.
      proto.off = proto.removeAllListners = proto.removeEventListener = function (type, fn) {
        var events = this._events[type];
        if (arguments.length === 0) {
          this._events = {}
        } else if (arguments.length === 1) {
          delete this._events[type]
        } else if (events) {
          var listener;
          for (var i = 0; i < events.length; i++) {
            listener = events[i];
            if (listener === fn || listener.fn === fn) {
              events.splice(i, 1);
              break
            }
          }
          if (!events.length)
            delete this._events[type]
        }
        return this
      };
      // Trigger a given event with optional arguments.
      proto.emit = proto.trigger = function (type) {
        var events = this._events[type];
        if (!events)
          return false;
        for (var i = 0, len = events.length; i < len; i++) {
          events[i].apply(this, slice.call(arguments, 1))
        }
        return true
      };
      // Get the event listeners or all events listeners.
      proto.listeners = function (type) {
        if (type) {
          return this._events[type] ? this._events[type] : []
        } else {
          return flattenEvents(this._events)
        }
      };
      // Helper function
      // ---------------
      function mixin(obj1, obj2) {
        for (var p in obj2) {
          if (Object.prototype.hasOwnProperty.call(obj2, p)) {
            obj1[p] = obj2[p]
          }
        }
        return obj1
      }
      // Extract all event listeners to an array.
      function flattenEvents(events) {
        var listeners = [];
        for (var type in events) {
          if (events.hasOwnProperty(type)) {
            listeners = listeners.concat(events[type])
          }
        }
        return listeners
      }
      if (root) {
        root.Emitter = Emitter
      } else {
        return Emitter
      }
    })
  });
  // source: /Users/dtai/work/verus/inform/src/index.coffee
  require.define('./index', function (module, exports, __dirname, __filename) {
    var Emitter, events;
    Emitter = require('little-emitter/emitter');
    events = {
      InitScript: 'init-inform-script',
      InitForm: 'init-inform-form',
      InitInputs: 'init-inform-inputs',
      InitSubmits: 'init-inform-submits',
      OnSubmit: 'inform-submit',
      OnDone: 'inform-done'
    };
    (function () {
      var emitter, first, form, getLastTag, init, script;
      emitter = new Emitter;
      emitter.Events = events;
      getLastTag = function (selector) {
        var tag, tags;
        tags = document.getElementsByTagName(selector);
        tag = tags[tags.length - 1];
        return tag
      };
      script = getLastTag('script');
      form = getLastTag('form');
      first = true;
      init = function () {
        var button, buttons, i, input, inputs, ins, j, k, len, len1, len2, ondone, onsubmit, submits, type;
        if (first) {
          first = false
        } else {
          return
        }
        emitter.emit(events.InitScript, script);
        emitter.emit(events.InitForm, form);
        submits = [];
        inputs = [];
        ins = form.getElementsByTagName('input');
        for (i = 0, len = ins.length; i < len; i++) {
          input = ins[i];
          if (input.getAttribute('type') !== 'submit') {
            inputs.push(input)
          } else {
            submits.push(input)
          }
        }
        ins = form.getElementsByTagName('select');
        for (j = 0, len1 = ins.length; j < len1; j++) {
          input = ins[j];
          inputs.push(input)
        }
        emitter.emit(events.InitInputs, inputs);
        buttons = form.getElementsByTagName('button');
        for (k = 0, len2 = buttons.length; k < len2; k++) {
          button = buttons[k];
          type = button.getAttribute('type');
          if (type == null || type === 'submit') {
            submits.push(button)
          }
        }
        emitter.emit(events.InitSubmits, submits);
        ondone = function () {
          return emitter.emit(events.OnDone)
        };
        onsubmit = function (event) {
          var done;
          done = function () {
            form.removeEventListener('submit', onsubmit);
            form.addEventListener('submit', ondone);
            return form.dispatchEvent(new Event('submit', {
              bubbles: false,
              cancelable: true
            }))
          };
          emitter.emit(events.OnSubmit, done, event);
          return event.preventDefault()
        };
        return form.addEventListener('submit', onsubmit)
      };
      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', init, false)
      } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
          if (document.readyState === 'complete') {
            return init()
          }
        })
      }
      if (typeof window !== 'undefined' && window !== null) {
        window.Inform = emitter;
        window.Inform.events = events;
        if (window.addEventListener) {
          window.addEventListener('load', init, false)
        } else if (window.attachEvent) {
          window.attachEvent('onload', init)
        }
      }
      return emitter
    }())
  });
  require('./index')
}.call(this, this))//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9saXR0bGUtZW1pdHRlci9lbWl0dGVyLmpzIiwiaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInNsaWNlIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwcm90byIsIkVtaXR0ZXIiLCJvYmoiLCJfZXZlbnRzIiwibWl4aW4iLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0eXBlIiwiZm4iLCJwdXNoIiwib25lIiwib25jZSIsIndyYXBwZXIiLCJvZmYiLCJhcHBseSIsImFyZ3VtZW50cyIsInJlbW92ZUFsbExpc3RuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImV2ZW50cyIsImxlbmd0aCIsImxpc3RlbmVyIiwiaSIsInNwbGljZSIsImVtaXQiLCJ0cmlnZ2VyIiwibGVuIiwiY2FsbCIsImxpc3RlbmVycyIsImZsYXR0ZW5FdmVudHMiLCJvYmoxIiwib2JqMiIsInAiLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbmNhdCIsInJlcXVpcmUiLCJJbml0U2NyaXB0IiwiSW5pdEZvcm0iLCJJbml0SW5wdXRzIiwiSW5pdFN1Ym1pdHMiLCJPblN1Ym1pdCIsIk9uRG9uZSIsImVtaXR0ZXIiLCJmaXJzdCIsImZvcm0iLCJnZXRMYXN0VGFnIiwiaW5pdCIsInNjcmlwdCIsIkV2ZW50cyIsInNlbGVjdG9yIiwidGFnIiwidGFncyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJidXR0b24iLCJidXR0b25zIiwiaW5wdXQiLCJpbnB1dHMiLCJpbnMiLCJqIiwiayIsImxlbjEiLCJsZW4yIiwib25kb25lIiwib25zdWJtaXQiLCJzdWJtaXRzIiwiZ2V0QXR0cmlidXRlIiwiZXZlbnQiLCJkb25lIiwiZGlzcGF0Y2hFdmVudCIsIkV2ZW50IiwiYnViYmxlcyIsImNhbmNlbGFibGUiLCJwcmV2ZW50RGVmYXVsdCIsImF0dGFjaEV2ZW50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QU87QUFBQSxZQUNMeEIsSUFBQSxDQUFLM0IsbUJBQUwsQ0FBeUIsUUFBekIsRUFBbUMrQyxRQUFuQyxFQURLO0FBQUEsWUFFTHBCLElBQUEsQ0FBS3RDLGdCQUFMLENBQXNCLFFBQXRCLEVBQWdDeUQsTUFBaEMsRUFGSztBQUFBLFksT0FJTG5CLElBQUEsQ0FBS3lCLGFBQUwsQ0FBdUIsSUFBQUMsS0FBQSxDQUFNLFFBQU4sRUFDckI7QUFBQSxjQUFBQyxPQUFBLEVBQVksS0FBWjtBQUFBLGNBQ0FDLFVBQUEsRUFBWSxJQURaO0FBQUEsYUFEcUIsQ0FBdkIsQ0FKSztBQUFBLFdBQVAsQ0FEUztBQUFBLFVBVVQ5QixPQUFBLENBQVFuQixJQUFSLENBQWFMLE1BQUEsQ0FBT3NCLFFBQXBCLEVBQThCNEIsSUFBOUIsRUFBb0NELEtBQXBDLEVBVlM7QUFBQSxVLE9BV1RBLEtBQUEsQ0FBTU0sY0FBTixFQVhTO0FBQUEsU0FBWCxDQXRDSztBQUFBLFEsT0FtREw3QixJQUFBLENBQUt0QyxnQkFBTCxDQUFzQixRQUF0QixFQUFnQzBELFFBQWhDLENBbkRLO0FBQUEsT0FBUCxDQWpCQztBQUFBLE0sSUF1RUVaLFFBQUEsQ0FBUzlDLGdCLEVBQVo7QUFBQSxRQUNFOEMsUUFBQSxDQUFTOUMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDd0MsSUFBOUMsRUFBb0QsS0FBcEQsQ0FERjtBQUFBLE8sVUFFUU0sUUFBQSxDQUFTc0IsVztRQUNmdEIsUUFBQSxDQUFTc0IsV0FBVCxDQUFxQixvQkFBckIsRUFBMkM7QUFBQSxVLElBQy9CdEIsUUFBQSxDQUFTdUIsVUFBVCxLQUF1QixVO21CQUFqQzdCLElBQUEsRTtXQUR5QztBQUFBLFNBQTNDLEM7T0ExRUQ7QUFBQSxNLElBNkVFLE9BQUE4QixNQUFBLG9CQUFBQSxNQUFBLFM7UUFDREEsTUFBQSxDQUFPQyxNQUFQLEdBQWdCbkMsT0FBaEIsQztRQUNBa0MsTUFBQSxDQUFPQyxNQUFQLENBQWMzRCxNQUFkLEdBQXVCQSxNQUF2QixDO1FBRUEsSUFBRzBELE1BQUEsQ0FBT3RFLGdCQUFWO0FBQUEsVUFDRXNFLE1BQUEsQ0FBT3RFLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDd0MsSUFBaEMsRUFBc0MsS0FBdEMsQ0FERjtBQUFBLGVBRUssSUFBRzhCLE1BQUEsQ0FBT0YsV0FBVjtBQUFBLFVBQ0hFLE1BQUEsQ0FBT0YsV0FBUCxDQUFtQixRQUFuQixFQUE2QjVCLElBQTdCLENBREc7QUFBQSxTO09BbkZOO0FBQUEsTUFzRkQsT0FBT0osT0F0Rk47QUFBQSxRIiwic291cmNlUm9vdCI6Ii9zcmMifQ==