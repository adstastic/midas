/* Riot v2.0.13, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function () {

  var riot = { version: 'v2.0.13', settings: {} };

  'use strict';

  riot.observable = function (el) {

    el = el || {};

    var callbacks = {},
        _id = 0;

    el.on = function (events, fn) {
      if (typeof fn == 'function') {
        fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id;

        events.replace(/\S+/g, function (name, pos) {
          (callbacks[name] = callbacks[name] || []).push(fn);
          fn.typed = pos > 0;
        });
      }
      return el;
    };

    el.off = function (events, fn) {
      if (events == '*') callbacks = {};else {
        events.replace(/\S+/g, function (name) {
          if (fn) {
            var arr = callbacks[name];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb._id == fn._id) {
                arr.splice(i, 1);i--;
              }
            }
          } else {
            callbacks[name] = [];
          }
        });
      }
      return el;
    };

    // only single event supported
    el.one = function (name, fn) {
      if (fn) fn.one = 1;
      return el.on(name, fn);
    };

    el.trigger = function (name) {
      var args = [].slice.call(arguments, 1),
          fns = callbacks[name] || [];

      for (var i = 0, fn; fn = fns[i]; ++i) {
        if (!fn.busy) {
          fn.busy = 1;
          fn.apply(el, fn.typed ? [name].concat(args) : args);
          if (fn.one) {
            fns.splice(i, 1);i--;
          } else if (fns[i] !== fn) {
            i--;
          } // Makes self-removal possible during iteration
          fn.busy = 0;
        }
      }

      if (callbacks.all && name != 'all') {
        el.trigger.apply(el, ['all', name].concat(args));
      }

      return el;
    };

    return el;
  };(function (riot, evt) {

    // browsers only
    if (!this.top) return;

    var loc = location,
        fns = riot.observable(),
        win = window,
        current;

    function hash() {
      return loc.href.split('#')[1] || '';
    }

    function parser(path) {
      return path.split('/');
    }

    function emit(path) {
      if (path.type) path = hash();

      if (path != current) {
        fns.trigger.apply(null, ['H'].concat(parser(path)));
        current = path;
      }
    }

    var r = riot.route = function (arg) {
      // string
      if (arg[0]) {
        loc.hash = arg;
        emit(arg);
      } else {
        fns.on('H', arg);
      }
    };

    r.exec = function (fn) {
      fn.apply(null, parser(hash()));
    };

    r.parser = function (fn) {
      parser = fn;
    };

    win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit);
  })(riot, 'hashchange');
  /*
  
  //// How it works?
  
  
  Three ways:
  
  1. Expressions: tmpl('{ value }', data).
     Returns the result of evaluated expression as a raw object.
  
  2. Templates: tmpl('Hi { name } { surname }', data).
     Returns a string with evaluated expressions.
  
  3. Filters: tmpl('{ show: !done, highlight: active }', data).
     Returns a space separated list of trueish keys (mainly
     used for setting html classes), e.g. "show highlight".
  
  
  // Template examples
  
  tmpl('{ title || "Untitled" }', data)
  tmpl('Results are { results ? "ready" : "loading" }', data)
  tmpl('Today is { new Date() }', data)
  tmpl('{ message.length > 140 && "Message is too long" }', data)
  tmpl('This item got { Math.round(rating) } stars', data)
  tmpl('<h1>{ title }</h1>{ body }', data)
  
  
  // Falsy expressions in templates
  
  In templates (as opposed to single expressions) all falsy values
  except zero (undefined/null/false) will default to empty string:
  
  tmpl('{ undefined } - { false } - { null } - { 0 }', {})
  // will return: " - - - 0"
  
  */

  var brackets = (function (orig, s, b) {
    return function (x) {

      // make sure we use the current setting
      s = riot.settings.brackets || orig;
      if (b != s) b = s.split(' ');

      // if regexp given, rewrite it with current brackets (only if differ from default)
      return x && x.test ? s == orig ? x : RegExp(x.source.replace(/\{/g, b[0].replace(/(?=.)/g, '\\')).replace(/\}/g, b[1].replace(/(?=.)/g, '\\')), x.global ? 'g' : '')

      // else, get specific bracket
      : b[x];
    };
  })('{ }');

  var tmpl = (function () {

    var cache = {},
        re_vars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi;
    // [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
    // find variable names:
    // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
    // 2. skip object properties: .name
    // 3. skip object literals: name:
    // 4. skip javascript keywords
    // 5. match var name

    // build a template (or get it from cache), render with data
    return function (str, data) {
      return str && (cache[str] = cache[str] || tmpl(str))(data);
    };

    // create a template instance

    function tmpl(s, p) {

      // default template string to {}
      s = (s || brackets(0) + brackets(1)).replace(brackets(/\\{/g), '￰').replace(brackets(/\\}/g), '￱');

      // split string to expression and non-expresion parts
      p = split(s, extract(s, brackets(/{/), brackets(/}/)));

      return new Function('d', 'return ' + (

      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
      !p[0] && !p[2] && !p[3]

      // if expression, evaluate it
      ? expr(p[1])

      // if template, evaluate all expressions in it
      : '[' + p.map(function (s, i) {

        // is it an expression or a string (every second part is an expression)
        return i % 2

        // evaluate the expressions
        ? expr(s, true)

        // process string parts of the template:
        : '"' + s

        // preserve new lines
        .replace(/\n/g, '\\n')

        // escape quotes
        .replace(/"/g, '\\"') + '"';
      }).join(',') + '].join("")').replace(/\uFFF0/g, brackets(0)).replace(/\uFFF1/g, brackets(1)) + ';');
    }

    // parse { ... } expression

    function expr(s, n) {
      s = s

      // convert new lines to spaces
      .replace(/\n/g, ' ')

      // trim whitespace, brackets, strip comments
      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '');

      // is it an object literal? i.e. { key : value }
      return /^\s*[\w- "']+ *:/.test(s)

      // if object literal, return trueish keys
      // e.g.: { show: isOpen(), done: item.done } -> "show done"
      ? '[' +

      // extract key:val pairs, ignoring any nested objects
      extract(s,

      // name part: name:, "name":, 'name':, name :
      /["' ]*[\w- ]+["' ]*:/,

      // expression part: everything upto a comma followed by a name (see above) or end of line
      /,(?=["' ]*[\w- ]+["' ]*:)|}|$/).map(function (pair) {

        // get key, val parts
        return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function (_, k, v) {

          // wrap all conditional parts to ignore errors
          return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",';
        });
      }).join('') + '].join(" ").trim()'

      // if js expression, evaluate as javascript
      : wrap(s, n);
    }

    // execute js w/o breaking on errors or undefined vars

    function wrap(s, nonull) {
      s = s.trim();
      return !s ? '' : '(function(v){try{v='

      // prefix vars (name => data.name)
       + (s.replace(re_vars, function (s, _, v) {
        return v ? '(d.' + v + '===undefined?' + (typeof window == 'undefined' ? 'global.' : 'window.') + v + ':d.' + v + ')' : s;
      })

      // break the expression if its empty (resulting in undefined value)
       || 'x') + '}finally{return '

      // default to empty string for falsy values except zero
       + (nonull === true ? '!v&&v!==0?"":v' : 'v') + '}}).call(d)';
    }

    // split string by an array of substrings

    function split(str, substrings) {
      var parts = [];
      substrings.map(function (sub, i) {

        // push matched expression and part before it
        i = str.indexOf(sub);
        parts.push(str.slice(0, i), sub);
        str = str.slice(i + sub.length);
      });

      // push the remaining part
      return parts.concat(str);
    }

    // match strings between opening and closing regexp, skipping any inner/nested matches

    function extract(str, open, close) {

      var start,
          level = 0,
          matches = [],
          re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g');

      str.replace(re, function (_, open, close, pos) {

        // if outer inner bracket, mark position
        if (!level && open) start = pos;

        // in(de)crease bracket level
        level += open ? 1 : -1;

        // if outer closing bracket, grab the match
        if (!level && close != null) matches.push(str.slice(start, pos + close.length));
      });

      return matches;
    }
  })();

  // { key, i in items} -> { key, i, items }
  function loopKeys(expr) {
    var ret = { val: expr },
        els = expr.split(/\s+in\s+/);

    if (els[1]) {
      ret.val = brackets(0) + els[1];
      els = els[0].slice(brackets(0).length).trim().split(/,\s*/);
      ret.key = els[0];
      ret.pos = els[1];
    }

    return ret;
  }

  function mkitem(expr, key, val) {
    var item = {};
    item[expr.key] = key;
    if (expr.pos) item[expr.pos] = val;
    return item;
  }

  /* Beware: heavy stuff */
  function _each(dom, parent, expr) {

    remAttr(dom, 'each');

    var template = dom.outerHTML,
        prev = dom.previousSibling,
        root = dom.parentNode,
        rendered = [],
        tags = [],
        checksum;

    expr = loopKeys(expr);

    function add(pos, item, tag) {
      rendered.splice(pos, 0, item);
      tags.splice(pos, 0, tag);
    }

    // clean template code
    parent.one('update', function () {
      root.removeChild(dom);
    }).one('premount', function () {
      if (root.stub) root = parent.root;
    }).on('update', function () {

      var items = tmpl(expr.val, parent);
      if (!items) return;

      // object loop. any changes cause full redraw
      if (!Array.isArray(items)) {
        var testsum = JSON.stringify(items);
        if (testsum == checksum) return;
        checksum = testsum;

        // clear old items
        each(tags, function (tag) {
          tag.unmount();
        });
        rendered = [];
        tags = [];

        items = Object.keys(items).map(function (key) {
          return mkitem(expr, key, items[key]);
        });
      }

      // unmount redundant
      each(rendered, function (item) {
        if (item instanceof Object) {
          // skip existing items
          if (items.indexOf(item) > -1) {
            return;
          }
        } else {
          // find all non-objects
          var newItems = arrFindEquals(items, item),
              oldItems = arrFindEquals(rendered, item);

          // if more or equal amount, no need to remove
          if (newItems.length >= oldItems.length) {
            return;
          }
        }
        var pos = rendered.indexOf(item),
            tag = tags[pos];

        if (tag) {
          tag.unmount();
          rendered.splice(pos, 1);
          tags.splice(pos, 1);
        }
      });

      // mount new / reorder
      var nodes = [].slice.call(root.childNodes),
          prev_index = nodes.indexOf(prev);

      each(items, function (item, i) {

        // start index search from position based on the current i
        var pos = items.indexOf(item, i),
            oldPos = rendered.indexOf(item, i);

        // if not found, search backwards from current i position
        pos < 0 && (pos = items.lastIndexOf(item, i));
        oldPos < 0 && (oldPos = rendered.lastIndexOf(item, i));

        if (!(item instanceof Object)) {
          // find all non-objects
          var newItems = arrFindEquals(items, item),
              oldItems = arrFindEquals(rendered, item);

          // if more, should mount one new
          if (newItems.length > oldItems.length) {
            oldPos = -1;
          }
        }

        // mount new
        if (oldPos < 0) {
          rendered.push(item);
          if (!checksum && expr.key) item = mkitem(expr, item, pos);

          var tag = new Tag({ tmpl: template }, {
            before: nodes[prev_index + 1 + pos],
            parent: parent,
            root: root,
            item: item
          });

          tag.mount();

          return add(pos, item, tag);
        }

        // change pos value
        if (expr.pos && tags[oldPos][expr.pos] != pos) {
          tags[oldPos].one('update', function (item) {
            item[expr.pos] = pos;
          });
          tags[oldPos].update();
        }

        // reorder
        if (pos != oldPos) {
          root.insertBefore(nodes[prev_index + oldPos + 1], nodes[prev_index + pos + 1]);
          return add(pos, rendered.splice(oldPos, 1)[0], tags.splice(oldPos, 1)[0]);
        }
      });

      rendered = items.slice();
    });
  }

  function parseNamedElements(root, parent, child_tags) {

    walk(root, function (dom) {
      if (dom.nodeType == 1) {

        // custom child tag
        var child = getTag(dom);

        if (child && !dom.getAttribute('each')) {
          var tag = new Tag(child, { root: dom, parent: parent });
          parent.tags[dom.getAttribute('name') || child.name] = tag;
          // empty the child node once we got its template
          // to avoid that its children get compiled multiple times
          dom.innerHTML = '';
          child_tags.push(tag);
        }

        each(dom.attributes, function (attr) {
          if (/^(name|id)$/.test(attr.name)) parent[attr.value] = dom;
        });
      }
    });
  }

  function parseExpressions(root, tag, expressions) {

    function addExpr(dom, val, extra) {
      if (val.indexOf(brackets(0)) >= 0) {
        var expr = { dom: dom, expr: val };
        expressions.push(extend(expr, extra));
      }
    }

    walk(root, function (dom) {
      var type = dom.nodeType;

      // text node
      if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue);
      if (type != 1) return;

      /* element */

      // loop
      var attr = dom.getAttribute('each');
      if (attr) {
        _each(dom, tag, attr);return false;
      }

      // attribute expressions
      each(dom.attributes, function (attr) {
        var name = attr.name,
            bool = name.split('__')[1];

        addExpr(dom, attr.value, { attr: bool || name, bool: bool });
        if (bool) {
          remAttr(dom, name);return false;
        }
      });

      // skip custom tags
      if (getTag(dom)) return false;
    });
  }

  function Tag(impl, conf) {

    var self = riot.observable(this),
        opts = inherit(conf.opts) || {},
        dom = mkdom(impl.tmpl),
        parent = conf.parent,
        expressions = [],
        child_tags = [],
        root = conf.root,
        item = conf.item,
        fn = impl.fn,
        attr = {},
        loop_dom;

    if (fn && root.riot) return;
    root.riot = true;

    extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item);

    // grab attributes
    each(root.attributes, function (el) {
      attr[el.name] = el.value;
    });

    // options
    function updateOpts(rem_attr) {
      each(Object.keys(attr), function (name) {
        opts[name] = tmpl(attr[name], parent || self);
      });
    }

    this.update = function (data, init) {
      extend(self, data, item);
      updateOpts();
      self.trigger('update', item);
      update(expressions, self, item);
      self.trigger('updated');
    };

    this.mount = function () {

      updateOpts();

      // initialiation
      fn && fn.call(self, opts);

      toggle(true);

      // parse layout after init. fn may calculate args for nested custom tags
      parseExpressions(dom, self, expressions);

      self.update();

      // internal use only, fixes #403
      self.trigger('premount');

      if (fn) {
        while (dom.firstChild) root.appendChild(dom.firstChild);
      } else {
        loop_dom = dom.firstChild;
        root.insertBefore(loop_dom, conf.before || null);
      }

      if (root.stub) self.root = root = parent.root;
      self.trigger('mount');
    };

    this.unmount = function () {
      var el = fn ? root : loop_dom,
          p = el.parentNode;

      if (p) {
        if (parent) p.removeChild(el);else while (root.firstChild) root.removeChild(root.firstChild);
        toggle();
        self.trigger('unmount');
        self.off('*');
        delete root.riot;
      }
    };

    function toggle(is_mount) {

      // mount/unmount children
      each(child_tags, function (child) {
        child[is_mount ? 'mount' : 'unmount']();
      });

      // listen/unlisten parent (events flow one way from parent to children)
      if (parent) {
        var evt = is_mount ? 'on' : 'off';
        parent[evt]('update', self.update)[evt]('unmount', self.unmount);
      }
    }

    // named elements available for fn
    parseNamedElements(dom, this, child_tags);
  }

  function setEventHandler(name, handler, dom, tag, item) {

    dom[name] = function (e) {

      // cross browser event fix
      e = e || window.event;
      e.which = e.which || e.charCode || e.keyCode;
      e.target = e.target || e.srcElement;
      e.currentTarget = dom;
      e.item = item;

      // prevent default behaviour (by default)
      if (handler.call(tag, e) !== true) {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
      }

      var el = item ? tag.parent : tag;
      el.update();
    };
  }

  // used by if- attribute
  function insertTo(root, node, before) {
    if (root) {
      root.insertBefore(before, node);
      root.removeChild(node);
    }
  }

  // item = currently looped item
  function update(expressions, tag, item) {

    each(expressions, function (expr) {

      var dom = expr.dom,
          attr_name = expr.attr,
          value = tmpl(expr.expr, tag),
          parent = expr.dom.parentNode;

      if (value == null) value = '';

      // leave out riot- prefixes from strings inside textarea
      if (parent && parent.tagName == 'TEXTAREA') value = value.replace(/riot-/g, '');

      // no change
      if (expr.value === value) return;
      expr.value = value;

      // text node
      if (!attr_name) return dom.nodeValue = value;

      // remove original attribute
      remAttr(dom, attr_name);

      // event handler
      if (typeof value == 'function') {
        setEventHandler(attr_name, value, dom, tag, item);
      } else if (attr_name == 'if') {
        var stub = expr.stub;

        // add to DOM
        if (value) {
          stub && insertTo(stub.parentNode, stub, dom)

          // remove from DOM
          ;
        } else {
          stub = expr.stub = stub || document.createTextNode('');
          insertTo(dom.parentNode, dom, stub);
        }

        // show / hide
      } else if (/^(show|hide)$/.test(attr_name)) {
        if (attr_name == 'hide') value = !value;
        dom.style.display = value ? '' : 'none'

        // field value
        ;
      } else if (attr_name == 'value') {
        dom.value = value

        // <img src="{ expr }">
        ;
      } else if (attr_name.slice(0, 5) == 'riot-') {
        attr_name = attr_name.slice(5);
        value ? dom.setAttribute(attr_name, value) : remAttr(dom, attr_name);
      } else {
        if (expr.bool) {
          dom[attr_name] = value;
          if (!value) return;
          value = attr_name;
        }

        if (typeof value != 'object') dom.setAttribute(attr_name, value);
      }
    });
  }
  function each(els, fn) {
    for (var i = 0, len = (els || []).length, el; i < len; i++) {
      el = els[i];
      // return false -> reomve current item during loop
      if (el != null && fn(el, i) === false) i--;
    }
    return els;
  }

  function remAttr(dom, name) {
    dom.removeAttribute(name);
  }

  // max 2 from objects allowed
  function extend(_x, _x2, _x3) {
    var _again = true;

    _function: while (_again) {
      var obj = _x,
          from = _x2,
          from2 = _x3;
      _again = false;

      from && each(Object.keys(from), function (key) {
        obj[key] = from[key];
      });
      if (from2) {
        _x = obj;
        _x2 = from2;
        _again = true;
        continue _function;
      } else {
        return obj;
      }
    }
  }

  function mkdom(template) {
    var tag_name = template.trim().slice(1, 3).toLowerCase(),
        root_tag = /td|th/.test(tag_name) ? 'tr' : tag_name == 'tr' ? 'tbody' : 'div',
        el = document.createElement(root_tag);

    el.stub = true;
    el.innerHTML = template;
    return el;
  }

  function walk(dom, fn) {
    if (dom) {
      if (fn(dom) === false) walk(dom.nextSibling, fn);else {
        dom = dom.firstChild;

        while (dom) {
          walk(dom, fn);
          dom = dom.nextSibling;
        }
      }
    }
  }

  function arrDiff(arr1, arr2) {
    return arr1.filter(function (el) {
      return arr2.indexOf(el) < 0;
    });
  }

  function arrFindEquals(arr, el) {
    return arr.filter(function (_el) {
      return _el === el;
    });
  }

  function inherit(parent) {
    function Child() {}
    Child.prototype = parent;
    return new Child();
  }

  /*
   Virtual dom is an array of custom tags on the document.
   Updates and unmounts propagate downwards from parent to children.
  */

  var virtual_dom = [],
      tag_impl = {};

  function getTag(dom) {
    return tag_impl[dom.tagName.toLowerCase()];
  }

  function injectStyle(css) {
    var node = document.createElement('style');
    node.innerHTML = css;
    document.head.appendChild(node);
  }

  function mountTo(root, tagName, opts) {
    var tag = tag_impl[tagName];

    if (tag && root) tag = new Tag(tag, { root: root, opts: opts });

    if (tag && tag.mount) {
      tag.mount();
      virtual_dom.push(tag);
      return tag.on('unmount', function () {
        virtual_dom.splice(virtual_dom.indexOf(tag), 1);
      });
    }
  }

  riot.tag = function (name, html, css, fn) {
    if (typeof css == 'function') fn = css;else if (css) injectStyle(css);
    tag_impl[name] = { name: name, tmpl: html, fn: fn };
  };

  riot.mount = function (selector, tagName, opts) {
    if (selector == '*') selector = Object.keys(tag_impl).join(', ');
    if (typeof tagName == 'object') {
      opts = tagName;tagName = 0;
    }

    var tags = [];

    function push(root) {
      var name = tagName || root.tagName.toLowerCase(),
          tag = mountTo(root, name, opts);

      if (tag) tags.push(tag);
    }

    // DOM node
    if (selector.tagName) {
      push(selector);
      return tags[0]

      // selector
      ;
    } else {
      each(document.querySelectorAll(selector), push);
      return tags;
    }
  };

  // update everything
  riot.update = function () {
    return each(virtual_dom, function (tag) {
      tag.update();
    });
  };

  // @deprecated
  riot.mountTo = riot.mount;

  // share methods for other riot parts, e.g. compiler
  riot.util = { brackets: brackets, tmpl: tmpl };

  // support CommonJS
  if (typeof exports === 'object') module.exports = riot

  // support AMD
  ;else if (typeof define === 'function' && define.amd) define(function () {
    return riot;
  });else this.riot = riot;
})();
// function

