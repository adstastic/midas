(function() {
  var $, CompositeDisposable, StatusIcon,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom-space-pen-views').$;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = StatusIcon = (function(_super) {
    __extends(StatusIcon, _super);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var _ref;
      this.terminalView = terminalView;
      this.classList.add('status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.dataset.type = (_ref = this.terminalView.constructor) != null ? _ref.name : void 0;
      return this.addEventListener('click', (function(_this) {
        return function(_arg) {
          var ctrlKey, which;
          which = _arg.which, ctrlKey = _arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
    };

    StatusIcon.prototype.updateTooltip = function(title) {
      if (title != null) {
        this.title = title;
      }
      return this.tooltip = atom.tooltips.add(this, {
        title: this.title,
        html: false,
        delay: {
          show: 500,
          hide: 250
        }
      });
    };

    StatusIcon.prototype.removeTooltip = function() {
      var _ref;
      return (_ref = this.tooltip) != null ? _ref.dispose() : void 0;
    };

    StatusIcon.prototype.close = function() {
      this.terminal.destroy();
      return this.destroy();
    };

    StatusIcon.prototype.destroy = function() {
      this.subscriptions.dispose();
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);
