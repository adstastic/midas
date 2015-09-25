(function() {
  var AtomRunner, AtomRunnerView, ConfigObserver, fs, p, spawn, url,
    __slice = [].slice;

  ConfigObserver = require('atom').ConfigObserver;

  spawn = require('child_process').spawn;

  fs = require('fs');

  url = require('url');

  p = require('path');

  AtomRunnerView = require('./atom-runner-view');

  AtomRunner = (function() {
    function AtomRunner() {}

    AtomRunner.prototype.config = {
      showOutputWindow: {
        title: 'Show Output Window',
        description: 'Displays the output window when running commands. Uncheck to hide output.',
        type: 'boolean',
        "default": true,
        order: 1
      }
    };

    AtomRunner.prototype.cfg = {
      ext: 'runner.extensions',
      scope: 'runner.scopes'
    };

    AtomRunner.prototype.defaultExtensionMap = {
      'spec.coffee': 'mocha',
      'ps1': 'c:\\windows\\sysnative\\windowspowershell\\v1.0\\powershell.exe -file',
      '_test.go': 'go test'
    };

    AtomRunner.prototype.defaultScopeMap = {
      coffee: 'coffee',
      js: 'node',
      ruby: 'ruby',
      python: 'python',
      go: 'go run',
      shell: 'bash',
      powershell: 'c:\\windows\\sysnative\\windowspowershell\\v1.0\\powershell.exe -noninteractive -noprofile -c -'
    };

    AtomRunner.prototype.extensionMap = null;

    AtomRunner.prototype.scopeMap = null;

    AtomRunner.prototype.debug = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return console.debug.apply(console, ['[atom-runner]'].concat(__slice.call(args)));
    };

    AtomRunner.prototype.initEnv = function() {
      var out, pid, shell, _ref;
      if (process.platform === 'darwin') {
        _ref = [process.env.SHELL || 'bash', ''], shell = _ref[0], out = _ref[1];
        this.debug('Importing ENV from', shell);
        pid = spawn(shell, ['--login', '-c', 'env']);
        pid.stdout.on('data', function(chunk) {
          return out += chunk;
        });
        pid.on('error', (function(_this) {
          return function() {
            return _this.debug('Failed to import ENV from', shell);
          };
        })(this));
        pid.on('close', (function(_this) {
          return function() {
            var line, match, _i, _len, _ref1, _results;
            _ref1 = out.split('\n');
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              line = _ref1[_i];
              match = line.match(/^(\S+?)=(.+)/);
              if (match) {
                _results.push(process.env[match[1]] = match[2]);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this));
        return pid.stdin.end();
      }
    };

    AtomRunner.prototype.destroy = function() {
      atom.config.unobserve(this.cfg.ext);
      return atom.config.unobserve(this.cfg.scope);
    };

    AtomRunner.prototype.activate = function() {
      this.initEnv();
      atom.config.setDefaults(this.cfg.ext, this.defaultExtensionMap);
      atom.config.setDefaults(this.cfg.scope, this.defaultScopeMap);
      atom.config.observe(this.cfg.ext, (function(_this) {
        return function() {
          return _this.extensionMap = atom.config.get(_this.cfg.ext);
        };
      })(this));
      atom.config.observe(this.cfg.scope, (function(_this) {
        return function() {
          return _this.scopeMap = atom.config.get(_this.cfg.scope);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:file', (function(_this) {
        return function() {
          return _this.run(false);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:selection', (function(_this) {
        return function() {
          return _this.run(true);
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:stop', (function(_this) {
        return function() {
          return _this.stop();
        };
      })(this));
      atom.commands.add('atom-workspace', 'run:close', (function(_this) {
        return function() {
          return _this.stopAndClose();
        };
      })(this));
      return atom.commands.add('.atom-runner', 'run:copy', (function(_this) {
        return function() {
          return atom.clipboard.write(window.getSelection().toString());
        };
      })(this));
    };

    AtomRunner.prototype.run = function(selection) {
      var cmd, editor, pane, panes, path, view, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      path = editor.getPath();
      cmd = this.commandFor(editor, selection);
      if (cmd == null) {
        console.warn("No registered executable for file '" + path + "'");
        return;
      }
      if (atom.config.get('atom-runner.showOutputWindow')) {
        _ref = this.runnerView(), pane = _ref.pane, view = _ref.view;
        if (view == null) {
          view = new AtomRunnerView(editor.getTitle());
          panes = atom.workspace.getPanes();
          pane = panes[panes.length - 1].splitRight(view);
        }
      } else {
        view = {
          mocked: true,
          append: function(text, type) {
            if (type === 'stderr') {
              return console.error(text);
            } else {
              return console.log(text);
            }
          },
          scrollToBottom: function() {},
          clear: function() {},
          footer: function() {}
        };
      }
      if (!view.mocked) {
        view.setTitle(editor.getTitle());
        pane.activateItem(view);
      }
      return this.execute(cmd, editor, view, selection);
    };

    AtomRunner.prototype.stop = function(view) {
      if (this.child) {
        if (view == null) {
          view = this.runnerView().view;
        }
        if (view && (view.isOnDom() != null)) {
          view.append('^C', 'stdin');
        } else {
          this.debug('Killed child', child.pid);
        }
        this.child.kill('SIGINT');
        if (this.child.killed) {
          return this.child = null;
        }
      }
    };

    AtomRunner.prototype.stopAndClose = function() {
      var pane, view, _ref;
      _ref = this.runnerView(), pane = _ref.pane, view = _ref.view;
      if (pane != null) {
        pane.removeItem(view);
      }
      return this.stop(view);
    };

    AtomRunner.prototype.execute = function(cmd, editor, view, selection) {
      var args, dir, err, splitCmd, startTime;
      view.clear();
      this.stop();
      args = [];
      if (editor.getPath()) {
        editor.save();
        if (!selection) {
          args.push(editor.getPath());
        }
      }
      splitCmd = cmd.split(/\s+/);
      if (splitCmd.length > 1) {
        cmd = splitCmd[0];
        args = splitCmd.slice(1).concat(args);
      }
      try {
        dir = atom.project.path || '.';
        if (!fs.statSync(dir).isDirectory()) {
          dir = p.dirname(dir);
        }
        this.child = spawn(cmd, args, {
          cwd: dir
        });
        this.child.on('error', (function(_this) {
          return function(err) {
            if (err.message.match(/\bENOENT$/)) {
              view.append('Unable to find command: ' + cmd + '\n', 'stderr');
              view.append('Are you sure PATH is configured correctly?\n\n', 'stderr');
              view.append('ENV PATH: ' + process.env.PATH + '\n\n', 'stderr');
            }
            view.append(err.stack, 'stderr');
            view.scrollToBottom();
            return _this.child = null;
          };
        })(this));
        this.child.stderr.on('data', (function(_this) {
          return function(data) {
            view.append(data, 'stderr');
            return view.scrollToBottom();
          };
        })(this));
        this.child.stdout.on('data', (function(_this) {
          return function(data) {
            view.append(data, 'stdout');
            return view.scrollToBottom();
          };
        })(this));
        this.child.on('close', (function(_this) {
          return function(code, signal) {
            view.footer('Exited with code=' + code + ' in ' + ((new Date - startTime) / 1000) + ' seconds');
            return _this.child = null;
          };
        })(this));
      } catch (_error) {
        err = _error;
        view.append(err.stack, 'stderr');
        view.scrollToBottom();
        this.stop();
      }
      startTime = new Date;
      if (selection) {
        this.child.stdin.write(editor.getSelection().getText());
      } else if (!editor.getPath()) {
        this.child.stdin.write(editor.getText());
      }
      this.child.stdin.end();
      return view.footer('Running: ' + cmd + ' ' + editor.getPath());
    };

    AtomRunner.prototype.commandFor = function(editor, selection) {
      var boundary, ext, name, scope, shebang, _i, _j, _len, _len1, _ref, _ref1;
      shebang = this.commandForShebang(editor);
      if (shebang != null) {
        return shebang;
      }
      if (!selection) {
        if (editor.getPath() != null) {
          _ref = Object.keys(this.extensionMap).sort(function(a, b) {
            return b.length - a.length;
          });
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ext = _ref[_i];
            boundary = ext.match(/^\b/) ? '' : '\\b';
            if (editor.getPath().match(boundary + ext + '$')) {
              return this.extensionMap[ext];
            }
          }
        }
      }
      scope = editor.getLastCursor().getScopeDescriptor().scopes[0];
      _ref1 = Object.keys(this.scopeMap);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        name = _ref1[_j];
        if (scope.match('^source\\.' + name + '\\b')) {
          return this.scopeMap[name];
        }
      }
    };

    AtomRunner.prototype.commandForShebang = function(editor) {
      var match;
      match = editor.lineTextForBufferRow(0).match(/^#!\s*(.+)/);
      return match && match[1];
    };

    AtomRunner.prototype.runnerView = function() {
      var pane, view, _i, _j, _len, _len1, _ref, _ref1;
      _ref = atom.workspace.getPanes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        _ref1 = pane.getItems();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          view = _ref1[_j];
          if (view instanceof AtomRunnerView) {
            return {
              pane: pane,
              view: view
            };
          }
        }
      }
      return {
        pane: null,
        view: null
      };
    };

    return AtomRunner;

  })();

  module.exports = new AtomRunner;

}).call(this);
