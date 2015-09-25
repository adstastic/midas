(function() {
  var filteredEnv, fs, path, pty, _;

  pty = require('pty.js');

  path = require('path');

  fs = require('fs');

  _ = require('underscore');

  filteredEnv = _.omit(process.env, 'ATOM_HOME', 'ATOM_SHELL_INTERNAL_RUN_AS_NODE', 'GOOGLE_API_KEY', 'NODE_ENV', 'NODE_PATH', 'userAgent', 'taskPath');

  module.exports = function(ptyCwd, shell, args, options) {
    var callback, ptyProcess, title;
    if (options == null) {
      options = {};
    }
    callback = this.async();
    if (/zsh|bash/.test(shell) && args.indexOf('--login') === -1) {
      args.unshift('--login');
    }
    ptyProcess = pty.fork(shell, args, {
      cwd: ptyCwd,
      env: filteredEnv
    });
    title = shell = path.basename(shell);
    ptyProcess.on('data', function(data) {
      return emit('terminal-plus:data', data);
    });
    ptyProcess.on('data', function() {
      var newTitle;
      newTitle = ptyProcess.process;
      if (newTitle === shell) {
        emit('terminal-plus:clear-title');
      } else if (title !== newTitle) {
        emit('terminal-plus:title', newTitle);
      }
      return title = newTitle;
    });
    ptyProcess.on('exit', function() {
      emit('terminal-plus:exit');
      return callback();
    });
    return process.on('message', function(_arg) {
      var cols, event, rows, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, cols = _ref.cols, rows = _ref.rows, text = _ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(text);
      }
    });
  };

}).call(this);
