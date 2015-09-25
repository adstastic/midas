(function() {
  var RunInAtom;

  RunInAtom = require('../lib/run-in-atom');

  describe("Run in Atom", function() {
    var editor, editorElement, markdownCursorPositionCoffeeScript, markdownCursorPositionJavaScript, markdownCursorPositionNoCode, workspaceElement;
    workspaceElement = null;
    editorElement = null;
    editor = null;
    markdownCursorPositionNoCode = [4, 0];
    markdownCursorPositionCoffeeScript = [1, 0];
    markdownCursorPositionJavaScript = [6, 0];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.config.set('run-in-atom.openDeveloperToolsOnRun', false);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
    });
    describe("Editor scope functions", function() {
      describe("for a CoffeeScript file", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open("empty.coffee");
          });
          return runs(function() {
            return editor = atom.workspace.getActiveTextEditor();
          });
        });
        it("scopeInEditor returns 'source.coffee'", function() {
          return expect(RunInAtom.scopeInEditor(editor)).toBe('source.coffee');
        });
        return it("matchingCursorScopeInEditor returns 'source.coffee'", function() {
          return expect(RunInAtom.matchingCursorScopeInEditor(editor)).toBe('source.coffee');
        });
      });
      describe("for a JavaScript file", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open("empty.js");
          });
          return runs(function() {
            return editor = atom.workspace.getActiveTextEditor();
          });
        });
        it("scopeInEditor returns 'source.js'", function() {
          return expect(RunInAtom.scopeInEditor(editor)).toBe('source.js');
        });
        return it("matchingCursorScopeInEditor returns 'source.js'", function() {
          return expect(RunInAtom.matchingCursorScopeInEditor(editor)).toBe('source.js');
        });
      });
      return describe("for a Markdown file", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-gfm');
          });
          waitsForPromise(function() {
            return atom.workspace.open("code.md");
          });
          return runs(function() {
            return editor = atom.workspace.getActiveTextEditor();
          });
        });
        describe("when the cursor is not in a code block", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition(markdownCursorPositionNoCode);
          });
          it("scopeInEditor returns 'source.gfm'", function() {
            return expect(RunInAtom.scopeInEditor(editor)).toBe('source.gfm');
          });
          return it("matchingCursorScopeInEditor returns 'source.gfm'", function() {
            return expect(RunInAtom.matchingCursorScopeInEditor(editor)).toBe(void 0);
          });
        });
        describe("when the cursor is in a CoffeeScript code block", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition(markdownCursorPositionCoffeeScript);
          });
          it("scopeInEditor returns 'source.gfm'", function() {
            return expect(RunInAtom.scopeInEditor(editor)).toBe('source.gfm');
          });
          return it("matchingCursorScopeInEditor returns 'source.coffee'", function() {
            return expect(RunInAtom.matchingCursorScopeInEditor(editor)).toBe('source.coffee');
          });
        });
        return describe("when the cursor is in a JavaScript code block", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition(markdownCursorPositionJavaScript);
          });
          it("scopeInEditor returns 'source.gfm'", function() {
            return expect(RunInAtom.scopeInEditor(editor)).toBe('source.gfm');
          });
          return it("matchingCursorScopeInEditor returns 'source.js'", function() {
            return expect(RunInAtom.matchingCursorScopeInEditor(editor)).toBe('source.js');
          });
        });
      });
    });
    return describe("running code", function() {
      var activationPromise, coffeeScriptCode, javaScriptCode, prefix, result;
      activationPromise = null;
      coffeeScriptCode = "atom.getVersion() is undefined";
      javaScriptCode = "atom.getVersion() === undefined";
      prefix = "Run in Atom:";
      result = false;
      beforeEach(function() {
        activationPromise = atom.packages.activatePackage('run-in-atom');
        spyOn(console, "error");
        spyOn(console, "log");
        return spyOn(console, "warn");
      });
      describe("With no active editor", function() {
        return it("logs a warning", function() {
          waitsForPromise(function() {
            return atom.workspace.open("empty.coffee");
          });
          runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            editorElement = atom.views.getView(editor);
            return atom.workspace.getActivePaneItem().destroy();
          });
          runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            expect(editor).not.toExist();
            return atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          });
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            return expect(console.warn).toHaveBeenCalled();
          });
        });
      });
      describe("CoffeeScript file", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open("empty.coffee");
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editorElement = atom.views.getView(editor);
          });
        });
        describe("deactivate()", function() {
          return it("removes the command", function() {
            editor.setText(coffeeScriptCode);
            atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              expect(console.log).toHaveBeenCalledWith(prefix, result);
              expect(console.error).not.toHaveBeenCalled();
              expect(console.warn).not.toHaveBeenCalled();
              atom.packages.deactivatePackage('run-in-atom');
              atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
              expect(console.log.callCount).toBe(1);
              expect(console.error).not.toHaveBeenCalled();
              return expect(console.warn).not.toHaveBeenCalled();
            });
          });
        });
        describe("openDeveloperToolsOnRun config option", function() {
          beforeEach(function() {
            return spyOn(atom, "openDevTools");
          });
          it("opens the developer tools if true", function() {
            atom.config.set('run-in-atom.openDeveloperToolsOnRun', true);
            editor.setText(coffeeScriptCode);
            atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              return expect(atom.openDevTools).toHaveBeenCalled();
            });
          });
          return it("doesn't open the developer tools if false", function() {
            atom.config.set('run-in-atom.openDeveloperToolsOnRun', false);
            editor.setText(coffeeScriptCode);
            atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              return expect(atom.openDevTools).not.toHaveBeenCalled();
            });
          });
        });
        it("logs an error if CoffeeScript is invalid", function() {
          editor.setText(javaScriptCode);
          atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
            return expect(console.warn).not.toHaveBeenCalled();
          });
        });
        return it("runs CoffeeScript and logs the result", function() {
          editor.setText(coffeeScriptCode);
          atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            expect(console.log).toHaveBeenCalledWith(prefix, result);
            expect(console.error).not.toHaveBeenCalled();
            return expect(console.warn).not.toHaveBeenCalled();
          });
        });
      });
      describe("JavaScript file", function() {
        return beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open("empty.coffee");
          });
          runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editorElement = atom.views.getView(editor);
          });
          it("logs an error if JavaScript is invalid", function() {
            editor.setText(coffeeScriptCode);
            atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              expect(console.log).not.toHaveBeenCalled();
              expect(console.error).toHaveBeenCalled();
              return expect(console.warn).not.toHaveBeenCalled();
            });
          });
          return it("runs JavaScript and logs the result", function() {
            editor.setText(javaScriptCode);
            atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              expect(console.log).toHaveBeenCalledWith(prefix, result);
              expect(console.error).not.toHaveBeenCalled();
              return expect(console.warn).not.toHaveBeenCalled();
            });
          });
        });
      });
      return describe("Markdown file", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-gfm');
          });
          waitsForPromise(function() {
            return atom.workspace.open("code.md");
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editorElement = atom.views.getView(editor);
          });
        });
        it("Logs a warning if nothing is selected", function() {
          editor.setCursorScreenPosition(markdownCursorPositionNoCode);
          atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
            return expect(console.warn).toHaveBeenCalled();
          });
        });
        it("Logs a warning if Markdown is selected", function() {
          editor.setCursorScreenPosition(markdownCursorPositionNoCode);
          editor.selectLinesContainingCursors();
          atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
            return expect(console.warn).toHaveBeenCalled();
          });
        });
        it("Runs if CoffeeScript is selected", function() {
          editor.setCursorScreenPosition(markdownCursorPositionCoffeeScript);
          editor.selectLinesContainingCursors();
          atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            expect(console.log).toHaveBeenCalledWith(prefix, result);
            expect(console.error).not.toHaveBeenCalled();
            return expect(console.warn).not.toHaveBeenCalled();
          });
        });
        return it("Runs if JavaScript is selected", function() {
          editor.setCursorScreenPosition(markdownCursorPositionJavaScript);
          editor.selectLinesContainingCursors();
          atom.commands.dispatch(editorElement, 'run-in-atom:run-in-atom');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            expect(console.log).toHaveBeenCalledWith(prefix, result);
            expect(console.error).not.toHaveBeenCalled();
            return expect(console.warn).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);
