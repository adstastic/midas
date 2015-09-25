(function() {
  var continuationLine, emptyLine, objectLiteralLine;

  emptyLine = /^\s*$/;

  objectLiteralLine = /^\s*[\w'"]+\s*\:\s*/m;

  continuationLine = /[\{\(;,]\s*$/;

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'turbo-javascript:end-line': (function(_this) {
          return function() {
            return _this.endLine(';', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'turbo-javascript:end-line-comma': (function(_this) {
          return function() {
            return _this.endLine(',', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'turbo-javascript:end-new-line': (function(_this) {
          return function() {
            return _this.endLine('', true);
          };
        })(this)
      });
      return atom.commands.add('atom-text-editor', {
        'turbo-javascript:wrap-block': (function(_this) {
          return function() {
            return _this.wrapBlock();
          };
        })(this)
      });
    },
    endLine: function(terminator, insertNewLine) {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      return editor.getCursors().forEach(function(cursor) {
        var line;
        line = cursor.getCurrentBufferLine();
        editor.moveToEndOfLine();
        if (!terminator) {
          terminator = objectLiteralLine.test(line) ? ',' : ';';
        }
        if (!continuationLine.test(line) && !emptyLine.test(line)) {
          editor.insertText(terminator);
        }
        if (insertNewLine) {
          return editor.insertNewlineBelow();
        }
      });
    },
    wrapBlock: function() {
      var editor, rangesToWrap;
      editor = atom.workspace.getActiveTextEditor();
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      if (rangesToWrap.length) {
        rangesToWrap.sort(function(a, b) {
          if (a.start.row > b.start.row) {
            return -1;
          } else {
            return 1;
          }
        }).forEach(function(range) {
          var text;
          text = editor.getTextInBufferRange(range);
          if (/^\s*\{\s*/.test(text) && /\s*\}\s*/.test(text)) {
            return editor.setTextInBufferRange(range, text.replace(/\{\s*/, '').replace(/\s*\}/, ''));
          } else {
            return editor.setTextInBufferRange(range, '{\n' + text + '\n}');
          }
        });
        return editor.autoIndentSelectedRows();
      } else {
        editor.insertText('{\n\n}');
        editor.selectUp(2);
        editor.autoIndentSelectedRows();
        editor.moveRight();
        editor.moveUp();
        return editor.moveToEndOfLine();
      }
    }
  };

}).call(this);
