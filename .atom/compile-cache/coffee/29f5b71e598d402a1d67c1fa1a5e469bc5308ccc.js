(function() {
  var Disposable, Emitter, HTMLEditor, Model, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Disposable = _ref.Disposable, Emitter = _ref.Emitter;

  Model = require('theorist').Model;

  path = require('path');

  module.exports = HTMLEditor = (function(_super) {
    __extends(HTMLEditor, _super);

    function HTMLEditor(browserPlus, uri, src) {
      this.browserPlus = browserPlus;
      this.uri = uri;
      this.src = src;
      this.disposable = new Disposable();
      this.emitter = new Emitter;
    }

    HTMLEditor.prototype.getViewClass = function() {
      return require('./browser-plus-view');
    };

    HTMLEditor.prototype.setText = function(text) {
      return this.view.setSrc(text);
    };

    HTMLEditor.prototype.destroyed = function() {
      return this.emitter.emit('did-destroy');
    };

    HTMLEditor.prototype.onDidDestroy = function(cb) {
      return this.emitter.on('did-destroy', cb);
    };

    HTMLEditor.prototype.getTitle = function() {
      return this.title || path.basename(this.uri);
    };

    HTMLEditor.prototype.getURI = function() {
      var match, regex, _ref1;
      if ((_ref1 = this.src) != null ? _ref1.includes('data:text/html,') : void 0) {
        regex = /<meta\s?\S*?\s?bp-uri=['"](.*?)['"]\S*\/>/;
        match = this.src.match(regex);
        if (match != null ? match[1] : void 0) {
          return this.uri = "browser-plus://preview~" + match[1];
        } else {
          return this.uri = "browser-plus://preview~" + (new Date().getTime()) + ".html";
        }
      } else {
        return this.uri;
      }
    };

    HTMLEditor.prototype.getGrammar = function() {};

    HTMLEditor.prototype.setTitle = function(title) {
      this.title = title;
      return this.emit('title-changed');
    };

    return HTMLEditor;

  })(Model);

}).call(this);
