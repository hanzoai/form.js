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
    var Emitter;
    Emitter = require('little-emitter/emitter');
    (function () {
      var emitter, form, getLastTag, init, script;
      emitter = new Emitter;
      getLastTag = function (selector) {
        var tag, tags;
        tags = document.getElementsByTagName(selector);
        tag = tags[tag.length - 1];
        return tag
      };
      script = getLastTag('script');
      form = getLastTag('form');
      init = function () {
        return form.getElementsByTagName('input')
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
      if (window.addEventListener) {
        window.addEventListener('load', init, false)
      } else if (window.attachEvent) {
        window.attachEvent('onload', init)
      }
      return emitter
    }())
  });
  require('./index')
}.call(this, this))//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9saXR0bGUtZW1pdHRlci9lbWl0dGVyLmpzIiwiaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInNsaWNlIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJwcm90byIsIkVtaXR0ZXIiLCJvYmoiLCJfZXZlbnRzIiwibWl4aW4iLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0eXBlIiwiZm4iLCJwdXNoIiwib25lIiwib25jZSIsIndyYXBwZXIiLCJvZmYiLCJhcHBseSIsImFyZ3VtZW50cyIsInJlbW92ZUFsbExpc3RuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImV2ZW50cyIsImxlbmd0aCIsImxpc3RlbmVyIiwiaSIsInNwbGljZSIsImVtaXQiLCJ0cmlnZ2VyIiwibGVuIiwiY2FsbCIsImxpc3RlbmVycyIsImZsYXR0ZW5FdmVudHMiLCJvYmoxIiwib2JqMiIsInAiLCJPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbmNhdCIsInJlcXVpcmUiLCJlbWl0dGVyIiwiZm9ybSIsImdldExhc3RUYWciLCJpbml0Iiwic2NyaXB0Iiwic2VsZWN0b3IiLCJ0YWciLCJ0YWdzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImF0dGFjaEV2ZW50IiwicmVhZHlTdGF0ZSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBRSxVQUFTQSxJQUFULEVBQWVDLE9BQWYsRUFBd0I7QUFBQSxNQUl4QjtBQUFBO0FBQUEsVUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxNQUFBLENBQU9DLEdBQTNDLEVBQWdEO0FBQUEsUUFFOUM7QUFBQSxRQUFBRCxNQUFBLENBQU9ELE9BQVAsQ0FGOEM7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aEhjO0FBQUEsS0FmckIsQzs7OztJQ05GLElBQUFBLE9BQUEsQztJQUFBQSxPQUFBLEdBQVVrQyxPQUFBLENBQVEsd0JBQVIsQ0FBVixDO0lBRUc7QUFBQSxNQUNELElBQUFDLE9BQUEsRUFBQUMsSUFBQSxFQUFBQyxVQUFBLEVBQUFDLElBQUEsRUFBQUMsTUFBQSxDQURDO0FBQUEsTUFDREosT0FBQSxHQUFVLElBQUluQyxPQUFkLENBREM7QUFBQSxNQUlEcUMsVUFBQSxHQUFhLFVBQUNHLFFBQUQ7QUFBQSxRQUVYLElBQUFDLEdBQUEsRUFBQUMsSUFBQSxDQUZXO0FBQUEsUUFFWEEsSUFBQSxHQUFPQyxRQUFBLENBQVNDLG9CQUFULENBQThCSixRQUE5QixDQUFQLENBRlc7QUFBQSxRQUtYQyxHQUFBLEdBQU1DLElBQUEsQ0FBTUQsR0FBQSxDQUFJdkIsTUFBSixHQUFhLENBQW5CLENBQU4sQ0FMVztBQUFBLFFBTVgsT0FBT3VCLEdBTkk7QUFBQSxPQUFiLENBSkM7QUFBQSxNQVlERixNQUFBLEdBQVVGLFVBQUEsQ0FBVyxRQUFYLENBQVYsQ0FaQztBQUFBLE1BYURELElBQUEsR0FBVUMsVUFBQSxDQUFXLE1BQVgsQ0FBVixDQWJDO0FBQUEsTUFlREMsSUFBQSxHQUFPO0FBQUEsUSxPQUNMRixJQUFBLENBQUtRLG9CQUFMLENBQTBCLE9BQTFCLENBREs7QUFBQSxPQUFQLENBZkM7QUFBQSxNLElBbUJFRCxRQUFBLENBQVN0QyxnQixFQUFaO0FBQUEsUUFDRXNDLFFBQUEsQ0FBU3RDLGdCQUFULENBQTBCLGtCQUExQixFQUE4Q2lDLElBQTlDLEVBQW9ELEtBQXBELENBREY7QUFBQSxPLFVBRVFLLFFBQUEsQ0FBU0UsVztRQUNmRixRQUFBLENBQVNFLFdBQVQsQ0FBcUIsb0JBQXJCLEVBQTJDO0FBQUEsVSxJQUMvQkYsUUFBQSxDQUFTRyxVQUFULEtBQXVCLFU7bUJBQWpDUixJQUFBLEU7V0FEeUM7QUFBQSxTQUEzQyxDO09BdEJEO0FBQUEsTSxJQXlCRVMsTUFBQSxDQUFPMUMsZ0IsRUFBVjtBQUFBLFFBQ0UwQyxNQUFBLENBQU8xQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQ2lDLElBQWhDLEVBQXNDLEtBQXRDLENBREY7QUFBQSxPLFVBRVFTLE1BQUEsQ0FBT0YsVztRQUNiRSxNQUFBLENBQU9GLFdBQVAsQ0FBbUIsUUFBbkIsRUFBNkJQLElBQTdCLEM7T0E1QkQ7QUFBQSxNQThCRCxPQUFPSCxPQTlCTjtBQUFBLFEiLCJzb3VyY2VSb290IjoiL3NyYyJ9