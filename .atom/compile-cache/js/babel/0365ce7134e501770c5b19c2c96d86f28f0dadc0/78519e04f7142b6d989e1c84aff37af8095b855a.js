riot.tag('fav', '<ul id="favorite"> <h3> Favorites </h3> <li each="{ opts.fav }"> <a href="{ uri }" target=_blank > { uri } </a> <img src="unfav.png" onclick="{ parent.delete }"> </img> </li> </ul>', function (opts) {
  this['delete'] = (function (_this) {
    return function (e) {
      return ipc.sendToHost('remFav', e.item);
    };
  })(this);
});

riot.tag('hist', '<label>Search History</label> <input type="text" name="search" onkeyup="{ filter }"> <ul id="history"> <input type="button" name="clear" value="Clearing Browsing Data" onclick="{ clear }"> <h3> History</h3> <hist-date-li each="{ name,i in opts.hist }" data="{ name }"></hist-date-li> </ul>', function (opts) {
  this.clear = (function (_this) {
    return function (e) {
      return ipc.sendToHost('clearHist');
    };
  })(this);

  this['delete'] = (function (_this) {
    return function (e) {
      var curr;
      curr = this.opts.data;
      return ipc.sendToHost('remHistDate', curr);
    };
  })(this);

  this.filter = (function (_this) {
    return function (e) {
      var date, hide_date, hist, itm, itms, _i, _j, _len, _len1, _ref, _results;
      _ref = this.opts.hist;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hist = _ref[_i];
        for (date in hist) {
          itms = hist[date];
          hide_date = true;
          for (_j = 0, _len1 = itms.length; _j < _len1; _j++) {
            itm = itms[_j];
            if (_this.search.value.length < 2) {
              itm.hide = false;
              hide_date = false;
            } else {
              if (itm.uri.indexOf(_this.search.value) < 0) {
                itm.hide = true;
              } else {
                itm.hide = false;
                hide_date = false;
              }
            }
          }
        }
        _results.push(itms.hide_date = hide_date);
      }
      return _results;
    };
  })(this);
});

