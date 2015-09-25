(function() {
  var $, CompositeDisposable, Pty, Task, Terminal, TerminalPlusView, View, lastActiveElement, lastOpenedView, os, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Task = _ref.Task, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, View = _ref1.View;

  Pty = require.resolve('./process');

  Terminal = require('term.js');

  path = require('path');

  os = require('os');

  lastOpenedView = null;

  lastActiveElement = null;

  module.exports = TerminalPlusView = (function(_super) {
    __extends(TerminalPlusView, _super);

    function TerminalPlusView() {
      this.focus = __bind(this.focus, this);
      this.hide = __bind(this.hide, this);
      this.open = __bind(this.open, this);
      this.recieveItemOrFile = __bind(this.recieveItemOrFile, this);
      this.setAnimationSpeed = __bind(this.setAnimationSpeed, this);
      return TerminalPlusView.__super__.constructor.apply(this, arguments);
    }

    TerminalPlusView.prototype.opened = false;

    TerminalPlusView.prototype.animating = false;

    TerminalPlusView.content = function() {
      return this.div({
        "class": 'terminal-plus terminal-view',
        outlet: 'terminalPlusView'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-divider',
            outlet: 'panelDivider'
          });
          _this.div({
            "class": 'btn-toolbar',
            outlet: 'toolbar'
          }, function() {
            _this.button({
              outlet: 'closeBtn',
              "class": 'btn inline-block-tight right',
              click: 'destroy'
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              });
            });
            _this.button({
              outlet: 'hideBtn',
              "class": 'btn inline-block-tight right',
              click: 'hide'
            }, function() {
              return _this.span({
                "class": 'icon icon-chevron-down'
              });
            });
            return _this.button({
              outlet: 'maximizeBtn',
              "class": 'btn inline-block-tight right',
              click: 'maximize'
            }, function() {
              return _this.span({
                "class": 'icon icon-screen-full'
              });
            });
          });
          return _this.div({
            "class": 'xterm',
            outlet: 'xterm'
          });
        };
      })(this));
    };

    TerminalPlusView.prototype.initialize = function() {
      var override;
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close'
      }));
      this.subscriptions.add(atom.tooltips.add(this.hideBtn, {
        title: 'Hide'
      }));
      this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
        title: 'Fullscreen'
      });
      this.subscriptions.add(this.maximizeBtn.tooltip);
      this.prevHeight = atom.config.get('terminal-plus.style.defaultPanelHeight');
      this.xterm.height(0);
      this.setAnimationSpeed();
      atom.config.onDidChange('terminal-plus.style.animationSpeed', this.setAnimationSpeed);
      override = function(event) {
        if (event.originalEvent.dataTransfer.getData('terminal-plus') === 'true') {
          return;
        }
        event.preventDefault();
        return event.stopPropagation();
      };
      this.xterm.on('click', this.focus);
      this.xterm.on('dragenter', override);
      this.xterm.on('dragover', override);
      return this.xterm.on('drop', this.recieveItemOrFile);
    };

    TerminalPlusView.prototype.setAnimationSpeed = function() {
      this.animationSpeed = atom.config.get('terminal-plus.style.animationSpeed');
      if (this.animationSpeed === 0) {
        this.animationSpeed = 100;
      }
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    TerminalPlusView.prototype.recieveItemOrFile = function(event) {
      var dataTransfer, file, _i, _len, _ref2, _results;
      event.preventDefault();
      event.stopPropagation();
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('atom-event') === 'true') {
        return this.input("" + (dataTransfer.getData('text/plain')) + " ");
      } else if (path = dataTransfer.getData('initialPath')) {
        return this.input("" + path + " ");
      } else if (dataTransfer.files.length > 0) {
        _ref2 = dataTransfer.files;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          file = _ref2[_i];
          _results.push(this.input("" + file.path + " "));
        }
        return _results;
      }
    };

    TerminalPlusView.prototype.forkPtyProcess = function(shell, args) {
      var editorPath, home, projectPath, pwd, _ref2;
      if (args == null) {
        args = [];
      }
      projectPath = atom.project.getPaths()[0];
      editorPath = (_ref2 = atom.workspace.getActiveTextEditor()) != null ? _ref2.getPath() : void 0;
      if (editorPath != null) {
        editorPath = path.dirname(editorPath);
      }
      home = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
      switch (atom.config.get('terminal-plus.core.workingDirectory')) {
        case 'Project':
          pwd = projectPath || editorPath || home;
          break;
        case 'Active File':
          pwd = editorPath || projectPath || home;
          break;
        default:
          pwd = home;
      }
      return Task.once(Pty, path.resolve(pwd), shell, args);
    };

    TerminalPlusView.prototype.displayTerminal = function() {
      var args, cols, rows, shell, shellArguments, _ref2;
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      shell = atom.config.get('terminal-plus.core.shell');
      shellArguments = atom.config.get('terminal-plus.core.shellArguments');
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      this.ptyProcess = this.forkPtyProcess(shell, args);
      this.terminal = new Terminal({
        cursorBlink: atom.config.get('terminal-plus.toggles.cursorBlink'),
        scrollback: atom.config.get('terminal-plus.core.scrollback'),
        cols: cols,
        rows: rows
      });
      this.attachListeners();
      this.attachEvents();
      return this.terminal.open(this.xterm.get(0));
    };

    TerminalPlusView.prototype.attachListeners = function() {
      this.ptyProcess.on('terminal-plus:data', (function(_this) {
        return function(data) {
          return _this.terminal.write(data);
        };
      })(this));
      this.ptyProcess.on('terminal-plus:exit', (function(_this) {
        return function() {
          _this.input = function() {};
          _this.resize = function() {};
          if (atom.config.get('terminal-plus.toggles.autoClose')) {
            return _this.destroy();
          }
        };
      })(this));
      this.ptyProcess.on('terminal-plus:title', (function(_this) {
        return function(title) {
          return _this.statusIcon.updateTooltip(title);
        };
      })(this));
      this.ptyProcess.on('terminal-plus:clear-title', (function(_this) {
        return function() {
          return _this.statusIcon.removeTooltip();
        };
      })(this));
      this.terminal.end = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      this.terminal.on("data", (function(_this) {
        return function(data) {
          return _this.input(data);
        };
      })(this));
      return this.terminal.once("open", (function(_this) {
        return function() {
          var autoRunCommand;
          _this.applyStyle();
          _this.focus();
          autoRunCommand = atom.config.get('terminal-plus.core.autoRunCommand');
          if (autoRunCommand) {
            return _this.input("" + autoRunCommand + os.EOL);
          }
        };
      })(this));
    };

    TerminalPlusView.prototype.destroy = function() {
      var _ref2, _ref3;
      this.subscriptions.dispose();
      this.statusIcon.remove();
      this.statusBar.removeTerminalView(this);
      this.detachResizeEvents();
      if (this.panel.isVisible()) {
        this.hide();
        this.onTransitionEnd((function(_this) {
          return function() {
            return _this.panel.destroy();
          };
        })(this));
      }
      if (this.statusIcon && this.statusIcon.parentNode) {
        this.statusIcon.parentNode.removeChild(this.statusIcon);
      }
      if ((_ref2 = this.ptyProcess) != null) {
        _ref2.terminate();
      }
      return (_ref3 = this.terminal) != null ? _ref3.destroy() : void 0;
    };

    TerminalPlusView.prototype.maximize = function() {
      var btn;
      this.subscriptions.remove(this.maximizeBtn.tooltip);
      this.maximizeBtn.tooltip.dispose();
      this.maxHeight = this.prevHeight + $('atom-pane-container').height();
      this.xterm.css('height', '');
      btn = this.maximizeBtn.children('span');
      this.onTransitionEnd((function(_this) {
        return function() {
          return _this.focus();
        };
      })(this));
      if (this.maximized) {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Fullscreen'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.xterm.height(this.prevHeight);
        btn.removeClass('icon-screen-normal').addClass('icon-screen-full');
        return this.maximized = false;
      } else {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Normal'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.xterm.height(this.maxHeight);
        btn.removeClass('icon-screen-full').addClass('icon-screen-normal');
        return this.maximized = true;
      }
    };

    TerminalPlusView.prototype.open = function() {
      if (lastActiveElement == null) {
        lastActiveElement = $(document.activeElement);
      }
      if (lastOpenedView && lastOpenedView !== this) {
        lastOpenedView.hide();
      }
      lastOpenedView = this;
      this.statusBar.setActiveTerminalView(this);
      this.statusIcon.activate();
      this.onTransitionEnd((function(_this) {
        return function() {
          if (!_this.opened) {
            _this.opened = true;
            return _this.displayTerminal();
          } else {
            return _this.focus();
          }
        };
      })(this));
      this.panel.show();
      this.xterm.height(0);
      this.animating = true;
      return this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
    };

    TerminalPlusView.prototype.hide = function() {
      var _ref2;
      if ((_ref2 = this.terminal) != null) {
        _ref2.blur();
      }
      lastOpenedView = null;
      this.statusIcon.deactivate();
      this.onTransitionEnd((function(_this) {
        return function() {
          _this.panel.hide();
          if (lastOpenedView == null) {
            if (lastActiveElement != null) {
              lastActiveElement.focus();
              return lastActiveElement = null;
            }
          }
        };
      })(this));
      this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
      this.animating = true;
      return this.xterm.height(0);
    };

    TerminalPlusView.prototype.toggle = function() {
      if (this.animating) {
        return;
      }
      if (this.panel.isVisible()) {
        return this.hide();
      } else {
        return this.open();
      }
    };

    TerminalPlusView.prototype.input = function(data) {
      this.terminal.stopScrolling();
      this.ptyProcess.send({
        event: 'input',
        text: data
      });
      this.resizeTerminalToView();
      return this.focusTerminal();
    };

    TerminalPlusView.prototype.resize = function(cols, rows) {
      return this.ptyProcess.send({
        event: 'resize',
        rows: rows,
        cols: cols
      });
    };

    TerminalPlusView.prototype.applyStyle = function() {
      var fontFamily, style;
      style = atom.config.get('terminal-plus.style');
      this.xterm.addClass(style.theme);
      fontFamily = ["monospace"];
      if (style.fontFamily !== '') {
        fontFamily.unshift(style.fontFamily);
      }
      this.terminal.element.style.fontFamily = fontFamily.join(', ');
      return this.terminal.element.style.fontSize = style.fontSize + 'px';
    };

    TerminalPlusView.prototype.attachResizeEvents = function() {
      this.on('focus', this.focus);
      $(window).on('resize', (function(_this) {
        return function() {
          if (_this.panel.isVisible()) {
            return _this.resizeTerminalToView();
          }
        };
      })(this));
      return this.panelDivider.on('mousedown', this.resizeStarted.bind(this));
    };

    TerminalPlusView.prototype.detachResizeEvents = function() {
      this.off('focus', this.focus);
      $(window).off('resize');
      return this.panelDivider.off('mousedown');
    };

    TerminalPlusView.prototype.attachEvents = function() {
      this.resizeTerminalToView = this.resizeTerminalToView.bind(this);
      this.resizePanel = this.resizePanel.bind(this);
      this.resizeStopped = this.resizeStopped.bind(this);
      return this.attachResizeEvents();
    };

    TerminalPlusView.prototype.resizeStarted = function() {
      if (this.maximized) {
        return;
      }
      this.maxHeight = this.prevHeight + $('atom-pane-container').height();
      $(document).on('mousemove', this.resizePanel);
      $(document).on('mouseup', this.resizeStopped);
      return this.xterm.css('transition', '');
    };

    TerminalPlusView.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizePanel);
      $(document).off('mouseup', this.resizeStopped);
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    TerminalPlusView.prototype.nearestRow = function(delta) {
      var rows;
      rows = Math.floor((this.prevHeight + delta) / this.rowHeight);
      return rows * this.rowHeight;
    };

    TerminalPlusView.prototype.resizePanel = function(event) {
      var clamped, delta, mouseY;
      if (event.which !== 1) {
        return this.resizeStopped();
      }
      mouseY = $(window).height() - event.pageY;
      delta = mouseY - $('atom-panel-container.bottom').height();
      if (!(Math.abs(delta) > (this.rowHeight * 5 / 6))) {
        return;
      }
      clamped = Math.max(this.nearestRow(delta), this.rowHeight * 3);
      if (clamped > this.maxHeight) {
        return;
      }
      this.xterm.height(clamped);
      $(this.terminal.element).height(clamped);
      this.prevHeight = clamped;
      return this.resizeTerminalToView();
    };

    TerminalPlusView.prototype.copy = function() {
      var lines, rawLines, rawText, text, textarea;
      if (this.terminal._selected) {
        textarea = this.terminal.getCopyTextarea();
        text = this.terminal.grabText(this.terminal._selected.x1, this.terminal._selected.x2, this.terminal._selected.y1, this.terminal._selected.y2);
      } else {
        rawText = this.terminal.context.getSelection().toString();
        rawLines = rawText.split(/\r?\n/g);
        lines = rawLines.map(function(line) {
          return line.replace(/\s/g, " ").trimRight();
        });
        text = lines.join("\n");
      }
      return atom.clipboard.write(text);
    };

    TerminalPlusView.prototype.paste = function() {
      return this.input(atom.clipboard.read());
    };

    TerminalPlusView.prototype.insertSelection = function() {
      var cursor, editor, line, selection;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if (selection = editor.getSelectedText()) {
        this.terminal.stopScrolling();
        return this.ptyProcess.send({
          event: 'input',
          text: "" + selection + os.EOL
        });
      } else if (cursor = editor.getCursorBufferPosition()) {
        line = editor.lineTextForBufferRow(cursor.row);
        this.terminal.stopScrolling();
        this.ptyProcess.send({
          event: 'input',
          text: "" + line + os.EOL
        });
        return editor.moveDown(1);
      }
    };

    TerminalPlusView.prototype.focus = function() {
      this.resizeTerminalToView();
      return this.focusTerminal();
    };

    TerminalPlusView.prototype.focusTerminal = function() {
      this.terminal.focus();
      return this.terminal.element.focus();
    };

    TerminalPlusView.prototype.resizeTerminalToView = function() {
      var cols, rows, _ref2;
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      if (!(cols > 0 && rows > 0)) {
        return;
      }
      if (!this.terminal) {
        return;
      }
      if (this.terminal.rows === rows && this.terminal.cols === cols) {
        return;
      }
      this.resize(cols, rows);
      return this.terminal.resize(cols, rows);
    };

    TerminalPlusView.prototype.getDimensions = function() {
      var cols, fakeCol, fakeRow, rows;
      fakeRow = $("<div><span>&nbsp;</span></div>");
      if (this.terminal) {
        this.find('.terminal').append(fakeRow);
        fakeCol = fakeRow.children().first()[0].getBoundingClientRect();
        cols = Math.floor(this.xterm.width() / (fakeCol.width || 9));
        rows = Math.floor(this.xterm.height() / (fakeCol.height || 20));
        this.rowHeight = fakeCol.height;
        fakeRow.remove();
      } else {
        cols = Math.floor(this.xterm.width() / 9);
        rows = Math.floor(this.xterm.height() / 20);
      }
      return {
        cols: cols,
        rows: rows
      };
    };

    TerminalPlusView.prototype.onTransitionEnd = function(callback) {
      return this.xterm.one('webkitTransitionEnd', (function(_this) {
        return function() {
          callback();
          return _this.animating = false;
        };
      })(this));
    };

    return TerminalPlusView;

  })(View);

}).call(this);
