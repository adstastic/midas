(function() {
  describe('Commands', function() {
    var linter;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    return describe('linter:togglePanel', function() {
      return it('toggles the panel visibility', function() {
        var visibility;
        visibility = linter.views.panel.getVisibility();
        linter.commands.togglePanel();
        expect(linter.views.panel.getVisibility()).toBe(!visibility);
        linter.commands.togglePanel();
        return expect(linter.views.panel.getVisibility()).toBe(visibility);
      });
    });
  });

}).call(this);
