
/*
Nicholas Clawson -2014

The bottom toolbar. In charge handling user input and implementing
various commands. Creates a SelectListView and launches a task to
discover the projects grunt commands. Logs errors and output.
Also launches an Atom BufferedProcess to run grunt when needed.
 */

(function() {
  var $, BufferedProcess, ListView, ResultsView, Task, View, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, Task = _ref.Task;

  _ref1 = require('atom-space-pen-views'), View = _ref1.View, $ = _ref1.$;

  ListView = require('./task-list-view');

  path = require('path');

  module.exports = ResultsView = (function(_super) {
    __extends(ResultsView, _super);

    function ResultsView() {
      this.resizeGruntRunnerView = __bind(this.resizeGruntRunnerView, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      return ResultsView.__super__.constructor.apply(this, arguments);
    }

    ResultsView.prototype.path = null;

    ResultsView.prototype.process = null;

    ResultsView.prototype.taskList = null;

    ResultsView.prototype.tasks = [];

    ResultsView.prototype.originalPaths = process.env.NODE_PATH.split(':');

    ResultsView.content = function() {
      return this.div({
        "class": 'grunt-runner-resizer tool-panel panel-bottom'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'grunt-runner-resizer-handle'
          });
          return _this.div({
            outlet: 'container',
            "class": 'grunt-runner-results tool-panel native-key-bindings'
          }, function() {
            _this.div({
              outlet: 'status',
              "class": 'grunt-panel-heading'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'startstopbtn',
                  click: 'startStopAction',
                  "class": 'btn'
                }, 'Start Grunt');
                _this.button({
                  outlet: 'logbtn',
                  click: 'toggleLog',
                  "class": 'btn'
                }, 'Toggle Log');
                return _this.button({
                  outlet: 'panelbtn',
                  click: 'togglePanel',
                  "class": 'btn'
                }, 'Hide');
              });
            });
            return _this.div({
              outlet: 'panel',
              "class": 'panel-body padded',
              tabindex: -1
            }, function() {
              return _this.ul({
                outlet: 'errors',
                "class": 'list-group'
              });
            });
          });
        };
      })(this));
    };

    ResultsView.prototype.initialize = function(state) {
      var view;
      if (state == null) {
        state = {};
      }
      view = this;
      atom.project.onDidChangePaths(function() {
        return view.parseGruntFile();
      });
      this.taskList = new ListView(state.taskList);
      this.on('mousedown', '.grunt-runner-resizer-handle', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
      atom.tooltips.add(this.startstopbtn, {
        title: "Start",
        keyBindingCommand: 'grunt-runner:run'
      });
      atom.tooltips.add(this.logbtn, {
        title: "",
        keyBindingCommand: 'grunt-runner:toggle-log'
      });
      return atom.tooltips.add(this.panelbtn, {
        title: "",
        keyBindingCommand: 'grunt-runner:toggle-panel'
      });
    };

    ResultsView.prototype.parseGruntFile = function(starting) {
      var gruntPaths, paths, view;
      this.paths = atom.project.getPaths();
      this.path = this.paths[0];
      gruntPaths = atom.config.get('grunt-runner.gruntPaths');
      gruntPaths = Array.isArray(gruntPaths) ? gruntPaths : [];
      paths = this.originalPaths.concat(gruntPaths, [this.path + '/node_modules']);
      process.env.NODE_PATH = paths.join(path.delimiter);
      view = this;
      this.emptyPanel();
      this.status.attr('data-status', null);
      if (!this.path) {
        return this.addLine("No project opened.");
      } else {
        return Task.once(require.resolve('./parse-config-task'), this.path + '/Gruntfile', function(_arg) {
          var error, tasks;
          error = _arg.error, tasks = _arg.tasks;
          if (error) {
            return Task.once(require.resolve('./parse-config-task'), this.path + '/gruntfile', function(_arg1) {
              var error, tasks;
              error = _arg1.error, tasks = _arg1.tasks;
              if (error) {
                view.addLine("Error loading gruntfile: " + error, "error");
                return view.toggleLog();
              } else {
                view.addLine("Grunt file parsed, found " + tasks.length + " tasks");
                view.tasks = tasks;
                return view.togglePanel();
              }
            });
          } else {
            view.addLine("Grunt file parsed, found " + tasks.length + " tasks");
            view.tasks = tasks;
            return view.togglePanel();
          }
        });
      }
    };

    ResultsView.prototype.startStopAction = function() {
      if (this.process === null) {
        return this.toggleTaskList();
      }
      return this.stopProcess();
    };

    ResultsView.prototype.setStartStopBtn = function(isRunning) {
      if (isRunning) {
        this.startstopbtn.text('Stop');
        return atom.tooltips.add(this.startstopbtn, {
          title: "",
          keyBindingCommand: 'grunt-runner:stop'
        });
      } else {
        this.startstopbtn.text('Start');
        return atom.tooltips.add(this.startstopbtn, {
          title: "",
          keyBindingCommand: 'grunt-runner:run'
        });
      }
    };

    ResultsView.prototype.startProcess = function(task) {
      this.stopProcess();
      this.emptyPanel();
      this.status.attr('data-status', 'loading');
      this.addLine("Running : grunt " + task, 'subtle');
      this.setStartStopBtn(true);
      return this.gruntTask(task, this.path);
    };

    ResultsView.prototype.stopProcess = function(noMessage) {
      var _ref2, _ref3;
      if (this.process && !((_ref2 = this.process) != null ? _ref2.killed : void 0) && !noMessage) {
        this.addLine('Grunt task was ended', 'warning');
      }
      if ((_ref3 = this.process) != null) {
        _ref3.kill();
      }
      this.process = null;
      this.status.attr('data-status', null);
      return this.setStartStopBtn(false);
    };

    ResultsView.prototype.togglePanel = function() {
      if (!this.isOnDom()) {
        return atom.workspace.addBottomPanel({
          item: this
        });
      }
      if (this.isOnDom()) {
        return this.detach();
      }
    };

    ResultsView.prototype.toggleLog = function() {
      this.container.toggleClass('closed');
      if (this.container.hasClass('closed')) {
        return this.container.parent().height('auto');
      } else {
        return this.container.parent().height('130px');
      }
    };

    ResultsView.prototype.toggleTaskList = function() {
      return this.taskList.toggle(this);
    };

    ResultsView.prototype.runLatestTask = function() {
      return this.taskList.runLatest(this);
    };

    ResultsView.prototype.addLine = function(text, type) {
      var errorList, panel, stuckToBottom, _ref2;
      if (type == null) {
        type = "plain";
      }
      _ref2 = [this.panel, this.errors], panel = _ref2[0], errorList = _ref2[1];
      text = text.replace(/\ /g, '&nbsp;');
      text = this.colorize(text);
      text = text.trim().replace(/[\r\n]+/g, '<br />');
      if (!text.empty) {
        stuckToBottom = errorList.height() - panel.height() - panel.scrollTop() === 0;
        errorList.append("<li class='text-" + type + "'>" + text + "</li>");
        if (stuckToBottom) {
          return panel.scrollTop(errorList.height());
        }
      }
    };

    ResultsView.prototype.emptyPanel = function() {
      return this.errors.empty();
    };

    ResultsView.prototype.serialize = function() {
      return {
        taskList: this.taskList.serialize()
      };
    };

    ResultsView.prototype.colorize = function(text) {
      text = text.replace(/\[1m(.+?)(\[.+?)/g, '<span class="strong">$1</span>$2');
      text = text.replace(/\[4m(.+?)(\[.+?)/g, '<span class="underline">$1</span>$2');
      text = text.replace(/\[31m(.+?)(\[.+?)/g, '<span class="red">$1</span>$2');
      text = text.replace(/\[32m(.+?)(\[.+?)/g, '<span class="green">$1</span>$2');
      text = text.replace(/\[33m(.+?)(\[.+?)/g, '<span class="yellow">$1</span>$2');
      text = text.replace(/\[36m(.+?)(\[.+?)/g, '<span class="cyan">$1</span>$2');
      text = text.replace(/\[90m(.+?)(\[.+?)/g, '<span class="gray">$1</span>$2');
      text = this.stripColorCodes(text);
      return text;
    };

    ResultsView.prototype.stripColorCodes = function(text) {
      return text.replace(/\[[0-9]{1,2}m/g, '');
    };

    ResultsView.prototype.stripColors = function(text) {
      return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
    };

    ResultsView.prototype.gruntTask = function(task, path) {
      var e, exit, stderr, stdout;
      stdout = function(out) {
        return this.addLine(out);
      };
      stderr = function(err) {
        return this.addLine(err, 'error');
      };
      exit = function(code) {
        if (code !== 0) {
          atom.beep();
        }
        this.addLine("Grunt exited: code " + code + ".", code === 0 ? 'success' : 'error');
        this.status.attr('data-status', code === 0 ? 'ready' : 'error');
        return this.stopProcess(true);
      };
      try {
        return this.process = new BufferedProcess({
          command: 'grunt',
          args: [task],
          options: {
            cwd: path
          },
          stdout: stdout.bind(this),
          exit: exit.bind(this)
        });
      } catch (_error) {
        e = _error;
        this.addLine("Could not find grunt command. Make sure to set the path in the configuration settings.", "error");
        return this.stopProcess();
      }
    };

    ResultsView.prototype.resizeStarted = function() {
      $(document.body).on('mousemove', this.resizeGruntRunnerView);
      return $(document.body).on('mouseup', this.resizeStopped);
    };

    ResultsView.prototype.resizeStopped = function() {
      $(document.body).off('mousemove', this.resizeGruntRunnerView);
      return $(document.body).off('mouseup', this.resizeStopped);
    };

    ResultsView.prototype.resizeGruntRunnerView = function(event) {
      var height;
      height = $(document.body).height() - event.pageY - $('.status-bar').height();
      return this.height(height);
    };

    return ResultsView;

  })(View);

}).call(this);
