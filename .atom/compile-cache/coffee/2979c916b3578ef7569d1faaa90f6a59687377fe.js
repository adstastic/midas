
/*
Nicholas Clawson -2014

Popup list view to select tasks to run.
Extends Atoms SelectListView but adds the functionality
of being able to add custom tasks to the list
 */

(function() {
  var $, $$, SelectListView, TaskListView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView, View = _ref.View;

  module.exports = TaskListView = (function(_super) {
    __extends(TaskListView, _super);

    function TaskListView() {
      return TaskListView.__super__.constructor.apply(this, arguments);
    }

    TaskListView.prototype.runner = function() {};

    TaskListView.prototype.activate = function() {
      return new TaskListView;
    };

    TaskListView.prototype.initialize = function(serializeState) {
      TaskListView.__super__.initialize.apply(this, arguments);
      return this.addClass('grunt-runner');
    };

    TaskListView.prototype.cancelled = function() {
      return this.hide();
    };

    TaskListView.prototype.confirmed = function(item) {
      this.latestItem = item;
      this.runner.startProcess(item);
      return this.cancel();
    };

    TaskListView.prototype.toggle = function(runner) {
      var _ref1;
      this.runner = runner;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.hide();
      } else {
        return this.show();
      }
    };

    TaskListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    TaskListView.prototype.show = function() {
      var items;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      items = this.runner.tasks;
      this.setItems(Array.isArray(items) ? items : []);
      return this.focusFilterEditor();
    };

    TaskListView.prototype.serialize = function() {};

    TaskListView.prototype.viewForItem = function(task) {
      return $$(function() {
        return this.li({
          "class": 'two-lines',
          'data-projects-title': task
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'primary-line'
            }, function() {
              return _this.div(function() {
                return _this.span(task);
              });
            });
          };
        })(this));
      });
    };

    TaskListView.prototype.runLatest = function(runner) {
      if (this.latestItem) {
        return runner.startProcess(this.latestItem);
      } else {
        return this.toggle(runner);
      }
    };

    TaskListView.prototype.getEmptyMessage = function() {
      return "Press Enter to run the task.";
    };

    return TaskListView;

  })(SelectListView);

}).call(this);
