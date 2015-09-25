(function() {
  var AtomRunner;

  AtomRunner = require('../lib/runner');

  describe("AtomRunner", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('atomRunner');
    });
    return describe("when the atom-runner:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.atom-runner')).not.toExist();
        atom.workspaceView.trigger('atom-runner:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.atom-runner')).toExist();
          atom.workspaceView.trigger('atom-runner:toggle');
          return expect(atom.workspaceView.find('.atom-runner')).not.toExist();
        });
      });
    });
  });

}).call(this);
