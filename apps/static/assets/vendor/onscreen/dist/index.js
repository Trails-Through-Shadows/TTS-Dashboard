parcelRequire = function (e, r, t, n) {
    var i, o = "function" == typeof parcelRequire && parcelRequire, u = "function" == typeof require && require;

    function f(t, n) {
        if (!r[t]) {
            if (!e[t]) {
                var i = "function" == typeof parcelRequire && parcelRequire;
                if (!n && i) return i(t, !0);
                if (o) return o(t, !0);
                if (u && "string" == typeof t) return u(t);
                var c = new Error("Cannot find module '" + t + "'");
                throw c.code = "MODULE_NOT_FOUND", c
            }
            p.resolve = function (r) {
                return e[t][1][r] || r
            }, p.cache = {};
            var l = r[t] = new f.Module(t);
            e[t][0].call(l.exports, p, l, l.exports, this)
        }
        return r[t].exports;

        function p(e) {
            return f(p.resolve(e))
        }
    }

    f.isParcelRequire = !0, f.Module = function (e) {
        this.id = e, this.bundle = f, this.exports = {}
    }, f.modules = e, f.cache = r, f.parent = o, f.register = function (r, t) {
        e[r] = [function (e, r) {
            r.exports = t
        }, {}]
    };
    for (var c = 0; c < t.length; c++) try {
        f(t[c])
    } catch (e) {
        i || (i = e)
    }
    if (t.length) {
        var l = f(t[t.length - 1]);
        "object" == typeof exports && "undefined" != typeof module ? module.exports = l : "function" == typeof define && define.amd ? define(function () {
            return l
        }) : n && (this[n] = l)
    }
    if (parcelRequire = f, i) throw i;
    return f
}({
    "Omyb": [function (require, module, exports) {
        "use strict";

        function e(e, t) {
            var r = window.MutationObserver;
            if (r) {
                var n = new r(t);
                return n.observe(e, {childList: !0, subtree: !0}), n
            }
            return e.addEventListener("DOMNodeInserted", t, !1), e.addEventListener("DOMNodeRemoved", t, !1), null
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = e;
    }, {}], "A8OV": [function (require, module, exports) {
        "use strict";
        var e = this && this.__importDefault || function (e) {
            return e && e.__esModule ? e : {default: e}
        };
        Object.defineProperty(exports, "__esModule", {value: !0});
        var t = e(require("../helpers/observe-dom"));

        function s() {
            var e = this, s = this.options.container;
            s instanceof HTMLElement && ("static" === window.getComputedStyle(s).position && (s.style.position = "relative"));
            this._observer = t.default(document.querySelector("body"), function () {
                Object.keys(e.trackedElements).forEach(function (t) {
                    e.on("enter", t), e.on("leave", t)
                })
            }), s.addEventListener("scroll", this._scroll, {passive: !0}), window.addEventListener("resize", this._scroll, {passive: !0}), this._scroll(), this.attached = !0
        }

        exports.default = s;
    }, {"../helpers/observe-dom": "Omyb"}], "OJn0": [function (require, module, exports) {
        "use strict";

        function e(e, t) {
            if (!e) throw new Error("You should specify the element you want to test");
            "string" == typeof e && (e = document.querySelector(e));
            var n = e.getBoundingClientRect();
            return n.bottom - t.tolerance > 0 && n.right - t.tolerance > 0 && n.left + t.tolerance < (window.innerWidth || document.documentElement.clientWidth) && n.top + t.tolerance < (window.innerHeight || document.documentElement.clientHeight)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = e;
    }, {}], "m6QN": [function (require, module, exports) {
        "use strict";

        function e(e, t) {
            if (!e) throw new Error("You should specify the element you want to test");
            if ("string" == typeof e && (e = document.querySelector(e)), "string" == typeof t && (t = {
                tolerance: 0,
                container: document.querySelector(t)
            }), "string" == typeof t.container && (t.container = document.querySelector(t.container)), t instanceof HTMLElement && (t = {
                tolerance: 0,
                container: t
            }), !t.container) throw new Error("You should specify a container element");
            var o = t.container.getBoundingClientRect();
            return e.offsetTop + e.clientHeight - t.tolerance > t.container.scrollTop && e.offsetLeft + e.clientWidth - t.tolerance > t.container.scrollLeft && e.offsetLeft + t.tolerance < o.width + t.container.scrollLeft && e.offsetTop + t.tolerance < o.height + t.container.scrollTop
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = e;
    }, {}], "VqMh": [function (require, module, exports) {
        "use strict";
        var e = this && this.__importDefault || function (e) {
            return e && e.__esModule ? e : {default: e}
        };
        Object.defineProperty(exports, "__esModule", {value: !0});
        var i = e(require("./in-viewport")), n = e(require("./in-container"));

        function t(e, t) {
            void 0 === e && (e = {}), void 0 === t && (t = {container: window, tolerance: 0});
            var o, r = Object.keys(e);
            r.length && (o = t.container === window ? i.default : n.default, r.forEach(function (i) {
                e[i].nodes.forEach(function (n) {
                    if (o(n.node, t) ? (n.wasVisible = n.isVisible, n.isVisible = !0) : (n.wasVisible = n.isVisible, n.isVisible = !1), !0 === n.isVisible && !1 === n.wasVisible) {
                        if (!e[i].enter) return;
                        Object.keys(e[i].enter).forEach(function (t) {
                            "function" == typeof e[i].enter[t] && e[i].enter[t](n.node, "enter")
                        })
                    }
                    if (!1 === n.isVisible && !0 === n.wasVisible) {
                        if (!e[i].leave) return;
                        Object.keys(e[i].leave).forEach(function (t) {
                            "function" == typeof e[i].leave[t] && e[i].leave[t](n.node, "leave")
                        })
                    }
                })
            }))
        }

        exports.default = t;
    }, {"./in-viewport": "OJn0", "./in-container": "m6QN"}], "GRp5": [function (require, module, exports) {
        "use strict";
        var e = this && this.__importDefault || function (e) {
            return e && e.__esModule ? e : {default: e}
        };
        Object.defineProperty(exports, "__esModule", {value: !0});
        var t = e(require("../helpers/scroll-handler"));

        function r() {
            var e, r = this;
            return function () {
                clearTimeout(e), e = setTimeout(function () {
                    t.default(r.trackedElements, r.options)
                }, r.options.debounce)
            }
        }

        exports.default = r;
    }, {"../helpers/scroll-handler": "VqMh"}], "FO0g": [function (require, module, exports) {
        "use strict";

        function e() {
            this._observer instanceof MutationObserver && this._observer.disconnect(), this.options.container.removeEventListener("scroll", this._scroll), window.removeEventListener("resize", this._scroll), this.attached = !1
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = e;
    }, {}], "nGOL": [function (require, module, exports) {
        "use strict";

        function e(e, t, s) {
            var l = Object.keys(this.trackedElements[t].enter || {}),
                n = Object.keys(this.trackedElements[t].leave || {});
            if ({}.hasOwnProperty.call(this.trackedElements, t)) if (s) {
                if (this.trackedElements[t][e]) {
                    var r = "function" == typeof s ? s.name : s;
                    delete this.trackedElements[t][e][r]
                }
            } else delete this.trackedElements[t][e];
            l.length || n.length || delete this.trackedElements[t]
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = e;
    }, {}], "NKIH": [function (require, module, exports) {
        "use strict";

        function e(e, t, r) {
            if (!e) throw new Error("No event given. Choose either enter or leave");
            if (!t) throw new Error("No selector to track");
            if (["enter", "leave"].indexOf(e) < 0) throw new Error(e + " event is not supported");
            ({}).hasOwnProperty.call(this.trackedElements, t) || (this.trackedElements[t] = {}), this.trackedElements[t].nodes = [];
            for (var s = 0, n = document.querySelectorAll(t); s < n.length; s++) {
                var o = {isVisible: !1, wasVisible: !1, node: n[s]};
                this.trackedElements[t].nodes.push(o)
            }
            "function" == typeof r && (this.trackedElements[t][e] || (this.trackedElements[t][e] = {}), this.trackedElements[t][e][r.name || "anonymous"] = r)
        }

        Object.defineProperty(exports, "__esModule", {value: !0}), exports.default = e;
    }, {}], "QCba": [function (require, module, exports) {
        "use strict";
        var e = this && this.__importDefault || function (e) {
            return e && e.__esModule ? e : {default: e}
        };
        Object.defineProperty(exports, "__esModule", {value: !0});
        var t = e(require("./methods/attach")), r = e(require("./methods/debounced-scroll")),
            n = e(require("./methods/destroy")), o = e(require("./methods/off")), i = e(require("./methods/on")),
            u = e(require("./helpers/in-viewport"));

        function a(e) {
            void 0 === e && (e = {
                tolerance: 0,
                debounce: 100,
                container: window
            }), this.options = {}, this.trackedElements = {}, Object.defineProperties(this.options, {
                container: {
                    configurable: !1,
                    enumerable: !1,
                    get: function () {
                        var t;
                        return "string" == typeof e.container ? t = document.querySelector(e.container) : e.container instanceof HTMLElement && (t = e.container), t || window
                    },
                    set: function (t) {
                        e.container = t
                    }
                }, debounce: {
                    get: function () {
                        return e.debounce || 100
                    }, set: function (t) {
                        e.debounce = t
                    }
                }, tolerance: {
                    get: function () {
                        return e.tolerance || 0
                    }, set: function (t) {
                        e.tolerance = t
                    }
                }
            }), Object.defineProperty(this, "_scroll", {
                enumerable: !1,
                configurable: !1,
                writable: !1,
                value: this._debouncedScroll.call(this)
            }), this.attach()
        }

        Object.defineProperties(a.prototype, {
            _debouncedScroll: {
                configurable: !1,
                writable: !1,
                enumerable: !1,
                value: r.default
            },
            attach: {configurable: !1, writable: !1, enumerable: !1, value: t.default},
            destroy: {configurable: !1, writable: !1, enumerable: !1, value: n.default},
            off: {configurable: !1, writable: !1, enumerable: !1, value: o.default},
            on: {configurable: !1, writable: !1, enumerable: !1, value: i.default}
        }), a.check = u.default, exports.default = a;
    }, {
        "./methods/attach": "A8OV",
        "./methods/debounced-scroll": "GRp5",
        "./methods/destroy": "FO0g",
        "./methods/off": "nGOL",
        "./methods/on": "NKIH",
        "./helpers/in-viewport": "OJn0"
    }]
}, {}, ["QCba"], null)
