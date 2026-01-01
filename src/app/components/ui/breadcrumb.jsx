import * as React from "react";
import { Slot } from '@radix-ui/react-slot';
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["asChild", "className"],
  _excluded4 = ["className"],
  _excluded5 = ["children", "className"],
  _excluded6 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function Breadcrumb(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return "nav", _objectSpread({
    "aria-label": "breadcrumb",
    "data-slot": "breadcrumb"
  }, props));
}
function BreadcrumbList(_ref2) {
  const {
      className
    } = _ref2,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref2);
  return "ol", _objectSpread({
    "data-slot": "breadcrumb-list",
    className: (0, cn)("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5", className)
  }, props));
}
function BreadcrumbItem(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded2);
  return "li", _objectSpread({
    "data-slot": "breadcrumb-item",
    className: (0, cn)("inline-flex items-center gap-1.5", className)
  }, props));
}
function BreadcrumbLink(_ref4) {
  const {
      asChild,
      className
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded3);
  const Comp = asChild ? Slot : "a";
  return Comp, _objectSpread({
    "data-slot": "breadcrumb-link",
    className: (0, cn)("hover:text-foreground transition-colors", className)
  }, props));
}
function BreadcrumbPage(_ref5) {
  const {
      className
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded4);
  return "span", _objectSpread({
    "data-slot": "breadcrumb-page",
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    className: (0, cn)("text-foreground font-normal", className)
  }, props));
}
function BreadcrumbSeparator(_ref6) {
  const {
      children,
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded5);
  return "li", _objectSpread(_objectSpread({
    "data-slot": "breadcrumb-separator",
    role: "presentation",
    "aria-hidden": "true",
    className: (0, cn)("[&>svg]:size-3.5", className)
  }, props), {}, {
    children: children !== null && children !== void 0 ? children : <ChevronRight />
  }));
}
function BreadcrumbEllipsis(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded6);
  return "span", _objectSpread(_objectSpread({
    "data-slot": "breadcrumb-ellipsis",
    role: "presentation",
    "aria-hidden": "true",
    className: (0, cn)("flex size-9 items-center justify-center", className)
  }, props), {}, {
    children: [<MoreHorizontal className="size-4" />, <span className="sr-only" >{More}< />]
  }));
}

export default _interopRequireWildcard;