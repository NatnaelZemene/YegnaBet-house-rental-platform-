"use client";

  import * as React from "react";
import { vaul } from 'vaul';
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
function Drawer(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return Drawer.Root, _objectSpread({
    "data-slot": "drawer"
  }, props));
}
function DrawerTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return Drawer.Trigger, _objectSpread({
    "data-slot": "drawer-trigger"
  }, props));
}
function DrawerPortal(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return Drawer.Portal, _objectSpread({
    "data-slot": "drawer-portal"
  }, props));
}
function DrawerClose(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return Drawer.Close, _objectSpread({
    "data-slot": "drawer-close"
  }, props));
}
function DrawerOverlay(_ref5) {
  const {
      className
    } = _ref5,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref5);
  return Drawer.Overlay, _objectSpread({
    "data-slot": "drawer-overlay",
    className: (0, cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className)
  }, props));
}
function DrawerContent(_ref6) {
  const {
      className,
      children
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded2);
  return DrawerPortal, {
    "data-slot": "drawer-portal",
    children: [<DrawerOverlay />, Drawer.Content, _objectSpread(_objectSpread({
      "data-slot": "drawer-content",
      className: (0, cn)("group/drawer-content bg-background fixed z-50 flex h-auto flex-col", "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b", "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t", "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm", "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm", className)
    }, props), {}, {
      children: [<div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content" />, children]
    }))]
  });
}
function DrawerHeader(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded3);
  return "div", _objectSpread({
    "data-slot": "drawer-header",
    className: (0, cn)("flex flex-col gap-1.5 p-4", className)
  }, props));
}
function DrawerFooter(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded4);
  return "div", _objectSpread({
    "data-slot": "drawer-footer",
    className: (0, cn)("mt-auto flex flex-col gap-2 p-4", className)
  }, props));
}
function DrawerTitle(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded5);
  return Drawer.Title, _objectSpread({
    "data-slot": "drawer-title",
    className: (0, cn)("text-foreground font-semibold", className)
  }, props));
}
function DrawerDescription(_ref0) {
  const {
      className
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded6);
  return Drawer.Description, _objectSpread({
    "data-slot": "drawer-description",
    className: (0, cn)("text-muted-foreground text-sm", className)
  }, props));
}

export default _interopRequireWildcard;