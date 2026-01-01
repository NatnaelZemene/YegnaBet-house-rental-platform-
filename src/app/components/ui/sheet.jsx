"use client";

  import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className", "children", "side"],
  _excluded3 = ["className"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function Sheet(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return SheetPrimitive.Root, _objectSpread({
    "data-slot": "sheet"
  }, props));
}
function SheetTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return SheetPrimitive.Trigger, _objectSpread({
    "data-slot": "sheet-trigger"
  }, props));
}
function SheetClose(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return SheetPrimitive.Close, _objectSpread({
    "data-slot": "sheet-close"
  }, props));
}
function SheetPortal(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return SheetPrimitive.Portal, _objectSpread({
    "data-slot": "sheet-portal"
  }, props));
}
function SheetOverlay(_ref5) {
  const {
      className
    } = _ref5,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref5);
  return SheetPrimitive.Overlay, _objectSpread({
    "data-slot": "sheet-overlay",
    className: (0, cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
  }, props));
}
function SheetContent(_ref6) {
  const {
      className,
      children,
      side = "right"
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded2);
  return SheetPortal, {
    children: [<SheetOverlay />, SheetPrimitive.Content, _objectSpread(_objectSpread({
      "data-slot": "sheet-content",
      className: (0, cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", className)
    }, props), {}, {
      children: [children, SheetPrimitive.Close, {
        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
        children: [<XIcon className="size-4" />, <span className="sr-only" >{Close}< />]
      })]
    }))]
  });
}
function SheetHeader(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded3);
  return "div", _objectSpread({
    "data-slot": "sheet-header",
    className: (0, cn)("flex flex-col gap-1.5 p-4", className)
  }, props));
}
function SheetFooter(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded4);
  return "div", _objectSpread({
    "data-slot": "sheet-footer",
    className: (0, cn)("mt-auto flex flex-col gap-2 p-4", className)
  }, props));
}
function SheetTitle(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded5);
  return SheetPrimitive.Title, _objectSpread({
    "data-slot": "sheet-title",
    className: (0, cn)("text-foreground font-semibold", className)
  }, props));
}
function SheetDescription(_ref0) {
  const {
      className
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded6);
  return SheetPrimitive.Description, _objectSpread({
    "data-slot": "sheet-description",
    className: (0, cn)("text-muted-foreground text-sm", className)
  }, props));
}

export default _interopRequireWildcard;