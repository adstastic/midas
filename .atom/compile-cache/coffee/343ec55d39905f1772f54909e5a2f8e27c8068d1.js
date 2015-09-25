(function() {
  module.exports = {
    message: 'Hello! Thanks for trying out Atom.\n\nThis is an unregistered evaluation version, and although the trial is untimed, a license must be purchased for continued use.\n\nWould you like to purchase a license now?',
    activate: function(state) {
      this.count = state.count || 0;
      return atom.views.getView(atom.workspace).on('keydown', this.counter.bind(this));
    },
    serialize: function() {
      return {
        count: this.count
      };
    },
    showDialog: function() {
      this.count = 0;
      if (confirm(this.message)) {
        return open('https://github.com/thiagopnts/unregistered');
      }
    },
    counter: function() {
      if (++this.count > 1000) {
        return this.showDialog();
      }
    }
  };

}).call(this);
