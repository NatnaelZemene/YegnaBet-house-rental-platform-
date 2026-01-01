"use client";

  import * as React from "react";
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"],
  _excluded7 = ["className"],
  _excluded8 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Table(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return "div", {
    "data-slot": "table-container",
    className: "relative w-full overflow-x-auto",
    children: "table", _objectSpread({
      "data-slot": "table",
      className: (0, cn)("w-full caption-bottom text-sm", className)
    }, props))
  });
}
function TableHeader(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return "thead", _objectSpread({
    "data-slot": "table-header",
    className: (0, cn)("[&_tr]:border-b", className)
  }, props));
}
function TableBody(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return "tbody", _objectSpread({
    "data-slot": "table-body",
    className: (0, cn)("[&_tr:last-child]:border-0", className)
  }, props));
}
function TableFooter(_ref4) {
  const {
      className
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  return "tfoot", _objectSpread({
    "data-slot": "table-footer",
    className: (0, cn)("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)
  }, props));
}
function TableRow(_ref5) {
  const {
      className
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded5);
  return "tr", _objectSpread({
    "data-slot": "table-row",
    className: (0, cn)("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)
  }, props));
}
function TableHead(_ref6) {
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded6);
  return "th", _objectSpread({
    "data-slot": "table-head",
    className: (0, cn)("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)
  }, props));
}
function TableCell(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded7);
  return "td", _objectSpread({
    "data-slot": "table-cell",
    className: (0, cn)("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)
  }, props));
}
function TableCaption(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded8);
  return "caption", _objectSpread({
    "data-slot": "table-caption",
    className: (0, cn)("text-muted-foreground mt-4 text-sm", className)
  }, props));
}

export default _interopRequireWildcard;