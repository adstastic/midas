Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.scope = scope;
    this.messages = new Map();

    this.subscriptions.add(atom.config.observe('linter.showErrorPanel', function (value) {
      _this.configVisibility = value;
      _this.setVisibility(true);
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.setVisibility(true);
    }));
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var message = _step.value;

          message[1].updateVisibility(scope);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;

      if (removed.length) this.removeMessages(removed);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = added[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var message = _step2.value;

          var messageElement = _messageElement.Message.fromMessage(message);
          this.element.appendChild(messageElement);
          messageElement.updateVisibility(this.scope);
          this.messages.set(message, messageElement);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = removed[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var message = _step3.value;

          if (this.messages.has(message)) {
            this.element.removeChild(this.messages.get(message));
            this.messages['delete'](message);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(value) {
      this.visibility = value && this.configVisibility && this.paneVisibility;
      if (this.visibility) {
        this.panel.show();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jYXRoL2hvbWVzMi96Y2FwYW11Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVrQyxNQUFNOzs4QkFDbEIsbUJBQW1COztBQUh6QyxXQUFXLENBQUE7O0lBS0UsV0FBVztBQUNYLFdBREEsV0FBVyxDQUNWLEtBQUssRUFBRTs7OzBCQURSLFdBQVc7O0FBRXBCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFMakIsbUJBQW1CLEVBS3FCLENBQUE7QUFDNUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3JELFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO0FBQy9GLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFekIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDM0UsWUFBSyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7QUFDN0IsWUFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekIsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ3RFLFlBQUssY0FBYyxHQUFHLFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDdkUsWUFBSyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekIsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFqQlUsV0FBVzs7V0FrQmYsaUJBQUMsS0FBSyxFQUFFO0FBQ2IsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7Ozs7OztBQUNsQiw2QkFBb0IsSUFBSSxDQUFDLFFBQVEsOEhBQUU7Y0FBMUIsT0FBTzs7QUFDZCxpQkFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ25DOzs7Ozs7Ozs7Ozs7Ozs7S0FDRjs7O1dBQ1UscUJBQUMsSUFBZ0IsRUFBRTtVQUFqQixLQUFLLEdBQU4sSUFBZ0IsQ0FBZixLQUFLO1VBQUUsT0FBTyxHQUFmLElBQWdCLENBQVIsT0FBTzs7QUFDekIsVUFBSSxPQUFPLENBQUMsTUFBTSxFQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBOzs7Ozs7QUFDOUIsOEJBQW9CLEtBQUssbUlBQUU7Y0FBbEIsT0FBTzs7QUFDZCxjQUFNLGNBQWMsR0FBRyxnQkE5QnJCLE9BQU8sQ0E4QnNCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNuRCxjQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN4Qyx3QkFBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMzQyxjQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUE7U0FDM0M7Ozs7Ozs7Ozs7Ozs7OztLQUNGOzs7V0FDYSx3QkFBQyxPQUFPLEVBQUU7Ozs7OztBQUN0Qiw4QkFBb0IsT0FBTyxtSUFBRTtjQUFwQixPQUFPOztBQUNkLGNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDOUIsZ0JBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDcEQsZ0JBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtXQUM5QjtTQUNGOzs7Ozs7Ozs7Ozs7Ozs7S0FDRjs7O1dBQ1kseUJBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztXQUNZLHVCQUFDLEtBQUssRUFBQztBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQTtBQUN2RSxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3JCOzs7U0F6RFUsV0FBVzs7O1FBQVgsV0FBVyxHQUFYLFdBQVciLCJmaWxlIjoiL2NhdGgvaG9tZXMyL3pjYXBhbXUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZS1lbGVtZW50J1xuXG5leHBvcnQgY2xhc3MgQm90dG9tUGFuZWwge1xuICBjb25zdHJ1Y3RvcihzY29wZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLXBhbmVsJykgLy8gVE9ETyhzdGVlbGJyYWluKTogTWFrZSB0aGlzIGEgYGRpdmBcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudCwgdmlzaWJsZTogZmFsc2UsIHByaW9yaXR5OiA1MDB9KVxuICAgIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCB2YWx1ZSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSB2YWx1ZVxuICAgICAgdGhpcy5zZXRWaXNpYmlsaXR5KHRydWUpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgdGhpcy5wYW5lVmlzaWJpbGl0eSA9IHBhbmVJdGVtID09PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMuc2V0VmlzaWJpbGl0eSh0cnVlKVxuICAgIH0pKVxuICB9XG4gIHJlZnJlc2goc2NvcGUpIHtcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIHRoaXMubWVzc2FnZXMpIHtcbiAgICAgIG1lc3NhZ2VbMV0udXBkYXRlVmlzaWJpbGl0eShzY29wZSlcbiAgICB9XG4gIH1cbiAgc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSkge1xuICAgIGlmIChyZW1vdmVkLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTWVzc2FnZXMocmVtb3ZlZClcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIGFkZGVkKSB7XG4gICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IE1lc3NhZ2UuZnJvbU1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudClcbiAgICAgIG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkodGhpcy5zY29wZSlcbiAgICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2UsIG1lc3NhZ2VFbGVtZW50KVxuICAgIH1cbiAgfVxuICByZW1vdmVNZXNzYWdlcyhyZW1vdmVkKSB7XG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiByZW1vdmVkKSB7XG4gICAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMubWVzc2FnZXMuZ2V0KG1lc3NhZ2UpKVxuICAgICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXRWaXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnZpc2liaWxpdHlcbiAgfVxuICBzZXRWaXNpYmlsaXR5KHZhbHVlKXtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSB2YWx1ZSAmJiB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgJiYgdGhpcy5wYW5lVmlzaWJpbGl0eVxuICAgIGlmICh0aGlzLnZpc2liaWxpdHkpIHtcbiAgICAgIHRoaXMucGFuZWwuc2hvdygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwuaGlkZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gIH1cbn1cbiJdfQ==