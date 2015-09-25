(function() {
  var GruntRunner;

  GruntRunner = require('../lib/grunt-runner');

  describe("GruntRunner", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('gruntRunner');
    });
    return describe("when the grunt-runner:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.grunt-runner')).not.toExist();
        atom.workspaceView.trigger('grunt-runner:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.grunt-runner')).toExist();
          atom.workspaceView.trigger('grunt-runner:toggle');
          return expect(atom.workspaceView.find('.grunt-runner')).not.toExist();
        });
      });
    });
  });

}).call(this);
