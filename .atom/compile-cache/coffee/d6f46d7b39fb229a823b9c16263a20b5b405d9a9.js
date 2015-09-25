(function() {
  var BrowserPlus;

  BrowserPlus = require('../lib/browser-plus');

  describe("BrowserPlus", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('browser-plus');
    });
    return describe("when the browser-plus:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.browser-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var browserPlusElement, browserPlusPanel;
          expect(workspaceElement.querySelector('.browser-plus')).toExist();
          browserPlusElement = workspaceElement.querySelector('.browser-plus');
          expect(browserPlusElement).toExist();
          browserPlusPanel = atom.workspace.panelForItem(browserPlusElement);
          expect(browserPlusPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
          return expect(browserPlusPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.browser-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var browserPlusElement;
          browserPlusElement = workspaceElement.querySelector('.browser-plus');
          expect(browserPlusElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'browser-plus:toggle');
          return expect(browserPlusElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);