// temporarily convert \{ and \} to a non-character

// bring escaped { and } back
// null needed for IE8
// if- conditional

// support browser
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jYXRoL2hvbWVzMi96Y2FwYW11Ly5hdG9tL3BhY2thZ2VzL2Jyb3dzZXItcGx1cy9yZXNvdXJjZXMvcmlvdC1taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxDQUFDLENBQUMsWUFBVzs7QUFFWCxNQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFBOztBQUUvQyxjQUFZLENBQUE7O0FBRWQsTUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFTLEVBQUUsRUFBRTs7QUFFN0IsTUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUE7O0FBRWIsUUFBSSxTQUFTLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxDQUFDLENBQUE7O0FBRVgsTUFBRSxDQUFDLEVBQUUsR0FBRyxVQUFTLE1BQU0sRUFBRSxFQUFFLEVBQUU7QUFDM0IsVUFBSSxPQUFPLEVBQUUsSUFBSSxVQUFVLEVBQUU7QUFDM0IsVUFBRSxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksV0FBVyxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUE7O0FBRXRELGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUN6QyxXQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2xELFlBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtTQUNuQixDQUFDLENBQUE7T0FDSDtBQUNELGFBQU8sRUFBRSxDQUFBO0tBQ1YsQ0FBQTs7QUFFRCxNQUFFLENBQUMsR0FBRyxHQUFHLFVBQVMsTUFBTSxFQUFFLEVBQUUsRUFBRTtBQUM1QixVQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUUs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Y2F0aC9ob21lczIvemNhcGFtdS8uYXRvbS9wYWNrYWdlcy9icm93c2VyLXBsdXMvcmVzb3VyY2VzL3Jpb3QtbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogUmlvdCB2Mi4wLjEzLCBAbGljZW5zZSBNSVQsIChjKSAyMDE1IE11dXQgSW5jLiArIGNvbnRyaWJ1dG9ycyAqL1xuXG47KGZ1bmN0aW9uKCkge1xuXG4gIHZhciByaW90ID0geyB2ZXJzaW9uOiAndjIuMC4xMycsIHNldHRpbmdzOiB7fSB9XG5cbiAgJ3VzZSBzdHJpY3QnXG5cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICAgIF9pZCA9IDBcblxuICBlbC5vbiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAodHlwZW9mIGZuID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZuLl9pZCA9IHR5cGVvZiBmbi5faWQgPT0gJ3VuZGVmaW5lZCcgPyBfaWQrKyA6IGZuLl9pZFxuXG4gICAgICBldmVudHMucmVwbGFjZSgvXFxTKy9nLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcbiAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIGVsLm9mZiA9IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAoZXZlbnRzID09ICcqJykgY2FsbGJhY2tzID0ge31cbiAgICBlbHNlIHtcbiAgICAgIGV2ZW50cy5yZXBsYWNlKC9cXFMrL2csIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgKGNiID0gYXJyICYmIGFycltpXSk7ICsraSkge1xuICAgICAgICAgICAgaWYgKGNiLl9pZCA9PSBmbi5faWQpIHsgYXJyLnNwbGljZShpLCAxKTsgaS0tIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2tzW25hbWVdID0gW11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvLyBvbmx5IHNpbmdsZSBldmVudCBzdXBwb3J0ZWRcbiAgZWwub25lID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAoZm4pIGZuLm9uZSA9IDFcbiAgICByZXR1cm4gZWwub24obmFtZSwgZm4pXG4gIH1cblxuICBlbC50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICBmbnMgPSBjYWxsYmFja3NbbmFtZV0gfHwgW11cblxuICAgIGZvciAodmFyIGkgPSAwLCBmbjsgKGZuID0gZm5zW2ldKTsgKytpKSB7XG4gICAgICBpZiAoIWZuLmJ1c3kpIHtcbiAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXG4gICAgICAgIGlmIChmbi5vbmUpIHsgZm5zLnNwbGljZShpLCAxKTsgaS0tIH1cbiAgICAgICAgIGVsc2UgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH0gLy8gTWFrZXMgc2VsZi1yZW1vdmFsIHBvc3NpYmxlIGR1cmluZyBpdGVyYXRpb25cbiAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2tzLmFsbCAmJiBuYW1lICE9ICdhbGwnKSB7XG4gICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJ2FsbCcsIG5hbWVdLmNvbmNhdChhcmdzKSlcbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuXG4gIHJldHVybiBlbFxuXG59XG47KGZ1bmN0aW9uKHJpb3QsIGV2dCkge1xuXG4gIC8vIGJyb3dzZXJzIG9ubHlcbiAgaWYgKCF0aGlzLnRvcCkgcmV0dXJuXG5cbiAgdmFyIGxvYyA9IGxvY2F0aW9uLFxuICAgICAgZm5zID0gcmlvdC5vYnNlcnZhYmxlKCksXG4gICAgICB3aW4gPSB3aW5kb3csXG4gICAgICBjdXJyZW50XG5cbiAgZnVuY3Rpb24gaGFzaCgpIHtcbiAgICByZXR1cm4gbG9jLmhyZWYuc3BsaXQoJyMnKVsxXSB8fCAnJ1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VyKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpXG4gIH1cblxuICBmdW5jdGlvbiBlbWl0KHBhdGgpIHtcbiAgICBpZiAocGF0aC50eXBlKSBwYXRoID0gaGFzaCgpXG5cbiAgICBpZiAocGF0aCAhPSBjdXJyZW50KSB7XG4gICAgICBmbnMudHJpZ2dlci5hcHBseShudWxsLCBbJ0gnXS5jb25jYXQocGFyc2VyKHBhdGgpKSlcbiAgICAgIGN1cnJlbnQgPSBwYXRoXG4gICAgfVxuICB9XG5cbiAgdmFyIHIgPSByaW90LnJvdXRlID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgLy8gc3RyaW5nXG4gICAgaWYgKGFyZ1swXSkge1xuICAgICAgbG9jLmhhc2ggPSBhcmdcbiAgICAgIGVtaXQoYXJnKVxuXG4gICAgLy8gZnVuY3Rpb25cbiAgICB9IGVsc2Uge1xuICAgICAgZm5zLm9uKCdIJywgYXJnKVxuICAgIH1cbiAgfVxuXG4gIHIuZXhlYyA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgZm4uYXBwbHkobnVsbCwgcGFyc2VyKGhhc2goKSkpXG4gIH1cblxuICByLnBhcnNlciA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgcGFyc2VyID0gZm5cbiAgfVxuXG4gIHdpbi5hZGRFdmVudExpc3RlbmVyID8gd2luLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBlbWl0LCBmYWxzZSkgOiB3aW4uYXR0YWNoRXZlbnQoJ29uJyArIGV2dCwgZW1pdClcblxufSkocmlvdCwgJ2hhc2hjaGFuZ2UnKVxuLypcblxuLy8vLyBIb3cgaXQgd29ya3M/XG5cblxuVGhyZWUgd2F5czpcblxuMS4gRXhwcmVzc2lvbnM6IHRtcGwoJ3sgdmFsdWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyB0aGUgcmVzdWx0IG9mIGV2YWx1YXRlZCBleHByZXNzaW9uIGFzIGEgcmF3IG9iamVjdC5cblxuMi4gVGVtcGxhdGVzOiB0bXBsKCdIaSB7IG5hbWUgfSB7IHN1cm5hbWUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHN0cmluZyB3aXRoIGV2YWx1YXRlZCBleHByZXNzaW9ucy5cblxuMy4gRmlsdGVyczogdG1wbCgneyBzaG93OiAhZG9uZSwgaGlnaGxpZ2h0OiBhY3RpdmUgfScsIGRhdGEpLlxuICAgUmV0dXJucyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIHRydWVpc2gga2V5cyAobWFpbmx5XG4gICB1c2VkIGZvciBzZXR0aW5nIGh0bWwgY2xhc3NlcyksIGUuZy4gXCJzaG93IGhpZ2hsaWdodFwiLlxuXG5cbi8vIFRlbXBsYXRlIGV4YW1wbGVzXG5cbnRtcGwoJ3sgdGl0bGUgfHwgXCJVbnRpdGxlZFwiIH0nLCBkYXRhKVxudG1wbCgnUmVzdWx0cyBhcmUgeyByZXN1bHRzID8gXCJyZWFkeVwiIDogXCJsb2FkaW5nXCIgfScsIGRhdGEpXG50bXBsKCdUb2RheSBpcyB7IG5ldyBEYXRlKCkgfScsIGRhdGEpXG50bXBsKCd7IG1lc3NhZ2UubGVuZ3RoID4gMTQwICYmIFwiTWVzc2FnZSBpcyB0b28gbG9uZ1wiIH0nLCBkYXRhKVxudG1wbCgnVGhpcyBpdGVtIGdvdCB7IE1hdGgucm91bmQocmF0aW5nKSB9IHN0YXJzJywgZGF0YSlcbnRtcGwoJzxoMT57IHRpdGxlIH08L2gxPnsgYm9keSB9JywgZGF0YSlcblxuXG4vLyBGYWxzeSBleHByZXNzaW9ucyBpbiB0ZW1wbGF0ZXNcblxuSW4gdGVtcGxhdGVzIChhcyBvcHBvc2VkIHRvIHNpbmdsZSBleHByZXNzaW9ucykgYWxsIGZhbHN5IHZhbHVlc1xuZXhjZXB0IHplcm8gKHVuZGVmaW5lZC9udWxsL2ZhbHNlKSB3aWxsIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nOlxuXG50bXBsKCd7IHVuZGVmaW5lZCB9IC0geyBmYWxzZSB9IC0geyBudWxsIH0gLSB7IDAgfScsIHt9KVxuLy8gd2lsbCByZXR1cm46IFwiIC0gLSAtIDBcIlxuXG4qL1xuXG5cbnZhciBicmFja2V0cyA9IChmdW5jdGlvbihvcmlnLCBzLCBiKSB7XG4gIHJldHVybiBmdW5jdGlvbih4KSB7XG5cbiAgICAvLyBtYWtlIHN1cmUgd2UgdXNlIHRoZSBjdXJyZW50IHNldHRpbmdcbiAgICBzID0gcmlvdC5zZXR0aW5ncy5icmFja2V0cyB8fCBvcmlnXG4gICAgaWYgKGIgIT0gcykgYiA9IHMuc3BsaXQoJyAnKVxuXG4gICAgLy8gaWYgcmVnZXhwIGdpdmVuLCByZXdyaXRlIGl0IHdpdGggY3VycmVudCBicmFja2V0cyAob25seSBpZiBkaWZmZXIgZnJvbSBkZWZhdWx0KVxuICAgIHJldHVybiB4ICYmIHgudGVzdFxuICAgICAgPyBzID09IG9yaWdcbiAgICAgICAgPyB4IDogUmVnRXhwKHguc291cmNlXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcey9nLCBiWzBdLnJlcGxhY2UoLyg/PS4pL2csICdcXFxcJykpXG4gICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcfS9nLCBiWzFdLnJlcGxhY2UoLyg/PS4pL2csICdcXFxcJykpLFxuICAgICAgICAgICAgICAgICAgICB4Lmdsb2JhbCA/ICdnJyA6ICcnKVxuXG4gICAgICAvLyBlbHNlLCBnZXQgc3BlY2lmaWMgYnJhY2tldFxuICAgICAgOiBiW3hdXG5cbiAgfVxufSkoJ3sgfScpXG5cblxudmFyIHRtcGwgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGNhY2hlID0ge30sXG4gICAgICByZV92YXJzID0gLyhbJ1wiXFwvXSkuKj9bXlxcXFxdXFwxfFxcLlxcdyp8XFx3Kjp8XFxiKD86KD86bmV3fHR5cGVvZnxpbnxpbnN0YW5jZW9mKSB8KD86dGhpc3x0cnVlfGZhbHNlfG51bGx8dW5kZWZpbmVkKVxcYnxmdW5jdGlvbiAqXFwoKXwoW2Etel8kXVxcdyopL2dpXG4gICAgICAgICAgICAgIC8vIFsgMSAgICAgICAgICAgICAgIF1bIDIgIF1bIDMgXVsgNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdWyA1ICAgICAgIF1cbiAgICAgICAgICAgICAgLy8gZmluZCB2YXJpYWJsZSBuYW1lczpcbiAgICAgICAgICAgICAgLy8gMS4gc2tpcCBxdW90ZWQgc3RyaW5ncyBhbmQgcmVnZXhwczogXCJhIGJcIiwgJ2EgYicsICdhIFxcJ2JcXCcnLCAvYSBiL1xuICAgICAgICAgICAgICAvLyAyLiBza2lwIG9iamVjdCBwcm9wZXJ0aWVzOiAubmFtZVxuICAgICAgICAgICAgICAvLyAzLiBza2lwIG9iamVjdCBsaXRlcmFsczogbmFtZTpcbiAgICAgICAgICAgICAgLy8gNC4gc2tpcCBqYXZhc2NyaXB0IGtleXdvcmRzXG4gICAgICAgICAgICAgIC8vIDUuIG1hdGNoIHZhciBuYW1lXG5cbiAgLy8gYnVpbGQgYSB0ZW1wbGF0ZSAob3IgZ2V0IGl0IGZyb20gY2FjaGUpLCByZW5kZXIgd2l0aCBkYXRhXG4gIHJldHVybiBmdW5jdGlvbihzdHIsIGRhdGEpIHtcbiAgICByZXR1cm4gc3RyICYmIChjYWNoZVtzdHJdID0gY2FjaGVbc3RyXSB8fCB0bXBsKHN0cikpKGRhdGEpXG4gIH1cblxuXG4gIC8vIGNyZWF0ZSBhIHRlbXBsYXRlIGluc3RhbmNlXG5cbiAgZnVuY3Rpb24gdG1wbChzLCBwKSB7XG5cbiAgICAvLyBkZWZhdWx0IHRlbXBsYXRlIHN0cmluZyB0byB7fVxuICAgIHMgPSAocyB8fCAoYnJhY2tldHMoMCkgKyBicmFja2V0cygxKSkpXG5cbiAgICAgIC8vIHRlbXBvcmFyaWx5IGNvbnZlcnQgXFx7IGFuZCBcXH0gdG8gYSBub24tY2hhcmFjdGVyXG4gICAgICAucmVwbGFjZShicmFja2V0cygvXFxcXHsvZyksICdcXHVGRkYwJylcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9cXFxcfS9nKSwgJ1xcdUZGRjEnKVxuXG4gICAgLy8gc3BsaXQgc3RyaW5nIHRvIGV4cHJlc3Npb24gYW5kIG5vbi1leHByZXNpb24gcGFydHNcbiAgICBwID0gc3BsaXQocywgZXh0cmFjdChzLCBicmFja2V0cygvey8pLCBicmFja2V0cygvfS8pKSlcblxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ2QnLCAncmV0dXJuICcgKyAoXG5cbiAgICAgIC8vIGlzIGl0IGEgc2luZ2xlIGV4cHJlc3Npb24gb3IgYSB0ZW1wbGF0ZT8gaS5lLiB7eH0gb3IgPGI+e3h9PC9iPlxuICAgICAgIXBbMF0gJiYgIXBbMl0gJiYgIXBbM11cblxuICAgICAgICAvLyBpZiBleHByZXNzaW9uLCBldmFsdWF0ZSBpdFxuICAgICAgICA/IGV4cHIocFsxXSlcblxuICAgICAgICAvLyBpZiB0ZW1wbGF0ZSwgZXZhbHVhdGUgYWxsIGV4cHJlc3Npb25zIGluIGl0XG4gICAgICAgIDogJ1snICsgcC5tYXAoZnVuY3Rpb24ocywgaSkge1xuXG4gICAgICAgICAgICAvLyBpcyBpdCBhbiBleHByZXNzaW9uIG9yIGEgc3RyaW5nIChldmVyeSBzZWNvbmQgcGFydCBpcyBhbiBleHByZXNzaW9uKVxuICAgICAgICAgIHJldHVybiBpICUgMlxuXG4gICAgICAgICAgICAgIC8vIGV2YWx1YXRlIHRoZSBleHByZXNzaW9uc1xuICAgICAgICAgICAgICA/IGV4cHIocywgdHJ1ZSlcblxuICAgICAgICAgICAgICAvLyBwcm9jZXNzIHN0cmluZyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGU6XG4gICAgICAgICAgICAgIDogJ1wiJyArIHNcblxuICAgICAgICAgICAgICAgICAgLy8gcHJlc2VydmUgbmV3IGxpbmVzXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG5cbiAgICAgICAgICAgICAgICAgIC8vIGVzY2FwZSBxdW90ZXNcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcblxuICAgICAgICAgICAgICAgICsgJ1wiJ1xuXG4gICAgICAgIH0pLmpvaW4oJywnKSArICddLmpvaW4oXCJcIiknXG4gICAgICApXG5cbiAgICAgIC8vIGJyaW5nIGVzY2FwZWQgeyBhbmQgfSBiYWNrXG4gICAgICAucmVwbGFjZSgvXFx1RkZGMC9nLCBicmFja2V0cygwKSlcbiAgICAgIC5yZXBsYWNlKC9cXHVGRkYxL2csIGJyYWNrZXRzKDEpKVxuXG4gICAgKyAnOycpXG5cbiAgfVxuXG5cbiAgLy8gcGFyc2UgeyAuLi4gfSBleHByZXNzaW9uXG5cbiAgZnVuY3Rpb24gZXhwcihzLCBuKSB7XG4gICAgcyA9IHNcblxuICAgICAgLy8gY29udmVydCBuZXcgbGluZXMgdG8gc3BhY2VzXG4gICAgICAucmVwbGFjZSgvXFxuL2csICcgJylcblxuICAgICAgLy8gdHJpbSB3aGl0ZXNwYWNlLCBicmFja2V0cywgc3RyaXAgY29tbWVudHNcbiAgICAgIC5yZXBsYWNlKGJyYWNrZXRzKC9eW3sgXSt8WyB9XSskfFxcL1xcKi4rP1xcKlxcLy9nKSwgJycpXG5cbiAgICAvLyBpcyBpdCBhbiBvYmplY3QgbGl0ZXJhbD8gaS5lLiB7IGtleSA6IHZhbHVlIH1cbiAgICByZXR1cm4gL15cXHMqW1xcdy0gXCInXSsgKjovLnRlc3QocylcblxuICAgICAgLy8gaWYgb2JqZWN0IGxpdGVyYWwsIHJldHVybiB0cnVlaXNoIGtleXNcbiAgICAgIC8vIGUuZy46IHsgc2hvdzogaXNPcGVuKCksIGRvbmU6IGl0ZW0uZG9uZSB9IC0+IFwic2hvdyBkb25lXCJcbiAgICAgID8gJ1snICtcblxuICAgICAgICAgIC8vIGV4dHJhY3Qga2V5OnZhbCBwYWlycywgaWdub3JpbmcgYW55IG5lc3RlZCBvYmplY3RzXG4gICAgICAgICAgZXh0cmFjdChzLFxuXG4gICAgICAgICAgICAgIC8vIG5hbWUgcGFydDogbmFtZTosIFwibmFtZVwiOiwgJ25hbWUnOiwgbmFtZSA6XG4gICAgICAgICAgICAgIC9bXCInIF0qW1xcdy0gXStbXCInIF0qOi8sXG5cbiAgICAgICAgICAgICAgLy8gZXhwcmVzc2lvbiBwYXJ0OiBldmVyeXRoaW5nIHVwdG8gYSBjb21tYSBmb2xsb3dlZCBieSBhIG5hbWUgKHNlZSBhYm92ZSkgb3IgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgLywoPz1bXCInIF0qW1xcdy0gXStbXCInIF0qOil8fXwkL1xuICAgICAgICAgICAgICApLm1hcChmdW5jdGlvbihwYWlyKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQga2V5LCB2YWwgcGFydHNcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFpci5yZXBsYWNlKC9eWyBcIiddKiguKz8pWyBcIiddKjogKiguKz8pLD8gKiQvLCBmdW5jdGlvbihfLCBrLCB2KSB7XG5cbiAgICAgICAgICAgICAgICAgIC8vIHdyYXAgYWxsIGNvbmRpdGlvbmFsIHBhcnRzIHRvIGlnbm9yZSBlcnJvcnNcbiAgICAgICAgICAgICAgICAgIHJldHVybiB2LnJlcGxhY2UoL1teJnw9IT48XSsvZywgd3JhcCkgKyAnP1wiJyArIGsgKyAnXCI6XCJcIiwnXG5cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgIH0pLmpvaW4oJycpXG5cbiAgICAgICAgKyAnXS5qb2luKFwiIFwiKS50cmltKCknXG5cbiAgICAgIC8vIGlmIGpzIGV4cHJlc3Npb24sIGV2YWx1YXRlIGFzIGphdmFzY3JpcHRcbiAgICAgIDogd3JhcChzLCBuKVxuXG4gIH1cblxuXG4gIC8vIGV4ZWN1dGUganMgdy9vIGJyZWFraW5nIG9uIGVycm9ycyBvciB1bmRlZmluZWQgdmFyc1xuXG4gIGZ1bmN0aW9uIHdyYXAocywgbm9udWxsKSB7XG4gICAgcyA9IHMudHJpbSgpXG4gICAgcmV0dXJuICFzID8gJycgOiAnKGZ1bmN0aW9uKHYpe3RyeXt2PSdcblxuICAgICAgICAvLyBwcmVmaXggdmFycyAobmFtZSA9PiBkYXRhLm5hbWUpXG4gICAgICAgICsgKHMucmVwbGFjZShyZV92YXJzLCBmdW5jdGlvbihzLCBfLCB2KSB7IHJldHVybiB2ID8gJyhkLicrdisnPT09dW5kZWZpbmVkPycrKHR5cGVvZiB3aW5kb3cgPT0gJ3VuZGVmaW5lZCcgPyAnZ2xvYmFsLicgOiAnd2luZG93LicpK3YrJzpkLicrdisnKScgOiBzIH0pXG5cbiAgICAgICAgICAvLyBicmVhayB0aGUgZXhwcmVzc2lvbiBpZiBpdHMgZW1wdHkgKHJlc3VsdGluZyBpbiB1bmRlZmluZWQgdmFsdWUpXG4gICAgICAgICAgfHwgJ3gnKVxuXG4gICAgICArICd9ZmluYWxseXtyZXR1cm4gJ1xuXG4gICAgICAgIC8vIGRlZmF1bHQgdG8gZW1wdHkgc3RyaW5nIGZvciBmYWxzeSB2YWx1ZXMgZXhjZXB0IHplcm9cbiAgICAgICAgKyAobm9udWxsID09PSB0cnVlID8gJyF2JiZ2IT09MD9cIlwiOnYnIDogJ3YnKVxuXG4gICAgICArICd9fSkuY2FsbChkKSdcbiAgfVxuXG5cbiAgLy8gc3BsaXQgc3RyaW5nIGJ5IGFuIGFycmF5IG9mIHN1YnN0cmluZ3NcblxuICBmdW5jdGlvbiBzcGxpdChzdHIsIHN1YnN0cmluZ3MpIHtcbiAgICB2YXIgcGFydHMgPSBbXVxuICAgIHN1YnN0cmluZ3MubWFwKGZ1bmN0aW9uKHN1YiwgaSkge1xuXG4gICAgICAvLyBwdXNoIG1hdGNoZWQgZXhwcmVzc2lvbiBhbmQgcGFydCBiZWZvcmUgaXRcbiAgICAgIGkgPSBzdHIuaW5kZXhPZihzdWIpXG4gICAgICBwYXJ0cy5wdXNoKHN0ci5zbGljZSgwLCBpKSwgc3ViKVxuICAgICAgc3RyID0gc3RyLnNsaWNlKGkgKyBzdWIubGVuZ3RoKVxuICAgIH0pXG5cbiAgICAvLyBwdXNoIHRoZSByZW1haW5pbmcgcGFydFxuICAgIHJldHVybiBwYXJ0cy5jb25jYXQoc3RyKVxuICB9XG5cblxuICAvLyBtYXRjaCBzdHJpbmdzIGJldHdlZW4gb3BlbmluZyBhbmQgY2xvc2luZyByZWdleHAsIHNraXBwaW5nIGFueSBpbm5lci9uZXN0ZWQgbWF0Y2hlc1xuXG4gIGZ1bmN0aW9uIGV4dHJhY3Qoc3RyLCBvcGVuLCBjbG9zZSkge1xuXG4gICAgdmFyIHN0YXJ0LFxuICAgICAgICBsZXZlbCA9IDAsXG4gICAgICAgIG1hdGNoZXMgPSBbXSxcbiAgICAgICAgcmUgPSBuZXcgUmVnRXhwKCcoJytvcGVuLnNvdXJjZSsnKXwoJytjbG9zZS5zb3VyY2UrJyknLCAnZycpXG5cbiAgICBzdHIucmVwbGFjZShyZSwgZnVuY3Rpb24oXywgb3BlbiwgY2xvc2UsIHBvcykge1xuXG4gICAgICAvLyBpZiBvdXRlciBpbm5lciBicmFja2V0LCBtYXJrIHBvc2l0aW9uXG4gICAgICBpZighbGV2ZWwgJiYgb3Blbikgc3RhcnQgPSBwb3NcblxuICAgICAgLy8gaW4oZGUpY3JlYXNlIGJyYWNrZXQgbGV2ZWxcbiAgICAgIGxldmVsICs9IG9wZW4gPyAxIDogLTFcblxuICAgICAgLy8gaWYgb3V0ZXIgY2xvc2luZyBicmFja2V0LCBncmFiIHRoZSBtYXRjaFxuICAgICAgaWYoIWxldmVsICYmIGNsb3NlICE9IG51bGwpIG1hdGNoZXMucHVzaChzdHIuc2xpY2Uoc3RhcnQsIHBvcytjbG9zZS5sZW5ndGgpKVxuXG4gICAgfSlcblxuICAgIHJldHVybiBtYXRjaGVzXG4gIH1cblxufSkoKVxuXG4vLyB7IGtleSwgaSBpbiBpdGVtc30gLT4geyBrZXksIGksIGl0ZW1zIH1cbmZ1bmN0aW9uIGxvb3BLZXlzKGV4cHIpIHtcbiAgdmFyIHJldCA9IHsgdmFsOiBleHByIH0sXG4gICAgICBlbHMgPSBleHByLnNwbGl0KC9cXHMraW5cXHMrLylcblxuICBpZiAoZWxzWzFdKSB7XG4gICAgcmV0LnZhbCA9IGJyYWNrZXRzKDApICsgZWxzWzFdXG4gICAgZWxzID0gZWxzWzBdLnNsaWNlKGJyYWNrZXRzKDApLmxlbmd0aCkudHJpbSgpLnNwbGl0KC8sXFxzKi8pXG4gICAgcmV0LmtleSA9IGVsc1swXVxuICAgIHJldC5wb3MgPSBlbHNbMV1cbiAgfVxuXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gbWtpdGVtKGV4cHIsIGtleSwgdmFsKSB7XG4gIHZhciBpdGVtID0ge31cbiAgaXRlbVtleHByLmtleV0gPSBrZXlcbiAgaWYgKGV4cHIucG9zKSBpdGVtW2V4cHIucG9zXSA9IHZhbFxuICByZXR1cm4gaXRlbVxufVxuXG5cbi8qIEJld2FyZTogaGVhdnkgc3R1ZmYgKi9cbmZ1bmN0aW9uIF9lYWNoKGRvbSwgcGFyZW50LCBleHByKSB7XG5cbiAgcmVtQXR0cihkb20sICdlYWNoJylcblxuICB2YXIgdGVtcGxhdGUgPSBkb20ub3V0ZXJIVE1MLFxuICAgICAgcHJldiA9IGRvbS5wcmV2aW91c1NpYmxpbmcsXG4gICAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXG4gICAgICByZW5kZXJlZCA9IFtdLFxuICAgICAgdGFncyA9IFtdLFxuICAgICAgY2hlY2tzdW1cblxuICBleHByID0gbG9vcEtleXMoZXhwcilcblxuICBmdW5jdGlvbiBhZGQocG9zLCBpdGVtLCB0YWcpIHtcbiAgICByZW5kZXJlZC5zcGxpY2UocG9zLCAwLCBpdGVtKVxuICAgIHRhZ3Muc3BsaWNlKHBvcywgMCwgdGFnKVxuICB9XG5cbiAgLy8gY2xlYW4gdGVtcGxhdGUgY29kZVxuICBwYXJlbnQub25lKCd1cGRhdGUnLCBmdW5jdGlvbigpIHtcbiAgICByb290LnJlbW92ZUNoaWxkKGRvbSlcblxuICB9KS5vbmUoJ3ByZW1vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKHJvb3Quc3R1Yikgcm9vdCA9IHBhcmVudC5yb290XG5cbiAgfSkub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGl0ZW1zID0gdG1wbChleHByLnZhbCwgcGFyZW50KVxuICAgIGlmICghaXRlbXMpIHJldHVyblxuXG4gICAgLy8gb2JqZWN0IGxvb3AuIGFueSBjaGFuZ2VzIGNhdXNlIGZ1bGwgcmVkcmF3XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgdmFyIHRlc3RzdW0gPSBKU09OLnN0cmluZ2lmeShpdGVtcylcbiAgICAgIGlmICh0ZXN0c3VtID09IGNoZWNrc3VtKSByZXR1cm5cbiAgICAgIGNoZWNrc3VtID0gdGVzdHN1bVxuXG4gICAgICAvLyBjbGVhciBvbGQgaXRlbXNcbiAgICAgIGVhY2godGFncywgZnVuY3Rpb24odGFnKSB7IHRhZy51bm1vdW50KCkgfSlcbiAgICAgIHJlbmRlcmVkID0gW11cbiAgICAgIHRhZ3MgPSBbXVxuXG4gICAgICBpdGVtcyA9IE9iamVjdC5rZXlzKGl0ZW1zKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBta2l0ZW0oZXhwciwga2V5LCBpdGVtc1trZXldKVxuICAgICAgfSlcblxuICAgIH1cblxuICAgIC8vIHVubW91bnQgcmVkdW5kYW50XG4gICAgZWFjaChyZW5kZXJlZCwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgLy8gc2tpcCBleGlzdGluZyBpdGVtc1xuICAgICAgICBpZiAoaXRlbXMuaW5kZXhPZihpdGVtKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZpbmQgYWxsIG5vbi1vYmplY3RzXG4gICAgICAgIHZhciBuZXdJdGVtcyA9IGFyckZpbmRFcXVhbHMoaXRlbXMsIGl0ZW0pLFxuICAgICAgICAgICAgb2xkSXRlbXMgPSBhcnJGaW5kRXF1YWxzKHJlbmRlcmVkLCBpdGVtKVxuXG4gICAgICAgIC8vIGlmIG1vcmUgb3IgZXF1YWwgYW1vdW50LCBubyBuZWVkIHRvIHJlbW92ZVxuICAgICAgICBpZiAobmV3SXRlbXMubGVuZ3RoID49IG9sZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgcG9zID0gcmVuZGVyZWQuaW5kZXhPZihpdGVtKSxcbiAgICAgICAgICB0YWcgPSB0YWdzW3Bvc11cblxuICAgICAgaWYgKHRhZykge1xuICAgICAgICB0YWcudW5tb3VudCgpXG4gICAgICAgIHJlbmRlcmVkLnNwbGljZShwb3MsIDEpXG4gICAgICAgIHRhZ3Muc3BsaWNlKHBvcywgMSlcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICAvLyBtb3VudCBuZXcgLyByZW9yZGVyXG4gICAgdmFyIG5vZGVzID0gW10uc2xpY2UuY2FsbChyb290LmNoaWxkTm9kZXMpLFxuICAgICAgICBwcmV2X2luZGV4ID0gbm9kZXMuaW5kZXhPZihwcmV2KVxuXG4gICAgZWFjaChpdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuXG4gICAgICAvLyBzdGFydCBpbmRleCBzZWFyY2ggZnJvbSBwb3NpdGlvbiBiYXNlZCBvbiB0aGUgY3VycmVudCBpXG4gICAgICB2YXIgcG9zID0gaXRlbXMuaW5kZXhPZihpdGVtLCBpKSxcbiAgICAgICAgICBvbGRQb3MgPSByZW5kZXJlZC5pbmRleE9mKGl0ZW0sIGkpXG5cbiAgICAgIC8vIGlmIG5vdCBmb3VuZCwgc2VhcmNoIGJhY2t3YXJkcyBmcm9tIGN1cnJlbnQgaSBwb3NpdGlvblxuICAgICAgcG9zIDwgMCAmJiAocG9zID0gaXRlbXMubGFzdEluZGV4T2YoaXRlbSwgaSkpXG4gICAgICBvbGRQb3MgPCAwICYmIChvbGRQb3MgPSByZW5kZXJlZC5sYXN0SW5kZXhPZihpdGVtLCBpKSlcblxuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgLy8gZmluZCBhbGwgbm9uLW9iamVjdHNcbiAgICAgICAgdmFyIG5ld0l0ZW1zID0gYXJyRmluZEVxdWFscyhpdGVtcywgaXRlbSksXG4gICAgICAgICAgICBvbGRJdGVtcyA9IGFyckZpbmRFcXVhbHMocmVuZGVyZWQsIGl0ZW0pXG5cbiAgICAgICAgLy8gaWYgbW9yZSwgc2hvdWxkIG1vdW50IG9uZSBuZXdcbiAgICAgICAgaWYgKG5ld0l0ZW1zLmxlbmd0aCA+IG9sZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIG9sZFBvcyA9IC0xXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbW91bnQgbmV3XG4gICAgICBpZiAob2xkUG9zIDwgMCkge1xuICAgICAgICByZW5kZXJlZC5wdXNoKGl0ZW0pXG4gICAgICAgIGlmICghY2hlY2tzdW0gJiYgZXhwci5rZXkpIGl0ZW0gPSBta2l0ZW0oZXhwciwgaXRlbSwgcG9zKVxuXG4gICAgICAgIHZhciB0YWcgPSBuZXcgVGFnKHsgdG1wbDogdGVtcGxhdGUgfSwge1xuICAgICAgICAgIGJlZm9yZTogbm9kZXNbcHJldl9pbmRleCArIDEgKyBwb3NdLFxuICAgICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICAgIHJvb3Q6IHJvb3QsXG4gICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICB9KVxuXG4gICAgICAgIHRhZy5tb3VudCgpXG5cbiAgICAgICAgcmV0dXJuIGFkZChwb3MsIGl0ZW0sIHRhZylcbiAgICAgIH1cblxuICAgICAgLy8gY2hhbmdlIHBvcyB2YWx1ZVxuICAgICAgaWYgKGV4cHIucG9zICYmIHRhZ3Nbb2xkUG9zXVtleHByLnBvc10gIT0gcG9zKSB7XG4gICAgICAgIHRhZ3Nbb2xkUG9zXS5vbmUoJ3VwZGF0ZScsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICBpdGVtW2V4cHIucG9zXSA9IHBvc1xuICAgICAgICB9KVxuICAgICAgICB0YWdzW29sZFBvc10udXBkYXRlKClcbiAgICAgIH1cblxuICAgICAgLy8gcmVvcmRlclxuICAgICAgaWYgKHBvcyAhPSBvbGRQb3MpIHtcbiAgICAgICAgcm9vdC5pbnNlcnRCZWZvcmUobm9kZXNbcHJldl9pbmRleCArIG9sZFBvcyArIDFdLCBub2Rlc1twcmV2X2luZGV4ICsgcG9zICsgMV0pXG4gICAgICAgIHJldHVybiBhZGQocG9zLCByZW5kZXJlZC5zcGxpY2Uob2xkUG9zLCAxKVswXSwgdGFncy5zcGxpY2Uob2xkUG9zLCAxKVswXSlcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICByZW5kZXJlZCA9IGl0ZW1zLnNsaWNlKClcblxuICB9KVxuXG59XG5cblxuZnVuY3Rpb24gcGFyc2VOYW1lZEVsZW1lbnRzKHJvb3QsIHBhcmVudCwgY2hpbGRfdGFncykge1xuXG4gIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG4gICAgaWYgKGRvbS5ub2RlVHlwZSA9PSAxKSB7XG5cbiAgICAgIC8vIGN1c3RvbSBjaGlsZCB0YWdcbiAgICAgIHZhciBjaGlsZCA9IGdldFRhZyhkb20pXG5cbiAgICAgIGlmIChjaGlsZCAmJiAhZG9tLmdldEF0dHJpYnV0ZSgnZWFjaCcpKSB7XG4gICAgICAgIHZhciB0YWcgPSBuZXcgVGFnKGNoaWxkLCB7IHJvb3Q6IGRvbSwgcGFyZW50OiBwYXJlbnQgfSlcbiAgICAgICAgcGFyZW50LnRhZ3NbZG9tLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IGNoaWxkLm5hbWVdID0gdGFnXG4gICAgICAgIC8vIGVtcHR5IHRoZSBjaGlsZCBub2RlIG9uY2Ugd2UgZ290IGl0cyB0ZW1wbGF0ZVxuICAgICAgICAvLyB0byBhdm9pZCB0aGF0IGl0cyBjaGlsZHJlbiBnZXQgY29tcGlsZWQgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgZG9tLmlubmVySFRNTCA9ICcnXG4gICAgICAgIGNoaWxkX3RhZ3MucHVzaCh0YWcpXG4gICAgICB9XG5cbiAgICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgaWYgKC9eKG5hbWV8aWQpJC8udGVzdChhdHRyLm5hbWUpKSBwYXJlbnRbYXR0ci52YWx1ZV0gPSBkb21cbiAgICAgIH0pXG4gICAgfVxuXG4gIH0pXG5cbn1cblxuZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9ucyhyb290LCB0YWcsIGV4cHJlc3Npb25zKSB7XG5cbiAgZnVuY3Rpb24gYWRkRXhwcihkb20sIHZhbCwgZXh0cmEpIHtcbiAgICBpZiAodmFsLmluZGV4T2YoYnJhY2tldHMoMCkpID49IDApIHtcbiAgICAgIHZhciBleHByID0geyBkb206IGRvbSwgZXhwcjogdmFsIH1cbiAgICAgIGV4cHJlc3Npb25zLnB1c2goZXh0ZW5kKGV4cHIsIGV4dHJhKSlcbiAgICB9XG4gIH1cblxuICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xuICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlXG5cbiAgICAvLyB0ZXh0IG5vZGVcbiAgICBpZiAodHlwZSA9PSAzICYmIGRvbS5wYXJlbnROb2RlLnRhZ05hbWUgIT0gJ1NUWUxFJykgYWRkRXhwcihkb20sIGRvbS5ub2RlVmFsdWUpXG4gICAgaWYgKHR5cGUgIT0gMSkgcmV0dXJuXG5cbiAgICAvKiBlbGVtZW50ICovXG5cbiAgICAvLyBsb29wXG4gICAgdmFyIGF0dHIgPSBkb20uZ2V0QXR0cmlidXRlKCdlYWNoJylcbiAgICBpZiAoYXR0cikgeyBfZWFjaChkb20sIHRhZywgYXR0cik7IHJldHVybiBmYWxzZSB9XG5cbiAgICAvLyBhdHRyaWJ1dGUgZXhwcmVzc2lvbnNcbiAgICBlYWNoKGRvbS5hdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyKSB7XG4gICAgICB2YXIgbmFtZSA9IGF0dHIubmFtZSxcbiAgICAgICAgICBib29sID0gbmFtZS5zcGxpdCgnX18nKVsxXVxuXG4gICAgICBhZGRFeHByKGRvbSwgYXR0ci52YWx1ZSwgeyBhdHRyOiBib29sIHx8IG5hbWUsIGJvb2w6IGJvb2wgfSlcbiAgICAgIGlmIChib29sKSB7IHJlbUF0dHIoZG9tLCBuYW1lKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIH0pXG5cbiAgICAvLyBza2lwIGN1c3RvbSB0YWdzXG4gICAgaWYgKGdldFRhZyhkb20pKSByZXR1cm4gZmFsc2VcblxuICB9KVxuXG59XG5cbmZ1bmN0aW9uIFRhZyhpbXBsLCBjb25mKSB7XG5cbiAgdmFyIHNlbGYgPSByaW90Lm9ic2VydmFibGUodGhpcyksXG4gICAgICBvcHRzID0gaW5oZXJpdChjb25mLm9wdHMpIHx8IHt9LFxuICAgICAgZG9tID0gbWtkb20oaW1wbC50bXBsKSxcbiAgICAgIHBhcmVudCA9IGNvbmYucGFyZW50LFxuICAgICAgZXhwcmVzc2lvbnMgPSBbXSxcbiAgICAgIGNoaWxkX3RhZ3MgPSBbXSxcbiAgICAgIHJvb3QgPSBjb25mLnJvb3QsXG4gICAgICBpdGVtID0gY29uZi5pdGVtLFxuICAgICAgZm4gPSBpbXBsLmZuLFxuICAgICAgYXR0ciA9IHt9LFxuICAgICAgbG9vcF9kb21cblxuICBpZiAoZm4gJiYgcm9vdC5yaW90KSByZXR1cm5cbiAgcm9vdC5yaW90ID0gdHJ1ZVxuXG4gIGV4dGVuZCh0aGlzLCB7IHBhcmVudDogcGFyZW50LCByb290OiByb290LCBvcHRzOiBvcHRzLCB0YWdzOiB7fSB9LCBpdGVtKVxuXG4gIC8vIGdyYWIgYXR0cmlidXRlc1xuICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcbiAgICBhdHRyW2VsLm5hbWVdID0gZWwudmFsdWVcbiAgfSlcblxuICAvLyBvcHRpb25zXG4gIGZ1bmN0aW9uIHVwZGF0ZU9wdHMocmVtX2F0dHIpIHtcbiAgICBlYWNoKE9iamVjdC5rZXlzKGF0dHIpLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICBvcHRzW25hbWVdID0gdG1wbChhdHRyW25hbWVdLCBwYXJlbnQgfHwgc2VsZilcbiAgICB9KVxuICB9XG5cbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihkYXRhLCBpbml0KSB7XG4gICAgZXh0ZW5kKHNlbGYsIGRhdGEsIGl0ZW0pXG4gICAgdXBkYXRlT3B0cygpXG4gICAgc2VsZi50cmlnZ2VyKCd1cGRhdGUnLCBpdGVtKVxuICAgIHVwZGF0ZShleHByZXNzaW9ucywgc2VsZiwgaXRlbSlcbiAgICBzZWxmLnRyaWdnZXIoJ3VwZGF0ZWQnKVxuICB9XG5cbiAgdGhpcy5tb3VudCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdXBkYXRlT3B0cygpXG5cbiAgICAvLyBpbml0aWFsaWF0aW9uXG4gICAgZm4gJiYgZm4uY2FsbChzZWxmLCBvcHRzKVxuXG4gICAgdG9nZ2xlKHRydWUpXG5cbiAgICAvLyBwYXJzZSBsYXlvdXQgYWZ0ZXIgaW5pdC4gZm4gbWF5IGNhbGN1bGF0ZSBhcmdzIGZvciBuZXN0ZWQgY3VzdG9tIHRhZ3NcbiAgICBwYXJzZUV4cHJlc3Npb25zKGRvbSwgc2VsZiwgZXhwcmVzc2lvbnMpXG5cbiAgICBzZWxmLnVwZGF0ZSgpXG5cbiAgICAvLyBpbnRlcm5hbCB1c2Ugb25seSwgZml4ZXMgIzQwM1xuICAgIHNlbGYudHJpZ2dlcigncHJlbW91bnQnKVxuXG4gICAgaWYgKGZuKSB7XG4gICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIHJvb3QuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpXG5cbiAgICB9IGVsc2Uge1xuICAgICAgbG9vcF9kb20gPSBkb20uZmlyc3RDaGlsZFxuICAgICAgcm9vdC5pbnNlcnRCZWZvcmUobG9vcF9kb20sIGNvbmYuYmVmb3JlIHx8IG51bGwpIC8vIG51bGwgbmVlZGVkIGZvciBJRThcbiAgICB9XG5cbiAgICBpZiAocm9vdC5zdHViKSBzZWxmLnJvb3QgPSByb290ID0gcGFyZW50LnJvb3RcbiAgICBzZWxmLnRyaWdnZXIoJ21vdW50JylcblxuICB9XG5cblxuICB0aGlzLnVubW91bnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZWwgPSBmbiA/IHJvb3QgOiBsb29wX2RvbSxcbiAgICAgICAgcCA9IGVsLnBhcmVudE5vZGVcblxuICAgIGlmIChwKSB7XG4gICAgICBpZiAocGFyZW50KSBwLnJlbW92ZUNoaWxkKGVsKVxuICAgICAgZWxzZSB3aGlsZSAocm9vdC5maXJzdENoaWxkKSByb290LnJlbW92ZUNoaWxkKHJvb3QuZmlyc3RDaGlsZClcbiAgICAgIHRvZ2dsZSgpXG4gICAgICBzZWxmLnRyaWdnZXIoJ3VubW91bnQnKVxuICAgICAgc2VsZi5vZmYoJyonKVxuICAgICAgZGVsZXRlIHJvb3QucmlvdFxuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlKGlzX21vdW50KSB7XG5cbiAgICAvLyBtb3VudC91bm1vdW50IGNoaWxkcmVuXG4gICAgZWFjaChjaGlsZF90YWdzLCBmdW5jdGlvbihjaGlsZCkgeyBjaGlsZFtpc19tb3VudCA/ICdtb3VudCcgOiAndW5tb3VudCddKCkgfSlcblxuICAgIC8vIGxpc3Rlbi91bmxpc3RlbiBwYXJlbnQgKGV2ZW50cyBmbG93IG9uZSB3YXkgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4pXG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdmFyIGV2dCA9IGlzX21vdW50ID8gJ29uJyA6ICdvZmYnXG4gICAgICBwYXJlbnRbZXZ0XSgndXBkYXRlJywgc2VsZi51cGRhdGUpW2V2dF0oJ3VubW91bnQnLCBzZWxmLnVubW91bnQpXG4gICAgfVxuICB9XG5cbiAgLy8gbmFtZWQgZWxlbWVudHMgYXZhaWxhYmxlIGZvciBmblxuICBwYXJzZU5hbWVkRWxlbWVudHMoZG9tLCB0aGlzLCBjaGlsZF90YWdzKVxuXG5cbn1cblxuZnVuY3Rpb24gc2V0RXZlbnRIYW5kbGVyKG5hbWUsIGhhbmRsZXIsIGRvbSwgdGFnLCBpdGVtKSB7XG5cbiAgZG9tW25hbWVdID0gZnVuY3Rpb24oZSkge1xuXG4gICAgLy8gY3Jvc3MgYnJvd3NlciBldmVudCBmaXhcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnRcbiAgICBlLndoaWNoID0gZS53aGljaCB8fCBlLmNoYXJDb2RlIHx8IGUua2V5Q29kZVxuICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50XG4gICAgZS5jdXJyZW50VGFyZ2V0ID0gZG9tXG4gICAgZS5pdGVtID0gaXRlbVxuXG4gICAgLy8gcHJldmVudCBkZWZhdWx0IGJlaGF2aW91ciAoYnkgZGVmYXVsdClcbiAgICBpZiAoaGFuZGxlci5jYWxsKHRhZywgZSkgIT09IHRydWUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQgJiYgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnJldHVyblZhbHVlID0gZmFsc2VcbiAgICB9XG5cbiAgICB2YXIgZWwgPSBpdGVtID8gdGFnLnBhcmVudCA6IHRhZ1xuICAgIGVsLnVwZGF0ZSgpXG5cbiAgfVxuXG59XG5cbi8vIHVzZWQgYnkgaWYtIGF0dHJpYnV0ZVxuZnVuY3Rpb24gaW5zZXJ0VG8ocm9vdCwgbm9kZSwgYmVmb3JlKSB7XG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbnNlcnRCZWZvcmUoYmVmb3JlLCBub2RlKVxuICAgIHJvb3QucmVtb3ZlQ2hpbGQobm9kZSlcbiAgfVxufVxuXG4vLyBpdGVtID0gY3VycmVudGx5IGxvb3BlZCBpdGVtXG5mdW5jdGlvbiB1cGRhdGUoZXhwcmVzc2lvbnMsIHRhZywgaXRlbSkge1xuXG4gIGVhY2goZXhwcmVzc2lvbnMsIGZ1bmN0aW9uKGV4cHIpIHtcblxuICAgIHZhciBkb20gPSBleHByLmRvbSxcbiAgICAgICAgYXR0cl9uYW1lID0gZXhwci5hdHRyLFxuICAgICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCB0YWcpLFxuICAgICAgICBwYXJlbnQgPSBleHByLmRvbS5wYXJlbnROb2RlXG5cbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSAnJ1xuXG4gICAgLy8gbGVhdmUgb3V0IHJpb3QtIHByZWZpeGVzIGZyb20gc3RyaW5ncyBpbnNpZGUgdGV4dGFyZWFcbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC50YWdOYW1lID09ICdURVhUQVJFQScpIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvcmlvdC0vZywgJycpXG5cbiAgICAvLyBubyBjaGFuZ2VcbiAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxuICAgIGV4cHIudmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKCFhdHRyX25hbWUpIHJldHVybiBkb20ubm9kZVZhbHVlID0gdmFsdWVcblxuICAgIC8vIHJlbW92ZSBvcmlnaW5hbCBhdHRyaWJ1dGVcbiAgICByZW1BdHRyKGRvbSwgYXR0cl9uYW1lKVxuXG4gICAgLy8gZXZlbnQgaGFuZGxlclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgc2V0RXZlbnRIYW5kbGVyKGF0dHJfbmFtZSwgdmFsdWUsIGRvbSwgdGFnLCBpdGVtKVxuXG4gICAgLy8gaWYtIGNvbmRpdGlvbmFsXG4gICAgfSBlbHNlIGlmIChhdHRyX25hbWUgPT0gJ2lmJykge1xuICAgICAgdmFyIHN0dWIgPSBleHByLnN0dWJcblxuICAgICAgLy8gYWRkIHRvIERPTVxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHN0dWIgJiYgaW5zZXJ0VG8oc3R1Yi5wYXJlbnROb2RlLCBzdHViLCBkb20pXG5cbiAgICAgIC8vIHJlbW92ZSBmcm9tIERPTVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3R1YiA9IGV4cHIuc3R1YiA9IHN0dWIgfHwgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpXG4gICAgICAgIGluc2VydFRvKGRvbS5wYXJlbnROb2RlLCBkb20sIHN0dWIpXG4gICAgICB9XG5cbiAgICAvLyBzaG93IC8gaGlkZVxuICAgIH0gZWxzZSBpZiAoL14oc2hvd3xoaWRlKSQvLnRlc3QoYXR0cl9uYW1lKSkge1xuICAgICAgaWYgKGF0dHJfbmFtZSA9PSAnaGlkZScpIHZhbHVlID0gIXZhbHVlXG4gICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJycgOiAnbm9uZSdcblxuICAgIC8vIGZpZWxkIHZhbHVlXG4gICAgfSBlbHNlIGlmIChhdHRyX25hbWUgPT0gJ3ZhbHVlJykge1xuICAgICAgZG9tLnZhbHVlID0gdmFsdWVcblxuICAgIC8vIDxpbWcgc3JjPVwieyBleHByIH1cIj5cbiAgICB9IGVsc2UgaWYgKGF0dHJfbmFtZS5zbGljZSgwLCA1KSA9PSAncmlvdC0nKSB7XG4gICAgICBhdHRyX25hbWUgPSBhdHRyX25hbWUuc2xpY2UoNSlcbiAgICAgIHZhbHVlID8gZG9tLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIHZhbHVlKSA6IHJlbUF0dHIoZG9tLCBhdHRyX25hbWUpXG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGV4cHIuYm9vbCkge1xuICAgICAgICBkb21bYXR0cl9uYW1lXSA9IHZhbHVlXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVyblxuICAgICAgICB2YWx1ZSA9IGF0dHJfbmFtZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9ICdvYmplY3QnKSBkb20uc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgdmFsdWUpXG5cbiAgICB9XG5cbiAgfSlcblxufVxuZnVuY3Rpb24gZWFjaChlbHMsIGZuKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSAoZWxzIHx8IFtdKS5sZW5ndGgsIGVsOyBpIDwgbGVuOyBpKyspIHtcbiAgICBlbCA9IGVsc1tpXVxuICAgIC8vIHJldHVybiBmYWxzZSAtPiByZW9tdmUgY3VycmVudCBpdGVtIGR1cmluZyBsb29wXG4gICAgaWYgKGVsICE9IG51bGwgJiYgZm4oZWwsIGkpID09PSBmYWxzZSkgaS0tXG4gIH1cbiAgcmV0dXJuIGVsc1xufVxuXG5mdW5jdGlvbiByZW1BdHRyKGRvbSwgbmFtZSkge1xuICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG59XG5cbi8vIG1heCAyIGZyb20gb2JqZWN0cyBhbGxvd2VkXG5mdW5jdGlvbiBleHRlbmQob2JqLCBmcm9tLCBmcm9tMikge1xuICBmcm9tICYmIGVhY2goT2JqZWN0LmtleXMoZnJvbSksIGZ1bmN0aW9uKGtleSkge1xuICAgIG9ialtrZXldID0gZnJvbVtrZXldXG4gIH0pXG4gIHJldHVybiBmcm9tMiA/IGV4dGVuZChvYmosIGZyb20yKSA6IG9ialxufVxuXG5mdW5jdGlvbiBta2RvbSh0ZW1wbGF0ZSkge1xuICB2YXIgdGFnX25hbWUgPSB0ZW1wbGF0ZS50cmltKCkuc2xpY2UoMSwgMykudG9Mb3dlckNhc2UoKSxcbiAgICAgIHJvb3RfdGFnID0gL3RkfHRoLy50ZXN0KHRhZ19uYW1lKSA/ICd0cicgOiB0YWdfbmFtZSA9PSAndHInID8gJ3Rib2R5JyA6ICdkaXYnLFxuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHJvb3RfdGFnKVxuXG4gIGVsLnN0dWIgPSB0cnVlXG4gIGVsLmlubmVySFRNTCA9IHRlbXBsYXRlXG4gIHJldHVybiBlbFxufVxuXG5mdW5jdGlvbiB3YWxrKGRvbSwgZm4pIHtcbiAgaWYgKGRvbSkge1xuICAgIGlmIChmbihkb20pID09PSBmYWxzZSkgd2Fsayhkb20ubmV4dFNpYmxpbmcsIGZuKVxuICAgIGVsc2Uge1xuICAgICAgZG9tID0gZG9tLmZpcnN0Q2hpbGRcblxuICAgICAgd2hpbGUgKGRvbSkge1xuICAgICAgICB3YWxrKGRvbSwgZm4pXG4gICAgICAgIGRvbSA9IGRvbS5uZXh0U2libGluZ1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBhcnJEaWZmKGFycjEsIGFycjIpIHtcbiAgcmV0dXJuIGFycjEuZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIGFycjIuaW5kZXhPZihlbCkgPCAwXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGFyckZpbmRFcXVhbHMoYXJyLCBlbCkge1xuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoX2VsKSB7XG4gICAgcmV0dXJuIF9lbCA9PT0gZWxcbiAgfSlcbn1cblxuZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQpIHtcbiAgZnVuY3Rpb24gQ2hpbGQoKSB7fVxuICBDaGlsZC5wcm90b3R5cGUgPSBwYXJlbnRcbiAgcmV0dXJuIG5ldyBDaGlsZCgpXG59XG5cbi8qXG4gVmlydHVhbCBkb20gaXMgYW4gYXJyYXkgb2YgY3VzdG9tIHRhZ3Mgb24gdGhlIGRvY3VtZW50LlxuIFVwZGF0ZXMgYW5kIHVubW91bnRzIHByb3BhZ2F0ZSBkb3dud2FyZHMgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4uXG4qL1xuXG52YXIgdmlydHVhbF9kb20gPSBbXSxcbiAgICB0YWdfaW1wbCA9IHt9XG5cblxuZnVuY3Rpb24gZ2V0VGFnKGRvbSkge1xuICByZXR1cm4gdGFnX2ltcGxbZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKV1cbn1cblxuZnVuY3Rpb24gaW5qZWN0U3R5bGUoY3NzKSB7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxuICBub2RlLmlubmVySFRNTCA9IGNzc1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG5vZGUpXG59XG5cbmZ1bmN0aW9uIG1vdW50VG8ocm9vdCwgdGFnTmFtZSwgb3B0cykge1xuICB2YXIgdGFnID0gdGFnX2ltcGxbdGFnTmFtZV1cblxuICBpZiAodGFnICYmIHJvb3QpIHRhZyA9IG5ldyBUYWcodGFnLCB7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMgfSlcblxuICBpZiAodGFnICYmIHRhZy5tb3VudCkge1xuICAgIHRhZy5tb3VudCgpXG4gICAgdmlydHVhbF9kb20ucHVzaCh0YWcpXG4gICAgcmV0dXJuIHRhZy5vbigndW5tb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmlydHVhbF9kb20uc3BsaWNlKHZpcnR1YWxfZG9tLmluZGV4T2YodGFnKSwgMSlcbiAgICB9KVxuICB9XG5cbn1cblxucmlvdC50YWcgPSBmdW5jdGlvbihuYW1lLCBodG1sLCBjc3MsIGZuKSB7XG4gIGlmICh0eXBlb2YgY3NzID09ICdmdW5jdGlvbicpIGZuID0gY3NzXG4gIGVsc2UgaWYgKGNzcykgaW5qZWN0U3R5bGUoY3NzKVxuICB0YWdfaW1wbFtuYW1lXSA9IHsgbmFtZTogbmFtZSwgdG1wbDogaHRtbCwgZm46IGZuIH1cbn1cblxucmlvdC5tb3VudCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCB0YWdOYW1lLCBvcHRzKSB7XG4gIGlmIChzZWxlY3RvciA9PSAnKicpIHNlbGVjdG9yID0gT2JqZWN0LmtleXModGFnX2ltcGwpLmpvaW4oJywgJylcbiAgaWYgKHR5cGVvZiB0YWdOYW1lID09ICdvYmplY3QnKSB7IG9wdHMgPSB0YWdOYW1lOyB0YWdOYW1lID0gMCB9XG5cbiAgdmFyIHRhZ3MgPSBbXVxuXG4gIGZ1bmN0aW9uIHB1c2gocm9vdCkge1xuICAgIHZhciBuYW1lID0gdGFnTmFtZSB8fCByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgdGFnID0gbW91bnRUbyhyb290LCBuYW1lLCBvcHRzKVxuXG4gICAgaWYgKHRhZykgdGFncy5wdXNoKHRhZylcbiAgfVxuXG4gIC8vIERPTSBub2RlXG4gIGlmIChzZWxlY3Rvci50YWdOYW1lKSB7XG4gICAgcHVzaChzZWxlY3RvcilcbiAgICByZXR1cm4gdGFnc1swXVxuXG4gIC8vIHNlbGVjdG9yXG4gIH0gZWxzZSB7XG4gICAgZWFjaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgcHVzaClcbiAgICByZXR1cm4gdGFnc1xuICB9XG5cbn1cblxuLy8gdXBkYXRlIGV2ZXJ5dGhpbmdcbnJpb3QudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBlYWNoKHZpcnR1YWxfZG9tLCBmdW5jdGlvbih0YWcpIHtcbiAgICB0YWcudXBkYXRlKClcbiAgfSlcbn1cblxuLy8gQGRlcHJlY2F0ZWRcbnJpb3QubW91bnRUbyA9IHJpb3QubW91bnRcblxuXG4gIFxuICAvLyBzaGFyZSBtZXRob2RzIGZvciBvdGhlciByaW90IHBhcnRzLCBlLmcuIGNvbXBpbGVyXG4gIHJpb3QudXRpbCA9IHsgYnJhY2tldHM6IGJyYWNrZXRzLCB0bXBsOiB0bXBsIH1cblxuICAvLyBzdXBwb3J0IENvbW1vbkpTXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSByaW90XG5cbiAgLy8gc3VwcG9ydCBBTURcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIHJpb3QgfSlcblxuICAvLyBzdXBwb3J0IGJyb3dzZXJcbiAgZWxzZVxuICAgIHRoaXMucmlvdCA9IHJpb3RcblxufSkoKTtcbiJdfQ==