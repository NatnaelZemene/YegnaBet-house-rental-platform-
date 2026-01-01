"use client";

  import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from './utils';
import { Button } from './button';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"],
  _excluded7 = ["className"],
  _excluded8 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function AlertDialog(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return AlertDialogPrimitive.Root, _objectSpread({
    "data-slot": "alert-dialog"
  }, props));
}
function AlertDialogTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return AlertDialogPrimitive.Trigger, _objectSpread({
    "data-slot": "alert-dialog-trigger"
  }, props));
}
function AlertDialogPortal(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return AlertDialogPrimitive.Portal, _objectSpread({
    "data-slot": "alert-dialog-portal"
  }, props));
}
function AlertDialogOverlay(_ref4) {
  const {
      className
    } = _ref4,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref4);
  return AlertDialogPrimitive.Overlay, _objectSpread({
    "data-slot": "alert-dialog-overlay",
    className: (0, cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
  }, props));
}
function AlertDialogContent(_ref5) {
  const {
      className
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded2);
  return AlertDialogPortal, {
    children: [<AlertDialogOverlay />, AlertDialogPrimitive.Content, _objectSpread({
      "data-slot": "alert-dialog-content",
      className: (0, cn)("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", className)
    }, props))]
  });
}
function AlertDialogHeader(_ref6) {
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded3);
  return "div", _objectSpread({
    "data-slot": "alert-dialog-header",
    className: (0, cn)("flex flex-col gap-2 text-center sm:text-left", className)
  }, props));
}
function AlertDialogFooter(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded4);
  return "div", _objectSpread({
    "data-slot": "alert-dialog-footer",
    className: (0, cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)
  }, props));
}
function AlertDialogTitle(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded5);
  return AlertDialogPrimitive.Title, _objectSpread({
    "data-slot": "alert-dialog-title",
    className: (0, cn)("text-lg font-semibold", className)
  }, props));
}
function AlertDialogDescription(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded6);
  return AlertDialogPrimitive.Description, _objectSpread({
    "data-slot": "alert-dialog-description",
    className: (0, cn)("text-muted-foreground text-sm", className)
  }, props));
}
function AlertDialogAction(_ref0) {
  const {
      className
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded7);
  return AlertDialogPrimitive.Action, _objectSpread({
    className: (0, cn)((0, buttonVariants)(), className)
  }, props));
}
function AlertDialogCancel(_ref1) {
  const {
      className
    } = _ref1,
    props = _objectWithoutProperties(_ref1, _excluded8);
  return AlertDialogPrimitive.Cancel, _objectSpread({
    className: (0, cn)((0, buttonVariants)({
      variant: "outline"
    }), className)
  }, props));
}

export default _interopRequireWildcard;