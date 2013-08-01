define(function() {
  
  var _DEBUG = false;
  function log() {
    if (_DEBUG) console.log.apply(console, arguments);
  }
  
  log("[Backapp] Loading application module...");

  var app = {};
  var cache, router, Vm;
  var config = {}, g = {};
  var __g = {};
  _.extend(app, Backbone.Events);

  // application state
  var running = false;

  app.isRunning = function() {
    return running;
  };

  /**
   * Application configuration
   * @param {type} options
   * @returns {undefined}
   */
  app.configure = function(options) {
    var obj = options;
    if (_.isFunction(options)) {
      obj = options();
    }
    if (_.isObject(obj)) {
      _.extend(config, obj);
    }
  };
  
  /**
   * Initialize global variables
   * @param {type} globals
   * @returns {undefined}
   */
  app.initGlobals = function (globals) {
    if (_.isObject(globals)) {
      __g = {};
      _.extend(__g, globals);
      _.extend(g, __g);
    }
  };

  /**
   * Setup global events to attach to all Backbone Views
   * Correctly prevents event bubbling
   * @param {type} events
   * @returns {undefined}
   */
  app.setupEvents = function(events) {
    if (_.isObject(events) && !_.isEmpty(events)) {
      var init_proto = Backbone.View.prototype.initialize;
      // attache global view events
      _.extend(Backbone.View.prototype, {
        initialize: function() {
          var self = this;
          init_proto.apply(this, arguments);
          this.events = this.events || {};
          for (var key in events) {
            // prevent event bubbling with global events
            events[key] = (function (handler) {                            
              return function (e) {
                // cancel bubbling
                e.stopImmediatePropagation();
                // get and run event callback
                if (_.isString(handler)) {
                  handler = self[handler];
                }
                if (_.isFunction(handler)) {
                  handler(e);
                }
              };          
            })(events[key]);
          }
          _.extend(this.events, events);
        }
      });
    }
  };

  /**
   * Start the application
   * @returns {undefined}
   */
  app.run = function() {
    if (running) {
      log("[Backapp] Application is running...");
      return;
    }
    log("[Backapp] Starting application...");
    running = true;
    // reset application variables
    app.reset();
    log("[Backapp] Application has started!");
    // use pushState for clean urls
    Backbone.history.start({pushState: true});
  };
  
  /**
   * Reset the application globals and cache
   * @returns {undefined}
   */
  app.reset = function() {
    _.extend(g, __g);
    cache.clear();
    app.trigger("reset");
  };

  /**
   * Shutdown the application
   * @returns {undefined}
   */
  app.shutdown = function() {
    log("[Backapp] Application is shutting down...");
    // rest application
    app.reset();
    running = false;
    app.trigger("shutdown");
    log("[Backapp] Completed shutdown!");
  };

  /**
   * Refresh current view of the application without reloading page
   * @returns {undefined}
   */
  app.refresh = function() {
    var fragment = Backbone.history.fragment;
    // HACK: invalidate current fragment in order to do a local refresh
    // directly triggering current route does not work in Backbone
    Backbone.history.fragment = "#__invalid__route__00000" + new Date();
    router.navigate(fragment, {trigger: true, replace: true});
  };

  /**
   * Template renderer for the application. This makes swapping templates very simple
   * @param {type} source
   * @param {type} context
   * @returns {unresolved}
   */
  app.renderTemplate = function(source, context) {
    context = context || {};
    _.extend(context, {
      g: g,
      config: config
    });
    return _.template(source, context);
  };

  // makeClass - By John Resig (MIT Licensed)
  app.makeClass = function() {
    return function(args) {
      if (this instanceof arguments.callee) {
        if (typeof this.initialize === "function") {
          this.initialize.apply(this, args.callee ? args : arguments);
        }
      } else {
        return new arguments.callee(arguments);
      }
    };
  };

  //////////////////////////////////////////////

  router = (function() {
    log("[Backapp] Loading router module...");

    // filters for routes
    var Filters = {};
    // backup to avoid creating mutliple wrappers on several calls to beforeFilter
    var loadUrl = Backbone.history.loadUrl;
    var _layout;

    // application router instance
    var router = new Backbone.Router();

    /**
     * Loads and renders a layout
     * @param {String} layout of layout view
     * @param {Function} callback to run after rendering layout
     * @param {Array} args Arguments to pass to callback
     * @returns {undefined}
     */
    function useLayout(layout, callback, args) {      
      var name, viewArgs = {};
      if (_.isArray(layout)) {
        name = layout[0];
        viewArgs = layout[1];
      } else {
        name = layout;
      }
      log("[Backapp] Using layout %s.html", name);
      // load layout to use for a view
      require(['layouts/' + name], function(Layout) {
        if (_layout !== name) {
          _layout = name;
          Vm.create(document, "Layout", Layout, viewArgs).render();
        }
        if (typeof callback === "function") {
          callback.apply(router, args);
        }
      });
    }

    /**
     * Applies an array of filters on the given callback
     * @param {Function} callback
     * @returns {unresolved}
     */
    function applyFilters(callback) {
      var filters = Array.prototype.slice.call(arguments);
      filters = filters.slice(1);
      if (filters.length === 1 && _.isArray(filters[0])) {
        filters = filters[0];
      }

      return function() {
        var args = arguments;
        var fn = function() {
          if (typeof callback === "function") {
            callback.apply(null, args);
          }
        };
        // decorate the callback
        filters.reverse().forEach(function(val) {
          // val can be a function in the util module or a function pointer
          if (typeof val === "string" && val in Filters) {
            val = Filters[val];
          }
          if (typeof val === "function") {
            fn = (function(cb) {
              return function() {
                if (false !== val()) {
                  cb();
                }
              };
            })(fn);
          } else {
            log("[Backapp] Invalid filter: %s", val);
          }
        });
        // sweet!
        fn();
      };
    }

    /**
     * Loads and renders a view
     * @param {Object} options
     * @returns {Function} route handler
     */
    function makeRoute(options) {
      options = options || {};
      
      if (!_.has(options, "name")) {
        return false;
      }

      var fn;
      
      if (_.has(options, "view")) {
        var name, viewArgs = {};
        if (_.isArray(options.view)) {
          name = options.view[0];
          viewArgs = options.view[1];
        } else {
          name = options.view;
        }
        
        fn = function() {
          var args = Array.prototype.slice.call(arguments);
          require(['views/' + name], function(View) {
            var viewObj = Vm.create(document, name, View, viewArgs);
            viewObj.render.apply(viewObj, args);
          });
        };
      } else {
        fn = function () {
          if (_.isFunction(router[options["name"]])) {
            router[options["name"]].apply(router, arguments);
          } else {
            log("[Backapp] No handler was found for the route '%s'", options.name);
          }
        };
      }

      if (_.has(options, "layout")) {
        fn = (function(cb) {
          return function() {
            useLayout(options["layout"], cb, arguments);
          };
        })(fn);
      }
      // apply filters
      if (_.has(options, "filters")) {
        fn = applyFilters(fn, options["filters"]);
      }
      
      return fn;
    }

    function initialize(appRoutes) {
      var method, options, url;
      var routes = [];
      
      for (var key in appRoutes) {
        routes.unshift([key, appRoutes[key]]);
      }
      
      for (var i = 0; i < routes.length; i++) {
        url = routes[i][0];
        options = routes[i][1];
        method = makeRoute(options);
        if (method !== false) {
          router.route(url, options["name"], method);
        }
      }
    }

    function navigate() {
      router.navigate.apply(router, arguments);
    }

    function route() {
      router.route.apply(router, arguments);
    }

    function on(event, callback) {
      router.on(event, callback);
    }

    /**
     * Register a filter with the router.
     * A filter MUST explicitly return false to prevent routing
     * TODO: should update this implementation to use promises
     * @param {type} name
     * @param {type} fn
     * @returns {undefined}
     */
    function addFilter(name, fn) {
      Filters[name] = fn;
    }

    /**
     * Remove filters
     * @param {type} name
     * @returns {undefined}
     */
    function removeFilter(name) {
      if (_.isFunction(Filters[name])) {
        delete Filters[name];
      }
    }

    function beforeFilter(callback) {
      // wrap loadUrl to handle before and after events
      // credit: http://stackoverflow.com/questions/8922557/backbone-router-events
      Backbone.history.loadUrl = (function(original) {
        return function() {
          var args = arguments;
          callback(function() {
            original.apply(Backbone.history, args);
          });
        };
      })(loadUrl);
    }

    return {
      on: on,
      initialize: initialize,
      route: route,
      navigate: navigate,
      addFilter: addFilter,
      removeFilter: removeFilter,
      beforeFilter: beforeFilter
    };
  })();

  ////////////// CACHE ///////////////////////
  cache = (function() {
    log("[Backapp] Loading cache module...");
    var Stores = (function() {
      /**
       * wraps JSON so we can use a JSON encoder which uses toString and fromString or parse and stringify
       */
      var JSONWrapper = function() {
        var my = {
          /**
           * passes control to the JSON object; defaults to JSON.stringify
           */
          toString: function() {
            return JSON.stringify(arguments);
          },
          /**
           * passes control to the JSON object; defaults to JSON.parse
           */
          fromString: function() {
            return JSON.parse(arguments);
          },
          /**
           * sets toString handler
           * @param func reference to toString function, eg this.set_toString(JSON.stringify);
           */
          set_toString: function(func) {
            my.toString = function() {
              // send all arguments to the desired function as an array
              var args = Array.prototype.slice.call(arguments);
              return func(args);
            };
          },
          /**
           * sets fromString handler
           * @param func reference to fromString function, eg this.set_toString(JSON.parse);
           */
          set_fromString: function(func) {
            my.fromString = function() {
              // send all arguments to the desired function as an array
              var args = Array.prototype.slice.call(arguments);
              return func(args);
            };
          }
        };

        return my;
      };

      /**
       * arrayStore - the default Cache storage
       */
      var arrayStore = function() {
        var myStore = Array();

        var my = {
          has: function(key) {
            return (typeof myStore[key] !== "undefined");
          },
          get: function(key) {
            return myStore[key];
          },
          set: function(key, val) {
            myStore[key] = val;
          },
          kill: function(key) {
            delete myStore[key];
          },
          clear: function() {
            myStore = Array();
          }
        };

        return my;
      };

      /**
       * localStorageStore.
       */
      var localStorageStore = function() {
        var prefix = "CacheJS_LS"; // change this if you're developing and want to kill everything ;0)

        var my = {
          has: function(key) {
            return (localStorage[prefix + key] !== null);
          },
          get: function(key) {
            if (!my.has(key)) {
              return undefined;
            } else {
              return JSON.parse(localStorage[prefix + key]);
            }
          },
          set: function(key, val) {
            if (val === undefined) {
              my.kill(key);
            } else {
              localStorage[prefix + key] = JSON.stringify(val);
            }
          },
          kill: function(key) {
            //delete localStorage[prefix+key]; // not supported in IE8
            localStorage.removeItem(prefix + key);
          },
          clear: function() {
            for (var key in localStorage) {
              if (key.indexOf(prefix) === 0) {
                localStorage.removeItem(key);
              }
            }
          }
        };

        if (window.localStorage) {
          return my;
        } else {
          // localStorage not supported on this browser; degrade to arrayStore.
          return arrayStore();
        }
      };

      /**
       * Cookie Monster Want Cookies.
       * I don't recommend the use of this store really; cookies have limited length, and you can only have a limited number of cookies per domain
       * It's really only included to show how flexible the pluggable storage system is.
       */
      var cookieStore = function() {
        // uses cookie functions from http://www.quirksmode.org/js/cookies.html
        var prefix = "CacheJS_CS";
        var cookieContents;

        var my = {
          has: function(key) {
            return (my.get(key) !== undefined);
          },
          get: function(key) {
            var nameEQ = prefix + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
              }
              if (c.indexOf(nameEQ) === 0) {
                // found our cookie; split it out for the specified key
                cookieContents = JSON.parse(c.substring(nameEQ.length, c.length));
                if (key) {
                  return cookieContents[key];
                } else {
                  return cookieContents;
                }
              }
            }
            return undefined;
          },
          set: function(key, val) {
            cookieContents = my.get();
            if (cookieContents === null) {
              cookieContents = Object();
            }
            cookieContents[key] = val;
            document.cookie = prefix + "=" + JSON.stringify(cookieContents) + "; path=/";
          },
          kill: function(key) {
            my.set(key, undefined);
          },
          clear: function() {
            cookieContents = Object();
            document.cookie = prefix + "=" + JSON.stringify(cookieContents) + "; path=/";
          }
        };

        return my;
      };

      return {
        cookieStore: cookieStore,
        localStorageStore: localStorageStore,
        arrayStore: arrayStore
      };
    })();

    /**
     * CacheJS - implements a key/val store with expiry.
     * Swappable storage modules (array, cookie, localstorage)
     * Homepage: http://code.google.com/p/cachejs
     */
    var cache = function() {

      /* public */
      var my = {
        /**
         * Sets the storage object to use.
         * On invalid store being passed, current store is not affected.
         * @param new_store store.
         * @return boolean true if new_store implements the required methods and was set to this cache's store. else false
         */
        setStore: function(name) {
          var new_store = Stores[name];
          if (typeof new_store === "function") {
            new_store = new_store();
            if (new_store.get && new_store.set && new_store.kill && new_store.has) {
              store = new_store;
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        },
        /**
         * Returns true if cache contains the key, else false
         * @param key string the key to search for
         * @return boolean
         */
        has: function(key) {
          return store.has(key);
        },
        /**
         * Removes a key from the cache
         * @param key string the key to remove for
         * @return boolean
         */
        kill: function(key) {
          store.remove(key);
          return store.has(key);
        },
        /**
         * Gets the expiry date for given key
         * @param key string. The key to get
         * @return mixed, value for key or NULL if no such key
         */
        getExpiry: function(key) {
          var exp = get(key, EXPIRES);
          if (exp !== false && exp !== null) {
            exp = new Date(exp);
          }
          return exp;
        },
        /**
         * Sets the expiry date for given key
         * @param key string. The key to set
         * @param expiry; RFC1123 date or false for no expiry
         * @return mixed, value for key or NULL if no such key
         */
        setExpiry: function(key, expiry) {
          if (store.has(key)) {
            storedVal = store.get(key);
            storedVal[EXPIRES] = makeValidExpiry(expiry);
            store.set(key, storedVal);
            return my.getExpiry(key);
          } else {
            return NOSUCHKEY;
          }
        },
        /**
         * Gets a value from the cache
         * @param key string. The key to fetch
         * @return mixed or NULL if no such key
         */
        get: function(key) {
          return get(key, VALUE);
        },
        /**
         * Sets a value in the cache, returns true on sucess, false on failure.
         * @param key string. the name of this cache object
         * @param val mixed. the value to return when querying against this key value
         * @param expiry timespan String, optional. If not set and is a new key, or set to false, this key never expires
         *                       If not set and is pre-existing key, no change is made to expiry date
         *                       If set to date, key expires on that date.
         *                       Metric defaults to seconds if not specified. Allowed metrics are "hr,min,sec"
         *                       Negative values will expire cache iff it was set with an expiry - use kill for the same effect
         *                       Examples: "20", 20, 300, "-20min", "1hr", "10sec" etc.
         */
        set: function(key, val, expiry) {

          if (!store.has(key)) {
            // key did not exist; create it
            storedVal = Array();
            storedVal[EXPIRES] = makeValidExpiry(expiry);
            store.set(key, storedVal);
          } else {
            // key did already exist
            storedVal = store.get(key);
            if (typeof expiry !== "undefined") {
              // If we've been given an expiry, set it
              storedVal[EXPIRES] = makeValidExpiry(expiry);
            } // else do not change the existent expiry
          }

          // always set the value
          storedVal[VALUE] = val;
          store.set(key, storedVal);

          return my.get(key);
        },
        /**
         * Clears all values from cache
         * @returns {undefined}
         */
        clear: function() {
          store.clear();
        }
      };
      /* /public */

      /* private */
      var store = Stores['arrayStore'].apply(null);
      var NOSUCHKEY = null;
      var VALUE = 0;
      var EXPIRES = 1;
      var storedVal;
      var rx = /^([\+\-]?\d+)(hr|min|sec)?$/;

      function get(key, part) {
        if (store.has(key)) {
          // this key exists:
          // get the value
          storedVal = store.get(key);

          var now = new Date();
          if (storedVal[EXPIRES] && Date.parse(storedVal[EXPIRES]) <= now) {
            // key has expired
            // remove from memory
            store.kill(key);
            // return NOSUCHKEY
            return NOSUCHKEY;
          } else if (typeof storedVal[part] !== "undefined") {
            // not expired or never expires, and part exists in store[key]
            return storedVal[part];
          } else {
            // part is not a member of store[key]
            return NOSUCHKEY;
          }
        } else {
          // no such key
          return NOSUCHKEY;
        }
      }

      function makeValidExpiry(expiry) {
        if (!expiry) {
          // no expiry given; change from "undefined" to false - this value does not expire.
          expiry = false;
        } else {
          // force to date type
          var c = expiry.match(rx);
          var seconds;
          if (c && c.length > 1) {
            seconds = parseInt(c[1]);
            if (typeof c[2] !== "undefined") {
              // hr or min
              if (c[2] === "hr") {
                seconds = seconds * 60 * 60;
              } else if (c[2] === "min") {
                seconds = seconds * 60;
              }
            }
            expiry = new Date();
            expiry.setSeconds(seconds + expiry.getSeconds());
          } else {
            expiry = false;
          }
        }
        return expiry;
      }

      /* /private */
      return my;
    };

    return cache();
  })();

  //////////////////// View Manager ////////////////////////

  // Use this as a quick template for future modules
  // view manager: manages creation and destroying of views
  // credits: https://github.com/thomasdavis/backboneboilerplate
  Vm = (function() {
    log("[Backapp] Loading view manager module...");
    var views = {};
    var create = function(context, name, View, options) {
      // View clean up isn't actually implemented yet but will simply call .clean, .remove and .unbind
      if (typeof views[name] !== 'undefined') {
        views[name].undelegateEvents();
        if (typeof views[name].clean === 'function') {
          views[name].clean();
        }
      }
      var view = new View(options);
      views[name] = view;
      if (typeof context.children === 'undefined') {
        context.children = {};
        context.children[name] = view;
      } else {
        context.children[name] = view;
      }
      return view;
    };

    var get = function(name) {
      return (typeof views[name] !== "undefined") ? views[name] : false;
    };

    return {
      create: create,
      get: get
    };
  })();

  _.extend(app, {
    config: config,
    router: router,
    Vm: Vm,
    g: g
  });

  return app;
});
