// (C) 2009 henrik.lindqvist@llamalab.com
if (typeof Selector === 'undefined') {
  new function () {
    function Selector(p, c) {
      if (!(this instanceof Selector)) return new Selector(p).exec(c);if (!qsa) this.exec = cache[p] || (cache[p] = new compile(p));this.pattern = p;
    }
    Selector.prototype = { constructor: Selector, exec: function exec(c) {
        var pe = this.patchElement,
            pa = this.patchArray,
            p = this.pattern,
            r = pe ? map.call((c || d).querySelectorAll(p), pe, this) : Array.prototype.slice.call((c || d).querySelectorAll(p));return pa ? pa.call(this, r) : r;
      }, toString: function toString() {
        return this.pattern;
      }, toSource: function toSource() {
        return 'new Selector("' + this.pattern + '")';
      } };window.Selector = Selector;function $(s) {
      var a = arguments;return s.replace(/\$(\d)/g, function (m, i) {
        return a[i];
      });
    }
    with (navigator.userAgent) {
      var ie = indexOf('MSIE') != -1 && indexOf('Opera') == -1,
          mz = indexOf('Gecko') != -1 && indexOf('KHTML') == -1,
          wk = indexOf('AppleWebKit') != -1;
    }
    var d = document,
        de = d.documentElement,
        qsa = !!d.querySelectorAll,
        bcn = !!d.getElementsByClassName,
        cnl = !!de.children,
        cnlt = cnl && de.children.tags && !wk,
        ec = !!de.contains,
        cdp = !!de.compareDocumentPosition,
        si = typeof de.sourceIndex == 'number',
        cache = {},
        cmp = { '=': 'if($1($2=="$3")){$5}', '^=': 'if($1((x=$2)&&!x.indexOf("$3"))){$5}', '*=': 'if($1((x=$2)&&x.indexOf("$3")!=-1)){$5}', '$=': 'if($1((x=$2)&&x.indexOf("$3",x.length-$4)!=-1)){$5}', '~=': 'if($1((x=$2)&&(y=x.indexOf("$3"))!=-1&&(x.charCodeAt(y-1)||32)==32&&(x.charCodeAt(y+$4)||32)==32)){$5}', '|=': 'if($1((x=$2)&&(x=="$3"||!x.indexOf("$3-")))){$5}' },
        map = Array.prototype.map || function (fn, tp) {
      var i = this.length,
          r = new Array(i);while (--i >= 0) r[i] = fn.call(tp, this[i], i, this);return r;
    };with (d.implementation) {
      var me = d.addEventListener && (hasFeature('MutationEvents', '2.0') || hasFeature('Events', '2.0') && hasFeature('Core', '2.0'));
    }
    Selector.guid = 0;Selector.nthIndex = function (LLi, c, r, tp, tv) {
      var p = c.parentNode,
          ci = 'LLi#' + tv,
          pl = 'LLi$' + tv;if (!p) return Number.NaN;if (!c[ci] || c.LLi != LLi) {
        for (var n = p.firstChild, i = 0; n; n = n.nextSibling) {
          if (n[tp] == tv) {
            n[ci] = ++i;n.LLi = LLi;
          }
        }
        p[pl] = i;
      }
      return r ? 1 + p[pl] - c[ci] : c[ci];
    };if (me) {
      var fn = function fn(e) {
        with (e.target) {
          if (nodeType !== 2) ownerDocument.LLi = ++Selector.guid;
        }
      };

      d.addEventListener('DOMNodeInserted', fn, false);d.addEventListener('DOMNodeRemoved', fn, false);
    }
    if (ie) {
      var am = { acceptcharset: 'acceptCharset', accesskey: 'accessKey', cellpadding: 'cellPadding', cellspacing: 'cellSpacing', checked: 'defaultChecked', selected: 'defaultSelected', 'class': 'className', colspan: 'colSpan', 'for': 'htmlFor', frameborder: 'frameBorder', hspace: 'hSpace', longdesc: 'longDesc', marginwidth: 'marginWidth', marginheight: 'marginHeight', noresize: 'noResize', noshade: 'noShade', maxlength: 'maxLength', readonly: 'readOnly', rowspan: 'rowSpan', tabindex: 'tabIndex', usemap: 'useMap', valign: 'vAlign', vspace: 'vSpace' },
          ab = { compact: 1, nowrap: 1, ismap: 1, declare: 1, noshade: 1, checked: 1, disabled: 1, readonly: 1, multiple: 1, selected: 1, noresize: 1, defer: 1 };
    }
    function compile(qp) {
      this.dup = this.srt = this.idx = this.i = this.nqp = 0;with (this) {
        var js = '';do {
          i = nqp = 0;js += $('n=c;$1q:do{$2}while(false);', srt ? 's=0;' : '', type(qp, $(srt ? 'for(x=r.length;s<x;z=s+((x-s)/2)|0,($1)?s=z+1:x=z);if(s<r.length)r.splice(s++,0,$2);else r[s++]=$2;' : 'r[s++]=$2;', cdp ? 'r[z].compareDocumentPosition(n)&4' : 'h[r[z].LLn]<h[n.LLn]', 'pe?pe.call(this,n):n'), 0, '*'));
        } while (qp = nqp);js = $('var r=[],s=0,n,x,y,z,d=c?c.ownerDocument||c.document||c:c=document,pe=this.patchElement,pa=this.patchArray$1$2;$3return pa?pa.call(this,r):r;', dup > 0 ? ',h={}' : '', idx ? me ? ',LLi=d.LLi||(d.LLi=++Selector.guid)' : ',LLi=++Selector.guid' : '', js);return new Function('c', js);
      }
    }
    compile.prototype = { type: function type(qp, js, n, s, c) {
        with (this) {
          var m = /^\s*([\w-]+|\*)?(.*)/.exec(qp),
              t = m[1] || '*';if (!n && c == ' ' && !dup) dup = 1;js = pred(m[2], js, n, t, c);switch (c) {case '>':
              return cnlt && t != '*' ? $('for(var n$1=n.children.tags("$2"),i$1=0;n=n$1[i$1++];){$3}', ++i, t, js) : $(cnl ? 'for(var n$1=n.children,i$1=0;n=n$1[i$1++];)$2{$3}' : 'for(n=n.firstChild;n;n=n.nextSibling)$2{$3}', ++i, t != '*' ? 'if(n.nodeName==="' + t.toUpperCase() + '")' : !cnl || ie ? 'if(n.nodeType===1)' : '', js);case '+':
              return $('while(n=n.nextSibling)if(n.node$1){$2break}else if(n.nodeType===1)break;', t == '*' ? 'Type===1' : 'Name==="' + t.toUpperCase() + '"', js);case '~':
              return $('while(n=n.nextSibling)if(n.node$1){$3}else if(n.node$2)break;', t == '*' ? 'Type===1' : 'Name==="' + t.toUpperCase() + '"', s == '*' ? 'Type===1' : 'Name==="' + s.toUpperCase() + '"', js);default:
              return typeof js == 'object' ? String(js) : n ? t == '*' ? js : $('if(n.nodeName!="$1"){$2}', t.toUpperCase(), js) : $('for(var n$1=n.getElementsByTagName("$2"),i$1=0;n=n$1[i$1++];)$3{$4}', ++i, t, ie && t == '*' ? 'if(n.nodeType===1)' : '', js);}
        }
      }, pred: (function (_pred) {
        function pred(_x, _x2, _x3, _x4, _x5) {
          return _pred.apply(this, arguments);
        }

        pred.toString = function () {
          return _pred.toString();
        };

        return pred;
      })(function (qp, js, n, t, c) {
        with (this) {
          var m = /^([#\.])([\w-]+)(.*)/.exec(qp) || /^(\[)\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(?:(['"])(.*?)\4|([\w-]+)))?\s*\](.*)/.exec(qp) || /^:(first|last|only)-(?:(child)|of-type)(.*)/.exec(qp) || /^:(nth)-(?:(last)-)?(?:(child)|of-type)\(\s*(?:(odd|even)|(-|\d*)n([+-]\d+)?|([1-9]\d*))\s*\)(.*)/.exec(qp) || /^:(active|checked|(?:dis|en)abled|empty|focus|link|root|target)(.*)/.exec(qp) || /^:(lang)\(\s*(['"])?(.*?)\2\s*\)(.*)/.exec(qp) || !n && /^:(not)\(\s*(.*)\s*\)(.*)/.exec(qp),
              x = 0;if (!m) {
            if (m = /^\s*([+>~,\s])\s*(\S.*)/.exec(qp)) {
              if (m[1] != ',') return type(m[2], js, n, t, m[1]);nqp = m[2];dup = 2;
            } else if (/\S/.test(qp)) throw new Error('Illegal query near: ' + qp);return dup < 1 ? js : $('if(!h[x=n.LLn||(n.LLn=++Selector.guid)]){h[x]=$1;$2}', !srt || cdp ? 'true' : si ? 'n.sourceIndex' : 'Selector.srcIndex(h,n)', js);
          }
          if (!n && m[1] == '#' && dup != 2) dup = -1;js = pred(m[m.length - 1], js, n, t, 1);switch (m[1]) {case '#':
              return uniq(js, n, t, c, ie, 'n.id', '"' + m[2] + '"', 'd.getElementById("' + m[2] + '")');case '.':
              return bcn && !n && (!c || c == ' ') && (t == '*' || !mz) ? Object($('for(var n$1=n.getElementsByClassName("$2"),i$1=0;n=n$1[i$1++];)$3{$4}', ++i, m[2], t == '*' ? '' : 'if(n.nodeName==="' + t.toUpperCase() + '")', js)) : $(cmp['~='], n ? '!' : '', 'n.className', x = m[2], x.length, js);case '[':
              return (x = m[3]) ? $(cmp[x], n ? '!' : '', ie ? (x = m[2].toLowerCase()) == 'style' ? 'style.cssText.toLowerCase()' : ab[x] ? 'n.' + x + '&&"' + x + '"' : 'n.getAttribute("' + (am[x] || x) + '",2)' : 'n.getAttribute("' + m[2] + '")', x = m[5] || m[6], x.length, js) : $(ie ? 'if($1((x=n.getAttributeNode("$2"))&&x.specified)){$3}' : 'if($1n.hasAttribute("$2")){$3}', n ? '!' : '', m[2], js);case 'active':case 'focus':
              return uniq(js, n, t, c, 0, 'n', 'd.activeElement');case 'checked':
              return $('if($1(n.checked||n.selected)){$2}', n ? '!' : '', js);case 'disabled':
              x = 1;case 'enabled':
              return $('if(n.disabled===$1$2){$3}', !!(x ^ n), ie ? '&&((x=n.nodeName)==="BUTTON"||x==="INPUT"||x==="OPTION"||x==="OPTGROUP"||x==="SELECT"||x==="TEXTAREA"' : '', js);case 'empty':
              return $('for(x=n.firstChild;x&&x.nodeType>3;x=x.nextSibling);if($1x){$2}', n ? '' : '!', js);case 'first':
              return flo(js, n, m[2], 'previous');case 'lang':
              return $(cmp['|='], n ? '!' : '', 'n.lang', x = m[3], x.length, js);case 'last':
              return flo(js, n, m[2], 'next');case 'link':
              return $('if($1(n.nodeName==="A"&&n.href)){$2}', n ? '!' : '', js);case 'nth':
              var a = m[4] ? 2 : m[5] == '-' ? -1 : m[7] ? 0 : m[5] ? m[5] - 0 : 1,
                  b = m[4] == 'odd' ? 1 : (m[6] || m[7]) - 0 || 0;if (a == 1) return js;if (a == 0 && b == 1) return flo(js, n, m[3], m[2] ? 'next' : 'previous');if (a == b) b = 0;if (b < 0) b = a + b;idx = 1;return $('if($1(Selector.nthIndex(LLi,n,$2,"node$3",$4)$5)){$6}', n ? '!' : '', !!m[2], m[3] ? 'Type' : 'Name', m[3] ? '1' : 'n.nodeName', a < 0 ? '<=' + b : a ? '%' + a + '===' + b : '===' + b, js);case 'not':
              return type(m[2], js, 1, '*');case 'only':
              return flo(js, n, m[2]);case 'root':
              return uniq(js, n, t, c, 0, 'n', 'd.documentElement');case 'target':
              x = '(d.defaultView||d.parentWindow||window).location.hash.substr(1)';return uniq(js, n, t, c, ie, 'n.id', x, 'd.getElementById(' + x + ')');}
        }
      }), uniq: function uniq(js, n, t, c, d, p, v, w) {
        return n || c && c != ' ' || d ? $(n ? 'if($1!==$2){$3}' : 'if($1===$2){$3break q}', p, v, js) : Object($(ec ? 'if((x=$1)===n||!n.contains||n.contains(x))$2' : cdp ? 'if((x=$1)===n||!n.compareDocumentPosition||n.compareDocumentPosition(x)&16)$2' : 'for(x=y=$1;y;y=y.parentNode)if(y===n)$2', w || v, t == '*' ? '{n=x;' + js + 'break q}' : '{if((n=x).nodeName==="' + t.toUpperCase() + '"){' + js + '}break q}'));
      }, flo: function flo(js, n, t, s) {
        return $(s ? 'for($2x=n.$1Sibling;x&&x.node$3;x=x.$1Sibling);if($4x){$5}' : 'for($2(x=n.parentNode)&&(x=x.firstChild);x&&(x.node$3||x===n);x=x.nextSibling);if($4x){$5}', s, t ? '' : 'y=n.nodeName,', t ? 'Type!==1' : 'Name!==y', n ? '' : '!', js);
      } };
  }();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jYXRoL2hvbWVzMi96Y2FwYW11Ly5hdG9tL3BhY2thZ2VzL2Jyb3dzZXItcGx1cy9yZXNvdXJjZXMvc2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFO0FBQ25DLE1BQUksWUFBVTtBQUFDLGFBQVMsUUFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUM7QUFBQyxVQUFHLEVBQUUsSUFBSSxZQUFZLFFBQVEsQ0FBQSxFQUFFLE9BQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLElBQUksR0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUUsSUFBSSxDQUFDLE9BQU8sR0FBQyxDQUFDLENBQUM7S0FBQztBQUMxSyxZQUFRLENBQUMsU0FBUyxHQUFDLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsY0FBUyxDQUFDLEVBQUM7QUFBQyxZQUFJLEVBQUUsR0FBQyxJQUFJLENBQUMsWUFBWTtZQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsVUFBVTtZQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsT0FBTztZQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUEsQ0FBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsSUFBSSxDQUFDLEdBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQSxDQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUMsRUFBRSxDQUFDLElB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RyxHQUFDLENBQUMsR0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLHNEQUFzRCxFQUFDLENBQUMsR0FBRyxJQUFFLEdBQUcsR0FBQyxNQUFNLEdBQUMsRUFBRSxHQUFDLGVBQWUsR0FBQyx3QkFBd0IsRUFBQyxFQUFFLENBQUMsQ0FBQztXQUFDO0FBQzVNLGNBQUcsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsSUFBRSxHQUFHLElBQUUsQ0FBQyxFQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLFFBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLEtBQUksR0FBRztBQUFDLHFCQUFPLElBQUksQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBQyxvQkFBb0IsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUMsS0FBSSxHQUFHO0FBQUMscUJBQU8sR0FBRyxJQUFFLENBQUMsQ0FBQyxLQUFHLENBQUMsQ0FBQyxJQUFFLENBQUMsSUFBRSxHQUFHLENBQUEsS0FBSSxDQUFDLElBQUUsR0FBRyxJQUFFLENBQUMsRUFBRSxDQUFBLEdBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyx1RUFBdUUsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFFLEdBQUcsR0FBQyxFQUFFLEdBQUMsbUJBQW1CLEdBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFDLElBQUksRUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxFQUFFLEVBQUMsYUFBYSxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsQ0FBQyxLQUFJLEdBQUc7QUFBQyxxQkFBTSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsRUFBRSxFQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUEsSUFBRyxPQUFPLEdBQUMsNkJBQTZCLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksR0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsa0JBQWtCLElBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQSxHQUFFLE1BQU0sR0FBQyxrQkFBa0IsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBQyx1REFBdUQsR0FBQyxnQ0FBZ0MsRUFBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsS0FBSSxRQUFRLENBQUMsS0FBSSxPQUFPO0FBQUMscUJBQU8sSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSSxTQUFTO0FBQUMscUJBQU8sQ0FBQyxDQUFDLG1DQUFtQyxFQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUksVUFBVTtBQUFDLGVBQUMsR0FBQyxDQUFDLENBQUMsS0FBSSxTQUFTO0FBQUMscUJBQU8sQ0FBQyxDQUFDLDJCQUEyQixFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxDQUFBLEVBQUUsRUFBRSxHQUFDLHVHQUF1RyxHQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxLQUFJLE9BQU87QUFBQyxxQkFBTyxDQUFDLENBQUMsaUVBQWlFLEVBQUMsQ0FBQyxHQUFDLEVBQUUsR0FBQyxHQUFHLEVBQUMsRUFBRSxDQUFDLENBQUMsS0FBSSxPQUFPO0FBQUMscUJBQU8sR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUksTUFBTTtBQUFDLHFCQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsQ0FBQyxLQUFJLE1BQU07QUFBQyxxQkFBTyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxDQUFDLENBQUMsS0FBSSxNQUFNO0FBQUMscUJBQU8sQ0FBQyxDQUFDLHNDQUFzQyxFQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUksS0FBSztBQUFDLGtCQUFJLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBRSxHQUFHLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDO2tCQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsS0FBSyxHQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDLElBQUUsQ0FBQyxDQUFDLElBQUcsQ0FBQyxJQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxJQUFHLENBQUMsSUFBRSxDQUFDLElBQUUsQ0FBQyxJQUFFLENBQUMsRUFBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsTUFBTSxHQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUcsQ0FBQyxJQUFFLENBQUMsRUFBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHVEQUF1RCxFQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLE1BQU0sR0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxZQUFZLEVBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxJQUFJLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsQ0FBQyxHQUFDLEtBQUssR0FBQyxDQUFDLEdBQUMsS0FBSyxHQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxLQUFJLEtBQUs7QUFBQyxxQkFBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUMsS0FBSSxNQUFNO0FBQUMscUJBQU8sR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxNQUFNO0FBQUMscUJBQU8sSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLG1CQUFtQixDQUFDLENBQUMsS0FBSSxRQUFRO0FBQUMsZUFBQyxHQUFDLGlFQUFpRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxtQkFBbUIsR0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUFDO09BQUMsQ0FBQSxFQUFDLElBQUksRUFBQyxjQUFTLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUM7QUFBQyxlQUFNLENBQUUsSUFBRyxDQUFDLElBQUUsQ0FBQyxJQUFFLEdBQUcsSUFBRyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUMsR0FBQyxpQkFBaUIsR0FBQyx3QkFBd0IsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFDLDhDQUE4QyxHQUFDLEdBQUcsR0FBQywrRUFBK0UsR0FBQyx5Q0FBeUMsRUFBQyxDQUFDLElBQUUsQ0FBQyxFQUFDLENBQUMsSUFBRSxHQUFHLEdBQUMsT0FBTyxHQUFDLEVBQUUsR0FBQyxVQUFVLEdBQUMsd0JBQXdCLEdBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFDLEtBQUssR0FBQyxFQUFFLEdBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUFDLEVBQUMsR0FBRyxFQUFDLGFBQVMsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDO0FBQUMsZUFBTyxDQUFDLENBQUMsQ0FBQyxHQUFDLDREQUE0RCxHQUFDLDRGQUE0RixFQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsRUFBRSxHQUFDLGVBQWUsRUFBQyxDQUFDLEdBQUMsVUFBVSxHQUFDLFVBQVUsRUFBQyxDQUFDLEdBQUMsRUFBRSxHQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQztPQUFDLEVBQUMsQ0FBQztHQUFDLEVBQUEsQ0FBQTtDQUN0b0YiLCJmaWxlIjoiL2NhdGgvaG9tZXMyL3pjYXBhbXUvLmF0b20vcGFja2FnZXMvYnJvd3Nlci1wbHVzL3Jlc291cmNlcy9zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIChDKSAyMDA5IGhlbnJpay5saW5kcXZpc3RAbGxhbWFsYWIuY29tXG5pZiAodHlwZW9mIFNlbGVjdG9yID09PSAndW5kZWZpbmVkJykge1xuICBuZXcgZnVuY3Rpb24oKXtmdW5jdGlvbiBTZWxlY3RvcihwLGMpe2lmKCEodGhpcyBpbnN0YW5jZW9mIFNlbGVjdG9yKSlyZXR1cm4gbmV3IFNlbGVjdG9yKHApLmV4ZWMoYyk7aWYoIXFzYSl0aGlzLmV4ZWM9Y2FjaGVbcF18fChjYWNoZVtwXT1uZXcgY29tcGlsZShwKSk7dGhpcy5wYXR0ZXJuPXA7fVxuICBTZWxlY3Rvci5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOlNlbGVjdG9yLGV4ZWM6ZnVuY3Rpb24oYyl7dmFyIHBlPXRoaXMucGF0Y2hFbGVtZW50LHBhPXRoaXMucGF0Y2hBcnJheSxwPXRoaXMucGF0dGVybixyPXBlP21hcC5jYWxsKChjfHxkKS5xdWVyeVNlbGVjdG9yQWxsKHApLHBlLHRoaXMpOkFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKChjfHxkKS5xdWVyeVNlbGVjdG9yQWxsKHApKTtyZXR1cm4gcGE/cGEuY2FsbCh0aGlzLHIpOnI7fSx0b1N0cmluZzpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdHRlcm47fSx0b1NvdXJjZTpmdW5jdGlvbigpe3JldHVybiduZXcgU2VsZWN0b3IoXCInK3RoaXMucGF0dGVybisnXCIpJzt9fTt3aW5kb3cuU2VsZWN0b3I9U2VsZWN0b3I7ZnVuY3Rpb24gJChzKXt2YXIgYT1hcmd1bWVudHM7cmV0dXJuIHMucmVwbGFjZSgvXFwkKFxcZCkvZyxmdW5jdGlvbihtLGkpe3JldHVybiBhW2ldfSk7fVxuICB3aXRoKG5hdmlnYXRvci51c2VyQWdlbnQpe3ZhciBpZT1pbmRleE9mKCdNU0lFJykhPS0xJiZpbmRleE9mKCdPcGVyYScpPT0tMSxtej1pbmRleE9mKCdHZWNrbycpIT0tMSYmaW5kZXhPZignS0hUTUwnKT09LTEsd2s9aW5kZXhPZignQXBwbGVXZWJLaXQnKSE9LTE7fVxuICB2YXIgZD1kb2N1bWVudCxkZT1kLmRvY3VtZW50RWxlbWVudCxxc2E9ISFkLnF1ZXJ5U2VsZWN0b3JBbGwsYmNuPSEhZC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lLGNubD0hIWRlLmNoaWxkcmVuLGNubHQ9Y25sJiZkZS5jaGlsZHJlbi50YWdzJiYhd2ssZWM9ISFkZS5jb250YWlucyxjZHA9ISFkZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbixzaT10eXBlb2YgZGUuc291cmNlSW5kZXg9PSdudW1iZXInLGNhY2hlPXt9LGNtcD17Jz0nOidpZigkMSgkMj09XCIkM1wiKSl7JDV9JywnXj0nOidpZigkMSgoeD0kMikmJiF4LmluZGV4T2YoXCIkM1wiKSkpeyQ1fScsJyo9JzonaWYoJDEoKHg9JDIpJiZ4LmluZGV4T2YoXCIkM1wiKSE9LTEpKXskNX0nLCckPSc6J2lmKCQxKCh4PSQyKSYmeC5pbmRleE9mKFwiJDNcIix4Lmxlbmd0aC0kNCkhPS0xKSl7JDV9Jywnfj0nOidpZigkMSgoeD0kMikmJih5PXguaW5kZXhPZihcIiQzXCIpKSE9LTEmJih4LmNoYXJDb2RlQXQoeS0xKXx8MzIpPT0zMiYmKHguY2hhckNvZGVBdCh5KyQ0KXx8MzIpPT0zMikpeyQ1fScsJ3w9JzonaWYoJDEoKHg9JDIpJiYoeD09XCIkM1wifHwheC5pbmRleE9mKFwiJDMtXCIpKSkpeyQ1fSd9LG1hcD1BcnJheS5wcm90b3R5cGUubWFwfHxmdW5jdGlvbihmbix0cCl7dmFyIGk9dGhpcy5sZW5ndGgscj1uZXcgQXJyYXkoaSk7d2hpbGUoLS1pPj0wKXJbaV09Zm4uY2FsbCh0cCx0aGlzW2ldLGksdGhpcyk7cmV0dXJuIHI7fTt3aXRoKGQuaW1wbGVtZW50YXRpb24pe3ZhciBtZT1kLmFkZEV2ZW50TGlzdGVuZXImJihoYXNGZWF0dXJlKCdNdXRhdGlvbkV2ZW50cycsJzIuMCcpfHxoYXNGZWF0dXJlKCdFdmVudHMnLCcyLjAnKSYmaGFzRmVhdHVyZSgnQ29yZScsJzIuMCcpKTt9XG4gIFNlbGVjdG9yLmd1aWQ9MDtTZWxlY3Rvci5udGhJbmRleD1mdW5jdGlvbihMTGksYyxyLHRwLHR2KXt2YXIgcD1jLnBhcmVudE5vZGUsY2k9J0xMaSMnK3R2LHBsPSdMTGkkJyt0djtpZighcClyZXR1cm4gTnVtYmVyLk5hTjtpZighY1tjaV18fGMuTExpIT1MTGkpe2Zvcih2YXIgbj1wLmZpcnN0Q2hpbGQsaT0wO247bj1uLm5leHRTaWJsaW5nKXtpZihuW3RwXT09dHYpe25bY2ldPSsraTtuLkxMaT1MTGk7fX1cbiAgcFtwbF09aTt9XG4gIHJldHVybiByPzErcFtwbF0tY1tjaV06Y1tjaV07fTtpZihtZSl7ZnVuY3Rpb24gZm4oZSl7d2l0aChlLnRhcmdldCl7aWYobm9kZVR5cGUhPT0yKVxuICBvd25lckRvY3VtZW50LkxMaT0rK1NlbGVjdG9yLmd1aWQ7fX1cbiAgZC5hZGRFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLGZuLGZhbHNlKTtkLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVSZW1vdmVkJyxmbixmYWxzZSk7fVxuICBpZihpZSl7dmFyIGFtPXthY2NlcHRjaGFyc2V0OidhY2NlcHRDaGFyc2V0JyxhY2Nlc3NrZXk6J2FjY2Vzc0tleScsY2VsbHBhZGRpbmc6J2NlbGxQYWRkaW5nJyxjZWxsc3BhY2luZzonY2VsbFNwYWNpbmcnLGNoZWNrZWQ6J2RlZmF1bHRDaGVja2VkJyxzZWxlY3RlZDonZGVmYXVsdFNlbGVjdGVkJywnY2xhc3MnOidjbGFzc05hbWUnLGNvbHNwYW46J2NvbFNwYW4nLCdmb3InOidodG1sRm9yJyxmcmFtZWJvcmRlcjonZnJhbWVCb3JkZXInLGhzcGFjZTonaFNwYWNlJyxsb25nZGVzYzonbG9uZ0Rlc2MnLG1hcmdpbndpZHRoOidtYXJnaW5XaWR0aCcsbWFyZ2luaGVpZ2h0OidtYXJnaW5IZWlnaHQnLG5vcmVzaXplOidub1Jlc2l6ZScsbm9zaGFkZTonbm9TaGFkZScsbWF4bGVuZ3RoOidtYXhMZW5ndGgnLHJlYWRvbmx5OidyZWFkT25seScscm93c3Bhbjoncm93U3BhbicsdGFiaW5kZXg6J3RhYkluZGV4Jyx1c2VtYXA6J3VzZU1hcCcsdmFsaWduOid2QWxpZ24nLHZzcGFjZTondlNwYWNlJ30sYWI9e2NvbXBhY3Q6MSxub3dyYXA6MSxpc21hcDoxLGRlY2xhcmU6MSxub3NoYWRlOjEsY2hlY2tlZDoxLGRpc2FibGVkOjEscmVhZG9ubHk6MSxtdWx0aXBsZToxLHNlbGVjdGVkOjEsbm9yZXNpemU6MSxkZWZlcjoxfTt9XG4gIGZ1bmN0aW9uIGNvbXBpbGUocXApe3RoaXMuZHVwPXRoaXMuc3J0PXRoaXMuaWR4PXRoaXMuaT10aGlzLm5xcD0wO3dpdGgodGhpcyl7dmFyIGpzPScnO2Rve2k9bnFwPTA7anMrPSQoJ249YzskMXE6ZG97JDJ9d2hpbGUoZmFsc2UpOycsc3J0PydzPTA7JzonJyx0eXBlKHFwLCQoc3J0Pydmb3IoeD1yLmxlbmd0aDtzPHg7ej1zKygoeC1zKS8yKXwwLCgkMSk/cz16KzE6eD16KTtpZihzPHIubGVuZ3RoKXIuc3BsaWNlKHMrKywwLCQyKTtlbHNlIHJbcysrXT0kMjsnOidyW3MrK109JDI7JyxjZHA/J3Jbel0uY29tcGFyZURvY3VtZW50UG9zaXRpb24obikmNCc6J2hbclt6XS5MTG5dPGhbbi5MTG5dJywncGU/cGUuY2FsbCh0aGlzLG4pOm4nKSwwLCcqJykpO313aGlsZShxcD1ucXApO2pzPSQoJ3ZhciByPVtdLHM9MCxuLHgseSx6LGQ9Yz9jLm93bmVyRG9jdW1lbnR8fGMuZG9jdW1lbnR8fGM6Yz1kb2N1bWVudCxwZT10aGlzLnBhdGNoRWxlbWVudCxwYT10aGlzLnBhdGNoQXJyYXkkMSQyOyQzcmV0dXJuIHBhP3BhLmNhbGwodGhpcyxyKTpyOycsZHVwPjA/JyxoPXt9JzonJyxpZHg/bWU/JyxMTGk9ZC5MTGl8fChkLkxMaT0rK1NlbGVjdG9yLmd1aWQpJzonLExMaT0rK1NlbGVjdG9yLmd1aWQnOicnLGpzKTtyZXR1cm4gbmV3IEZ1bmN0aW9uKCdjJyxqcyk7fX1cbiAgY29tcGlsZS5wcm90b3R5cGU9e3R5cGU6ZnVuY3Rpb24ocXAsanMsbixzLGMpe3dpdGgodGhpcyl7dmFyIG09L15cXHMqKFtcXHctXSt8XFwqKT8oLiopLy5leGVjKHFwKSx0PW1bMV18fCcqJztpZighbiYmYz09JyAnJiYhZHVwKWR1cD0xO2pzPXByZWQobVsyXSxqcyxuLHQsYyk7c3dpdGNoKGMpe2Nhc2UnPic6cmV0dXJuIGNubHQmJnQhPScqJz8kKCdmb3IodmFyIG4kMT1uLmNoaWxkcmVuLnRhZ3MoXCIkMlwiKSxpJDE9MDtuPW4kMVtpJDErK107KXskM30nLCsraSx0LGpzKTokKGNubD8nZm9yKHZhciBuJDE9bi5jaGlsZHJlbixpJDE9MDtuPW4kMVtpJDErK107KSQyeyQzfSc6J2ZvcihuPW4uZmlyc3RDaGlsZDtuO249bi5uZXh0U2libGluZykkMnskM30nLCsraSx0IT0nKic/J2lmKG4ubm9kZU5hbWU9PT1cIicrdC50b1VwcGVyQ2FzZSgpKydcIiknOiFjbmx8fGllPydpZihuLm5vZGVUeXBlPT09MSknOicnLGpzKTtjYXNlJysnOnJldHVybiAkKCd3aGlsZShuPW4ubmV4dFNpYmxpbmcpaWYobi5ub2RlJDEpeyQyYnJlYWt9ZWxzZSBpZihuLm5vZGVUeXBlPT09MSlicmVhazsnLHQ9PScqJz8nVHlwZT09PTEnOidOYW1lPT09XCInK3QudG9VcHBlckNhc2UoKSsnXCInLGpzKTtjYXNlJ34nOnJldHVybiAkKCd3aGlsZShuPW4ubmV4dFNpYmxpbmcpaWYobi5ub2RlJDEpeyQzfWVsc2UgaWYobi5ub2RlJDIpYnJlYWs7Jyx0PT0nKic/J1R5cGU9PT0xJzonTmFtZT09PVwiJyt0LnRvVXBwZXJDYXNlKCkrJ1wiJyxzPT0nKic/J1R5cGU9PT0xJzonTmFtZT09PVwiJytzLnRvVXBwZXJDYXNlKCkrJ1wiJyxqcyk7ZGVmYXVsdDpyZXR1cm4odHlwZW9mIGpzPT0nb2JqZWN0Jyk/U3RyaW5nKGpzKTpuP3Q9PScqJz9qczokKCdpZihuLm5vZGVOYW1lIT1cIiQxXCIpeyQyfScsdC50b1VwcGVyQ2FzZSgpLGpzKTokKCdmb3IodmFyIG4kMT1uLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiJDJcIiksaSQxPTA7bj1uJDFbaSQxKytdOykkM3skNH0nLCsraSx0LGllJiZ0PT0nKic/J2lmKG4ubm9kZVR5cGU9PT0xKSc6JycsanMpO319fSxwcmVkOmZ1bmN0aW9uKHFwLGpzLG4sdCxjKXt3aXRoKHRoaXMpe3ZhciBtPS9eKFsjXFwuXSkoW1xcdy1dKykoLiopLy5leGVjKHFwKXx8L14oXFxbKVxccyooW1xcdy1dKylcXHMqKD86KFt+fF4kKl0/PSlcXHMqKD86KFsnXCJdKSguKj8pXFw0fChbXFx3LV0rKSkpP1xccypcXF0oLiopLy5leGVjKHFwKXx8L146KGZpcnN0fGxhc3R8b25seSktKD86KGNoaWxkKXxvZi10eXBlKSguKikvLmV4ZWMocXApfHwvXjoobnRoKS0oPzoobGFzdCktKT8oPzooY2hpbGQpfG9mLXR5cGUpXFwoXFxzKig/OihvZGR8ZXZlbil8KC18XFxkKiluKFsrLV1cXGQrKT98KFsxLTldXFxkKikpXFxzKlxcKSguKikvLmV4ZWMocXApfHwvXjooYWN0aXZlfGNoZWNrZWR8KD86ZGlzfGVuKWFibGVkfGVtcHR5fGZvY3VzfGxpbmt8cm9vdHx0YXJnZXQpKC4qKS8uZXhlYyhxcCl8fC9eOihsYW5nKVxcKFxccyooWydcIl0pPyguKj8pXFwyXFxzKlxcKSguKikvLmV4ZWMocXApfHwoIW4mJi9eOihub3QpXFwoXFxzKiguKilcXHMqXFwpKC4qKS8uZXhlYyhxcCkpLHg9MDtpZighbSl7aWYobT0vXlxccyooWys+fixcXHNdKVxccyooXFxTLiopLy5leGVjKHFwKSl7aWYobVsxXSE9JywnKXJldHVybiB0eXBlKG1bMl0sanMsbix0LG1bMV0pO25xcD1tWzJdO2R1cD0yO31cbiAgZWxzZSBpZigvXFxTLy50ZXN0KHFwKSl0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgcXVlcnkgbmVhcjogJytxcCk7cmV0dXJuIGR1cDwxP2pzOiQoJ2lmKCFoW3g9bi5MTG58fChuLkxMbj0rK1NlbGVjdG9yLmd1aWQpXSl7aFt4XT0kMTskMn0nLCFzcnR8fGNkcD8ndHJ1ZSc6c2k/J24uc291cmNlSW5kZXgnOidTZWxlY3Rvci5zcmNJbmRleChoLG4pJyxqcyk7fVxuICBpZighbiYmbVsxXT09JyMnJiZkdXAhPTIpZHVwPS0xO2pzPXByZWQobVttLmxlbmd0aC0xXSxqcyxuLHQsMSk7c3dpdGNoKG1bMV0pe2Nhc2UnIyc6cmV0dXJuIHVuaXEoanMsbix0LGMsaWUsJ24uaWQnLCdcIicrbVsyXSsnXCInLCdkLmdldEVsZW1lbnRCeUlkKFwiJyttWzJdKydcIiknKTtjYXNlJy4nOnJldHVybiBiY24mJiFuJiYoIWN8fGM9PScgJykmJih0PT0nKid8fCFteik/T2JqZWN0KCQoJ2Zvcih2YXIgbiQxPW4uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIiQyXCIpLGkkMT0wO249biQxW2kkMSsrXTspJDN7JDR9JywrK2ksbVsyXSx0PT0nKic/Jyc6J2lmKG4ubm9kZU5hbWU9PT1cIicrdC50b1VwcGVyQ2FzZSgpKydcIiknLGpzKSk6JChjbXBbJ349J10sbj8nISc6JycsJ24uY2xhc3NOYW1lJyx4PW1bMl0seC5sZW5ndGgsanMpO2Nhc2UnWyc6cmV0dXJuKHg9bVszXSk/JChjbXBbeF0sbj8nISc6JycsaWU/KHg9bVsyXS50b0xvd2VyQ2FzZSgpKT09J3N0eWxlJz8nc3R5bGUuY3NzVGV4dC50b0xvd2VyQ2FzZSgpJzphYlt4XT8nbi4nK3grJyYmXCInK3grJ1wiJzonbi5nZXRBdHRyaWJ1dGUoXCInKyhhbVt4XXx8eCkrJ1wiLDIpJzonbi5nZXRBdHRyaWJ1dGUoXCInK21bMl0rJ1wiKScseD1tWzVdfHxtWzZdLHgubGVuZ3RoLGpzKTokKGllPydpZigkMSgoeD1uLmdldEF0dHJpYnV0ZU5vZGUoXCIkMlwiKSkmJnguc3BlY2lmaWVkKSl7JDN9JzonaWYoJDFuLmhhc0F0dHJpYnV0ZShcIiQyXCIpKXskM30nLG4/JyEnOicnLG1bMl0sanMpO2Nhc2UnYWN0aXZlJzpjYXNlJ2ZvY3VzJzpyZXR1cm4gdW5pcShqcyxuLHQsYywwLCduJywnZC5hY3RpdmVFbGVtZW50Jyk7Y2FzZSdjaGVja2VkJzpyZXR1cm4gJCgnaWYoJDEobi5jaGVja2VkfHxuLnNlbGVjdGVkKSl7JDJ9JyxuPychJzonJyxqcyk7Y2FzZSdkaXNhYmxlZCc6eD0xO2Nhc2UnZW5hYmxlZCc6cmV0dXJuICQoJ2lmKG4uZGlzYWJsZWQ9PT0kMSQyKXskM30nLCEhKHhebiksaWU/JyYmKCh4PW4ubm9kZU5hbWUpPT09XCJCVVRUT05cInx8eD09PVwiSU5QVVRcInx8eD09PVwiT1BUSU9OXCJ8fHg9PT1cIk9QVEdST1VQXCJ8fHg9PT1cIlNFTEVDVFwifHx4PT09XCJURVhUQVJFQVwiJzonJyxqcyk7Y2FzZSdlbXB0eSc6cmV0dXJuICQoJ2Zvcih4PW4uZmlyc3RDaGlsZDt4JiZ4Lm5vZGVUeXBlPjM7eD14Lm5leHRTaWJsaW5nKTtpZigkMXgpeyQyfScsbj8nJzonIScsanMpO2Nhc2UnZmlyc3QnOnJldHVybiBmbG8oanMsbixtWzJdLCdwcmV2aW91cycpO2Nhc2UnbGFuZyc6cmV0dXJuICQoY21wWyd8PSddLG4/JyEnOicnLCduLmxhbmcnLHg9bVszXSx4Lmxlbmd0aCxqcyk7Y2FzZSdsYXN0JzpyZXR1cm4gZmxvKGpzLG4sbVsyXSwnbmV4dCcpO2Nhc2UnbGluayc6cmV0dXJuICQoJ2lmKCQxKG4ubm9kZU5hbWU9PT1cIkFcIiYmbi5ocmVmKSl7JDJ9JyxuPychJzonJyxqcyk7Y2FzZSdudGgnOnZhciBhPW1bNF0/MjptWzVdPT0nLSc/LTE6bVs3XT8wOm1bNV0/bVs1XS0wOjEsYj1tWzRdPT0nb2RkJz8xOihtWzZdfHxtWzddKS0wfHwwO2lmKGE9PTEpcmV0dXJuIGpzO2lmKGE9PTAmJmI9PTEpcmV0dXJuIGZsbyhqcyxuLG1bM10sbVsyXT8nbmV4dCc6J3ByZXZpb3VzJyk7aWYoYT09YiliPTA7aWYoYjwwKWI9YStiO2lkeD0xO3JldHVybiAkKCdpZigkMShTZWxlY3Rvci5udGhJbmRleChMTGksbiwkMixcIm5vZGUkM1wiLCQ0KSQ1KSl7JDZ9JyxuPychJzonJywhIW1bMl0sbVszXT8nVHlwZSc6J05hbWUnLG1bM10/JzEnOiduLm5vZGVOYW1lJyxhPDA/Jzw9JytiOmE/JyUnK2ErJz09PScrYjonPT09JytiLGpzKTtjYXNlJ25vdCc6cmV0dXJuIHR5cGUobVsyXSxqcywxLCcqJyk7Y2FzZSdvbmx5JzpyZXR1cm4gZmxvKGpzLG4sbVsyXSk7Y2FzZSdyb290JzpyZXR1cm4gdW5pcShqcyxuLHQsYywwLCduJywnZC5kb2N1bWVudEVsZW1lbnQnKTtjYXNlJ3RhcmdldCc6eD0nKGQuZGVmYXVsdFZpZXd8fGQucGFyZW50V2luZG93fHx3aW5kb3cpLmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpJztyZXR1cm4gdW5pcShqcyxuLHQsYyxpZSwnbi5pZCcseCwnZC5nZXRFbGVtZW50QnlJZCgnK3grJyknKTt9fX0sdW5pcTpmdW5jdGlvbihqcyxuLHQsYyxkLHAsdix3KXtyZXR1cm4obnx8KGMmJmMhPScgJyl8fGQpPyQobj8naWYoJDEhPT0kMil7JDN9JzonaWYoJDE9PT0kMil7JDNicmVhayBxfScscCx2LGpzKTpPYmplY3QoJChlYz8naWYoKHg9JDEpPT09bnx8IW4uY29udGFpbnN8fG4uY29udGFpbnMoeCkpJDInOmNkcD8naWYoKHg9JDEpPT09bnx8IW4uY29tcGFyZURvY3VtZW50UG9zaXRpb258fG4uY29tcGFyZURvY3VtZW50UG9zaXRpb24oeCkmMTYpJDInOidmb3IoeD15PSQxO3k7eT15LnBhcmVudE5vZGUpaWYoeT09PW4pJDInLHd8fHYsdD09JyonPyd7bj14OycranMrJ2JyZWFrIHF9Jzone2lmKChuPXgpLm5vZGVOYW1lPT09XCInK3QudG9VcHBlckNhc2UoKSsnXCIpeycranMrJ31icmVhayBxfScpKTt9LGZsbzpmdW5jdGlvbihqcyxuLHQscyl7cmV0dXJuICQocz8nZm9yKCQyeD1uLiQxU2libGluZzt4JiZ4Lm5vZGUkMzt4PXguJDFTaWJsaW5nKTtpZigkNHgpeyQ1fSc6J2ZvcigkMih4PW4ucGFyZW50Tm9kZSkmJih4PXguZmlyc3RDaGlsZCk7eCYmKHgubm9kZSQzfHx4PT09bik7eD14Lm5leHRTaWJsaW5nKTtpZigkNHgpeyQ1fScscyx0PycnOid5PW4ubm9kZU5hbWUsJyx0PydUeXBlIT09MSc6J05hbWUhPT15JyxuPycnOichJyxqcyk7fX07fVxufVxuIl19