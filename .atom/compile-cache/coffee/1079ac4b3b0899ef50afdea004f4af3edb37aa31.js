(function() {
  var BrowserPlus, BrowserPlusModel, BrowserPlusView, CompositeDisposable, fs;

  CompositeDisposable = require('atom').CompositeDisposable;

  BrowserPlusModel = require('./browser-plus-model');

  BrowserPlusView = require('./browser-plus-view');

  fs = require('fs');

  module.exports = BrowserPlus = {
    browserPlusView: null,
    subscriptions: null,
    config: {
      fav: {
        title: 'No of Favorites',
        type: 'number',
        "default": 10
      },
      history: {
        title: 'No of Days of History',
        type: 'number',
        "default": 5
      },
      homepage: {
        title: 'HomePage',
        type: 'string',
        "default": 'http://www.google.com'
      },
      preview: {
        title: 'Allow Preview',
        type: 'boolean',
        "default": true
      }
    },
    activate: function(state) {
      var d, date, days, oneDay, resources, today, val;
      this.history = state.history || [];
      this.fav = state.fav || [];
      resources = "" + (atom.packages.getLoadedPackage('browser-plus').path) + "/resources/";
      this.js = fs.readFileSync("" + resources + "browser-plus-client.js", 'utf-8');
      this.CSSjs = fs.readFileSync("" + resources + "CSSUtilities.js", 'utf-8');
      this.JQueryjs = fs.readFileSync("" + resources + "jquery-1.11.3.min.js", 'utf-8');
      this.Selectorjs = fs.readFileSync("" + resources + "selector.js", 'utf-8');
      atom.workspace.addOpener((function(_this) {
        return function(uri, opt) {
          var bp, path;
          path = require('path');
          if (path.extname(uri) === '.htmlp' || uri.indexOf('http:') === 0 || uri.indexOf('https:') === 0 || uri.indexOf('localhost') === 0 || uri.indexOf('file:') === 0 || uri.indexOf('browser-plus:') === 0) {
            uri = uri.replace('localhost', 'http://127.0.0.1');
            bp = new BrowserPlusModel(_this, uri, opt.src);
            if (uri.indexOf('browser-plus://history') === 0) {
              bp.on('destroyed', function() {
                return _this.histView = void 0;
              });
            }
            return bp;
          }
        };
      })(this));
      oneDay = 24 * 60 * 60 * 1000;
      for (date in history) {
        val = history[date];
        d = new Date(date);
        today = new Date();
        days = Math.round(Math.abs((today.getTime() - d.getTime()) / oneDay));
        if (days > atom.config.get('browser-plus.history')) {
          delete history[date];
        }
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'browser-plus:history': (function(_this) {
          return function() {
            return _this.hist();
          };
        })(this)
      }));
    },
    open: function(uri, split, src) {
      if (uri == null) {
        uri = atom.config.get('browser-plus.homepage');
      }
      if (!split) {
        split = this.getPosition();
      }
      return atom.workspace.open(uri, {
        split: split,
        src: src
      });
    },
    hist: function(uri, side) {
      if (uri == null) {
        uri = 'browser-plus://history';
      }
      if (side == null) {
        side = 'right';
      }
      return atom.workspace.open(uri, {
        split: side
      });
    },
    getPosition: function() {
      var activePane, orientation, paneAxis, paneIndex, _ref;
      activePane = atom.workspace.paneForItem(atom.workspace.getActiveTextEditor());
      if (!activePane) {
        return;
      }
      paneAxis = activePane.getParent();
      if (!paneAxis) {
        return;
      }
      paneIndex = paneAxis.getPanes().indexOf(activePane);
      orientation = (_ref = paneAxis.orientation) != null ? _ref : 'horizontal';
      if (orientation === 'horizontal') {
        if (paneIndex === 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {
        if (paneIndex === 0) {
          return 'down';
        } else {
          return 'top';
        }
      }
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {
      return {
        history: this.history,
        fav: this.fav
      };
    }
  };

}).call(this);
