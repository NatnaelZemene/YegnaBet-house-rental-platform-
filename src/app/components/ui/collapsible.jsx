"use client";

  import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function Collapsible(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return CollapsiblePrimitive.Root, _objectSpread({
    "data-slot": "collapsible"
  }, props));
}
function CollapsibleTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return CollapsiblePrimitive.CollapsibleTrigger, _objectSpread({
    "data-slot": "collapsible-trigger"
  }, props));
}
function CollapsibleContent(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return CollapsiblePrimitive.CollapsibleContent, _objectSpread({
    "data-slot": "collapsible-content"
  }, props));
}

export default _interopRequireWildcard;