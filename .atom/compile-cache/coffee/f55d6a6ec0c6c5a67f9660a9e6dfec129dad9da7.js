(function() {
  var TerminalPlus;

  TerminalPlus = require('../lib/terminal-plus');

  describe("TerminalPlus", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('terminal-plus');
    });
    return describe("when the terminal-plus:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.terminal-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var statusBar, terminalPlusElement;
          expect(workspaceElement.querySelector('.terminal-plus')).toExist();
          terminalPlusElement = workspaceElement.querySelector('.terminal-plus');
          expect(terminalPlusElement).toExist();
          statusBar = atom.workspace.panelForItem(terminalPlusElement);
          expect(statusBar.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
          return expect(statusBar.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.terminal-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var terminalPlusElement;
          terminalPlusElement = workspaceElement.querySelector('.terminal-plus');
          expect(terminalPlusElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
          return expect(terminalPlusElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);
