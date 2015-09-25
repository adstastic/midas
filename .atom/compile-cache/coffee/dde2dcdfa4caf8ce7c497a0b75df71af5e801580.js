
/*
Nicholas Clawson -2014

Entry point for the package, creates the toolbar and starts
listening for any commands or changes
 */

(function() {
  window.View = require('./grunt-runner-view.coffee');

  module.exports = {
    config: {
      gruntPaths: {
        type: 'array',
        "default": []
      }
    },
    activate: function(state) {
      if (state == null) {
        state = {};
      }
      this.view = new View(state);
      atom.config.observe('grunt-runner.gruntPaths', this.view.parseGruntFile.bind(this.view));
      atom.commands.add('atom-workspace', 'grunt-runner:stop', this.view.stopProcess.bind(this.view));
      atom.commands.add('atom-workspace', 'grunt-runner:toggle-log', this.view.toggleLog.bind(this.view));
      atom.commands.add('atom-workspace', 'grunt-runner:toggle-panel', this.view.togglePanel.bind(this.view));
      atom.commands.add('atom-workspace', 'grunt-runner:run', this.view.toggleTaskList.bind(this.view));
      return atom.commands.add('atom-workspace', 'grunt-runner:run-latest', this.view.runLatestTask.bind(this.view));
    },
    serialize: function() {
      return this.view.serialize();
    },
    deactivate: function() {
      return this.view.stopProcess();
    }
  };

}).call(this);
