"use client";

  import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className", "children"],
  _excluded3 = ["className"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function Dialog(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return DialogPrimitive.Root, _objectSpread({
    "data-slot": "dialog"
  }, props));
}
function DialogTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return DialogPrimitive.Trigger, _objectSpread({
    "data-slot": "dialog-trigger"
  }, props));
}
function DialogPortal(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return DialogPrimitive.Portal, _objectSpread({
    "data-slot": "dialog-portal"
  }, props));
}
function DialogClose(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return DialogPrimitive.Close, _objectSpread({
    "data-slot": "dialog-close"
  }, props));
}
function DialogOverlay(_ref5) {
  const {
      className
    } = _ref5,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref5);
  return DialogPrimitive.Overlay, _objectSpread({
    "data-slot": "dialog-overlay",
    className: (0, cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
  }, props));
}
function DialogContent(_ref6) {
  const {
      className,
      children
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded2);
  return DialogPortal, {
    "data-slot": "dialog-portal",
    children: [<DialogOverlay />, DialogPrimitive.Content, _objectSpread(_objectSpread({
      "data-slot": "dialog-content",
      className: (0, cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className)
    }, props), {}, {
      children: [children, DialogPrimitive.Close, {
        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        children: [<XIcon />, <span className="sr-only" >{Close}< />]
      })]
    }))]
  });
}
function DialogHeader(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded3);
  return "div", _objectSpread({
    "data-slot": "dialog-header",
    className: (0, cn)("flex flex-col gap-2 text-center sm:text-left", className)
  }, props));
}
function DialogFooter(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded4);
  return "div", _objectSpread({
    "data-slot": "dialog-footer",
    className: (0, cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)
  }, props));
}
function DialogTitle(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded5);
  return DialogPrimitive.Title, _objectSpread({
    "data-slot": "dialog-title",
    className: (0, cn)("text-lg leading-none font-semibold", className)
  }, props));
}
function DialogDescription(_ref0) {
  const {
      className
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded6);
  return DialogPrimitive.Description, _objectSpread({
    "data-slot": "dialog-description",
    className: (0, cn)("text-muted-foreground text-sm", className)
  }, props));
}

export default _interopRequireWildcard;