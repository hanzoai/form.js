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
        ondone = function (event) {
          return emitter.emit(events.OnDone, event)
        };
        onsubmit = function (event) {
          var done;
          if (event.defaultPrevented) {
            return
          } else {
            event.preventDefault()
          }
          done = function () {
            form.addEventListener('submit', ondone);
            form.removeEventListener('submit', onsubmit);
            return setTimeout(function () {
              return form.dispatchEvent(new Event('submit', {
                bubbles: false,
                cancelable: true
              }))
            }, 500)
          };
          return emitter.emit(events.OnSubmit, done, event)
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
}.call(this, this))//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9saXR0bGUtZW1pdHRlci9lbWl0dGVyLmpzIiwiaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInNsaWNlIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwcm90byIsIkVtaXR0ZXIiLCJvYmoiLCJfZXZlbnRzIiwibWl4aW4iLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0eXBlIiwiZm4iLCJwdXNoIiwib25lIiwib25jZSIsIndyYXBwZXIiLCJvZmYiLCJhcHBseSIsImFyZ3VtZW50cyIsInJlbW92ZUFsbExpc3RuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImV2ZW50cyIsImxlbmd0aCIsImxpc3RlbmVyIiwiaSIsInNwbGljZSIsImVtaXQiLCJ0cmlnZ2VyIiwibGVuIiwiY2FsbCIsImxpc3RlbmVycyIsImZsYXR0ZW5FdmVudHMiLCJvYmoxIiwib2JqMiIsInAiLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbmNhdCIsInJlcXVpcmUiLCJJbml0U2NyaXB0IiwiSW5pdEZvcm0iLCJJbml0SW5wdXRzIiwiSW5pdFN1Ym1pdHMiLCJPblN1Ym1pdCIsIk9uRG9uZSIsImVtaXR0ZXIiLCJmaXJzdCIsImZvcm0iLCJnZXRMYXN0VGFnIiwiaW5pdCIsInNjcmlwdCIsIkV2ZW50cyIsInNlbGVjdG9yIiwidGFnIiwidGFncyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJidXR0b24iLCJidXR0b25zIiwiaW5wdXQiLCJpbnB1dHMiLCJpbnMiLCJqIiwiayIsImxlbjEiLCJsZW4yIiwib25kb25lIiwib25zdWJtaXQiLCJzdWJtaXRzIiwiZ2V0QXR0cmlidXRlIiwiZXZlbnQiLCJkb25lIiwiZGVmYXVsdFByZXZlbnRlZCIsInByZXZlbnREZWZhdWx0Iiwic2V0VGltZW91dCIsImRpc3BhdGNoRXZlbnQiLCJFdmVudCIsImJ1YmJsZXMiLCJjYW5jZWxhYmxlIiwiYXR0YWNoRXZlbnQiLCJyZWFkeVN0YXRlIiwid2luZG93IiwiSW5mb3JtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU1BO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFFLFVBQVNBLElBQVQsRUFBZUMsT0FBZixFQUF3QjtBQUFBLE1BSXhCO0FBQUE7QUFBQSxVQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE1BQUEsQ0FBT0MsR0FBM0MsRUFBZ0Q7QUFBQSxRQUU5QztBQUFBLFFBQUFELE1BQUEsQ0FBT0QsT0FBUCxDQUY4QztBQUFBLE9BQWhELE1BR08sSUFBSSxPQUFPRyxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQUEsUUFFdEM7QUFBQSxRQUFBQyxNQUFBLENBQU9ELE9BQVAsR0FBaUJILE9BQUEsRUFGcUI7QUFBQSxPQUFqQyxNQUdBO0FBQUEsUUFFTDtBQUFBLFFBQUFBLE9BQUEsQ0FBUUQsSUFBUixDQUZLO0FBQUEsT0FWaUI7QUFBQSxLQUF4QixDQWVBLElBZkEsRUFlTSxVQUFTQSxJQUFULEVBQWU7QUFBQSxNQUVyQixhQUZxQjtBQUFBLE1BS3JCO0FBQUEsVUFBSU0sS0FBQSxHQUFRQyxLQUFBLENBQU1DLFNBQU4sQ0FBZ0JGLEtBQTVCLENBTHFCO0FBQUEsTUFNckIsSUFBSUcsS0FBSixDQU5xQjtBQUFBLE1BU3JCO0FBQUEsZUFBU0MsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFBQSxRQUNwQixJQUFJQSxHQUFKLEVBQVM7QUFBQSxVQUNQQSxHQUFBLENBQUlDLE9BQUosR0FBYyxFQUFkLENBRE87QUFBQSxVQUVQLE9BQU9DLEtBQUEsQ0FBTUYsR0FBTixFQUFXRixLQUFYLENBRkE7QUFBQSxTQURXO0FBQUEsUUFLcEIsS0FBS0csT0FBTCxHQUFlLEVBTEs7QUFBQSxPQVREO0FBQUEsTUFrQnJCO0FBQUEsTUFBQUgsS0FBQSxHQUFRQyxPQUFB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