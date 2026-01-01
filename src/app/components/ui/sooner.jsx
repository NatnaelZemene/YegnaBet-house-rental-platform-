"use client";

  import { nextThemes } from 'next-themes';
import { toast } from 'sonner';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
const Toaster = _ref => {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  const {
    theme = "system"
  } = (0, useTheme)();
  return Toaster, _objectSpread({
    theme: theme,
    className: "toaster group",
    style: {
      "--normal-bg": "const(--popover)",
      "--normal-text": "const(--popover-foreground)",
      "--normal-border": "const(--border)"
    }
  }, props));
};
export default _defineProperty;