(function() {
  var coffee, vm,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  coffee = require('coffee-script');

  vm = require('vm');

  module.exports = {
    config: {
      openDeveloperToolsOnRun: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      return this.disposable = atom.commands.add('atom-text-editor', 'run-in-atom:run-in-atom', (function(_this) {
        return function() {
          var code, editor, scope;
          if (atom.config.get('run-in-atom.openDeveloperToolsOnRun')) {
            atom.openDevTools();
          }
          editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            console.warn("Run in Atom Warning: No text editor is active.");
            return;
          }
          code = editor.getSelectedText();
          if (code) {
            scope = _this.matchingCursorScopeInEditor(editor);
          } else {
            code = editor.getText();
            scope = _this.scopeInEditor(editor);
          }
          return _this.runCodeInScope(code, scope, function(error, warning, result) {
            if (error) {
              return console.error("Run in Atom Error:", error);
            } else if (warning) {
              return console.warn("Run in Atom Warning:", warning);
            } else {
              return console.log("Run in Atom:", result);
            }
          });
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.disposable) != null ? _ref.dispose() : void 0;
    },
    runCodeInScope: function(code, scope, callback) {
      var error, result, warning;
      switch (scope) {
        case 'source.coffee':
          try {
            result = vm.runInThisContext(coffee.compile(code, {
              bare: true
            }));
            return callback(null, null, result);
          } catch (_error) {
            error = _error;
            return callback(error);
          }
          break;
        case 'source.js':
          try {
            result = vm.runInThisContext(code);
            return callback(null, null, result);
          } catch (_error) {
            error = _error;
            return callback(error);
          }
          break;
        default:
          warning = "Attempted to run in scope '" + scope + "', which isn't supported.";
          return callback(null, warning);
      }
    },
    matchingCursorScopeInEditor: function(editor) {
      var scope, scopes, _i, _len;
      scopes = this.getScopes();
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        if (__indexOf.call(editor.getLastCursor().getScopeDescriptor().scopes, scope) >= 0) {
          return scope;
        }
      }
    },
    getScopes: function() {
      return ['source.coffee', 'source.js'];
    },
    scopeInEditor: function(editor) {
      var _ref;
      return (_ref = editor.getGrammar()) != null ? _ref.scopeName : void 0;
    }
  };

}).call(this);
