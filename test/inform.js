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
  function require(file, cb) {
    // Handle async require
    if (typeof cb == 'function') {
      return require.load(file, cb)
    }
    // Return module from cache
    if ({}.hasOwnProperty.call(require.cache, file))
      return require.cache[file];
    var resolved = require.resolve(file);
    if (!resolved)
      throw new Error('Failed to resolve module ' + file);
    var mod = {
      id: file,
      require: require,
      filename: file,
      exports: {},
      loaded: false,
      parent: null,
      children: []
    };
    var dirname = file.slice(0, file.lastIndexOf('/') + 1);
    require.cache[file] = mod.exports;
    resolved.call(mod.exports, mod, mod.exports, dirname, file, process);
    mod.loaded = true;
    return require.cache[file] = mod.exports
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
  // source: node_modules\little-emitter\emitter.js
  require.define('./node_modules\\little-emitter\\emitter', function (module, exports, __dirname, __filename, process) {
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
  // source: src\index.coffee
  require.define('./index', function (module, exports, __dirname, __filename, process) {
    var Emitter, events;
    Emitter = require('./node_modules\\little-emitter\\emitter');
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
}.call(this, this))