riot.tag('hist-date-li', '<li class="{ hide: itms.hide_date }"> <span>{ getDate(opts.data) }</span> <img src="trash.png" onclick="{ parent.parent.delete }"> </img> <ul> <li each="{ itms }" class="{ hide: hide }"> <a href="#" onclick="window.open(\'{ uri }\')"> { uri } </a> <span> { moment(date).format(\'h:mm A\') } </span> <img src="trash.png" onclick="{ parent.delete }"> </img> </li> </ul> </li>', 'hist-date-li .hide{ display: none; } hist-date-li a{ text-decoration: un } hist-date-li .color{ background-color: yellow; } .octicon-trashcan::before{ font-family:\'Octicons Regular\'; content: "\\f0d0"; }', function (opts) {
  this.getDate = (function (_this) {
    return function (obj) {
      var date, datum, itms;
      for (date in obj) {
        itms = obj[date];
        _this.date = date;
        _this.itms = itms;
      }
      return datum = moment(date).format('dddd, MMMM Do YYYY');
    };
  })(this);

  this['delete'] = (function (_this) {
    return function (e) {
      return ipc.sendToHost('remHist', e.item);
    };
  })(this);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jYXRoL2hvbWVzMi96Y2FwYW11Ly5hdG9tL3BhY2thZ2VzL2Jyb3dzZXItcGx1cy9yZXNvdXJjZXMvaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxzTEFBc0wsRUFBRSxVQUFTLElBQUksRUFBRTtBQUFDLE1BQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ3hQLFdBQU8sVUFBUyxDQUFDLEVBQUU7QUFDakIsYUFBTyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekMsQ0FBQztHQUNILENBQUEsQ0FBRSxJQUFJLENBQUMsQ0FBQztDQUVSLENBQUMsQ0FBQzs7QUFHSCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxtU0FBbVMsRUFBRSxVQUFTLElBQUksRUFBRTtBQUFDLE1BQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNsVyxXQUFPLFVBQVMsQ0FBQyxFQUFFO0FBQ2pCLGFBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNwQyxDQUFDO0dBQ0gsQ0FBQSxDQUFFLElBQUksQ0FBQyxDQUFDOztBQUVULE1BQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ2hDLFdBQU8sVUFBUyxDQUFDLEVBQUU7QUFDakIsVUFBSSxJQUFJLENBQUM7QUFDVCxVQUFJLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsYUFBTyxHQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QyxDQUFDO0dBQ0gsQ0FBQSxDQUFFLElBQUksQ0FBQyxDQUFDOztBQUVULE1BQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUM3QixXQUFPLFVBQVMsQ0FBQyxFQUFFO0FBQ2pCLFVBQUksSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQztBQUMxRSxVQUFJLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDdkIsY0FBUSxHQUFHLEVBQUUsQ0FBQztBQUNkLFdBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ2hELFlBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEIsYUFBSyxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ2pCLGNBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsbUJBQVMsR0FBRyxJQUFJLENBQUM7QUFDakIsZUFBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDbEQsZUFBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNmLGdCQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDakMsaUJBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLHVCQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ25CLE1BQU07QUFDTCxrQkFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMzQyxtQkFBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7ZUFDakIsTUFBTTtBQUNMLG1CQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUNqQix5QkFBUyxHQUFHLEtBQUssQ0FBQztlQUNuQjthQUNGO1dBQ0Y7U0FDRjtBQUNELGdCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7T0FDM0M7QUFDRCxhQUFPLFFBQVEsQ0FBQztLQUNqQixDQUFDO0dBQ0gsQ0FBQSxDQUFFLElBQUksQ0FBQyxDQUFDO0NBRVIsQ0FBQyxDQUFDOztBQUVILElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLHVYQUF1WCxFQUFFLCtNQUErTSxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQUMsTUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ2pwQixXQUFPLFVBQVMsR0FBRyxFQUFFO0FBQ25CLFVBQUksSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDdEIsV0FBSyxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ2hCLFlBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakIsYUFBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsYUFBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDbkI7QUFDRCxhQUFPLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDMUQsQ0FBQztHQUNILENBQUEsQ0FBRSxJQUFJLENBQUMsQ0FBQzs7QUFFVCxNQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNoQyxXQUFPLFVBQVMsQ0FBQyxFQUFFO0FBQ2pCLGFBQU8sR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFDLENBQUM7R0FDSCxDQUFBLENBQUUsSUFBSSxDQUFDLENBQUM7Q0FFUixDQUFDLENBQUMiLCJmaWxlIjoiL2NhdGgvaG9tZXMyL3pjYXBhbXUvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL3Jlc291cmNlcy9oaXN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmlvdC50YWcoJ2ZhdicsICc8dWwgaWQ9XCJmYXZvcml0ZVwiPiA8aDM+IEZhdm9yaXRlcyA8L2gzPiA8bGkgZWFjaD1cInsgb3B0cy5mYXYgfVwiPiA8YSBocmVmPVwieyB1cmkgfVwiIHRhcmdldD1fYmxhbmsgPiB7IHVyaSB9IDwvYT4gPGltZyBzcmM9XCJ1bmZhdi5wbmdcIiBvbmNsaWNrPVwieyBwYXJlbnQuZGVsZXRlIH1cIj4gPC9pbWc+IDwvbGk+IDwvdWw+JywgZnVuY3Rpb24ob3B0cykge3RoaXNbXCJkZWxldGVcIl0gPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gaXBjLnNlbmRUb0hvc3QoJ3JlbUZhdicsIGUuaXRlbSk7XG4gIH07XG59KSh0aGlzKTtcblxufSk7XG5cblxucmlvdC50YWcoJ2hpc3QnLCAnPGxhYmVsPlNlYXJjaCBIaXN0b3J5PC9sYWJlbD4gPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNlYXJjaFwiIG9ua2V5dXA9XCJ7IGZpbHRlciB9XCI+IDx1bCBpZD1cImhpc3RvcnlcIj4gPGlucHV0IHR5cGU9XCJidXR0b25cIiBuYW1lPVwiY2xlYXJcIiB2YWx1ZT1cIkNsZWFyaW5nIEJyb3dzaW5nIERhdGFcIiBvbmNsaWNrPVwieyBjbGVhciB9XCI+IDxoMz4gSGlzdG9yeTwvaDM+IDxoaXN0LWRhdGUtbGkgZWFjaD1cInsgbmFtZSxpIGluIG9wdHMuaGlzdCB9XCIgZGF0YT1cInsgbmFtZSB9XCI+PC9oaXN0LWRhdGUtbGk+IDwvdWw+JywgZnVuY3Rpb24ob3B0cykge3RoaXMuY2xlYXIgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gaXBjLnNlbmRUb0hvc3QoJ2NsZWFySGlzdCcpO1xuICB9O1xufSkodGhpcyk7XG5cbnRoaXNbXCJkZWxldGVcIl0gPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgY3VycjtcbiAgICBjdXJyID0gIHRoaXMub3B0cy5kYXRhO1xuICAgIHJldHVybiBpcGMuc2VuZFRvSG9zdCgncmVtSGlzdERhdGUnLCBjdXJyKTtcbiAgfTtcbn0pKHRoaXMpO1xuXG50aGlzLmZpbHRlciA9IChmdW5jdGlvbihfdGhpcykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHZhciBkYXRlLCBoaWRlX2RhdGUsIGhpc3QsIGl0bSwgaXRtcywgX2ksIF9qLCBfbGVuLCBfbGVuMSwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgX3JlZiA9ICB0aGlzLm9wdHMuaGlzdDtcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgaGlzdCA9IF9yZWZbX2ldO1xuICAgICAgZm9yIChkYXRlIGluIGhpc3QpIHtcbiAgICAgICAgaXRtcyA9IGhpc3RbZGF0ZV07XG4gICAgICAgIGhpZGVfZGF0ZSA9IHRydWU7XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IGl0bXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgaXRtID0gaXRtc1tfal07XG4gICAgICAgICAgaWYgKF90aGlzLnNlYXJjaC52YWx1ZS5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBpdG0uaGlkZSA9IGZhbHNlO1xuICAgICAgICAgICAgaGlkZV9kYXRlID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpdG0udXJpLmluZGV4T2YoX3RoaXMuc2VhcmNoLnZhbHVlKSA8IDApIHtcbiAgICAgICAgICAgICAgaXRtLmhpZGUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaXRtLmhpZGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaGlkZV9kYXRlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfcmVzdWx0cy5wdXNoKGl0bXMuaGlkZV9kYXRlID0gaGlkZV9kYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xufSkodGhpcyk7XG5cbn0pO1xuXG5yaW90LnRhZygnaGlzdC1kYXRlLWxpJywgJzxsaSBjbGFzcz1cInsgaGlkZTogaXRtcy5oaWRlX2RhdGUgfVwiPiA8c3Bhbj57IGdldERhdGUob3B0cy5kYXRhKSB9PC9zcGFuPiA8aW1nIHNyYz1cInRyYXNoLnBuZ1wiIG9uY2xpY2s9XCJ7IHBhcmVudC5wYXJlbnQuZGVsZXRlIH1cIj4gPC9pbWc+IDx1bD4gPGxpIGVhY2g9XCJ7IGl0bXMgfVwiIGNsYXNzPVwieyBoaWRlOiBoaWRlIH1cIj4gPGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwid2luZG93Lm9wZW4oXFwneyB1cmkgfVxcJylcIj4geyB1cmkgfSA8L2E+IDxzcGFuPiB7IG1vbWVudChkYXRlKS5mb3JtYXQoXFwnaDptbSBBXFwnKSB9IDwvc3Bhbj4gPGltZyBzcmM9XCJ0cmFzaC5wbmdcIiBvbmNsaWNrPVwieyBwYXJlbnQuZGVsZXRlIH1cIj4gPC9pbWc+IDwvbGk+IDwvdWw+IDwvbGk+JywgJ2hpc3QtZGF0ZS1saSAuaGlkZXsgZGlzcGxheTogbm9uZTsgfSBoaXN0LWRhdGUtbGkgYXsgdGV4dC1kZWNvcmF0aW9uOiB1biB9IGhpc3QtZGF0ZS1saSAuY29sb3J7IGJhY2tncm91bmQtY29sb3I6IHllbGxvdzsgfSAub2N0aWNvbi10cmFzaGNhbjo6YmVmb3JleyBmb250LWZhbWlseTpcXCdPY3RpY29ucyBSZWd1bGFyXFwnOyBjb250ZW50OiBcIlxcXFxmMGQwXCI7IH0nLCBmdW5jdGlvbihvcHRzKSB7dGhpcy5nZXREYXRlID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgZGF0ZSwgZGF0dW0sIGl0bXM7XG4gICAgZm9yIChkYXRlIGluIG9iaikge1xuICAgICAgaXRtcyA9IG9ialtkYXRlXTtcbiAgICAgIF90aGlzLmRhdGUgPSBkYXRlO1xuICAgICAgX3RoaXMuaXRtcyA9IGl0bXM7XG4gICAgfVxuICAgIHJldHVybiBkYXR1bSA9IG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWScpO1xuICB9O1xufSkodGhpcyk7XG5cbnRoaXNbXCJkZWxldGVcIl0gPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gaXBjLnNlbmRUb0hvc3QoJ3JlbUhpc3QnLCBlLml0ZW0pO1xuICB9O1xufSkodGhpcyk7XG5cbn0pO1xuIl19