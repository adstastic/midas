(function() {
  describe('validate', function() {
    var validate;
    validate = require('../lib/validate');
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          return validate.linter({
            lint: function() {}
          });
        }).toThrow("grammarScopes is not an Array. Got: undefined");
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: []
          });
        }).toThrow();
      });
      return it('throws if lint is not a function', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: [],
            lint: true
          });
        }).toThrow();
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow("Expected messages to be array, provided: undefined");
        return expect(function() {
          return validate.messages(true);
        }).toThrow("Expected messages to be array, provided: boolean");
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}]);
        }).toThrow();
      });
      it("throws if type field is invalid", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ]);
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ]);
        }).toThrow();
      });
      return it("throws if html/text is invalid", function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ]);
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ]);
        }).toThrow();
      });
    });
  });

}).call(this);
