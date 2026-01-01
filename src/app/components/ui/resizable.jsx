"use client";

  import * as React from "react";
import * as LucideIcons from 'lucide-react';
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["withHandle", "className"];
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function ResizablePanelGroup(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return ResizablePrimitive.PanelGroup, _objectSpread({
    "data-slot": "resizable-panel-group",
    className: (0, cn)("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)
  }, props));
}
function ResizablePanel(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return ResizablePrimitive.Panel, _objectSpread({
    "data-slot": "resizable-panel"
  }, props));
}
function ResizableHandle(_ref3) {
  const {
      withHandle,
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded2);
  return ResizablePrimitive.PanelResizeHandle, _objectSpread(_objectSpread({
    "data-slot": "resizable-handle",
    className: (0, cn)("bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90", className)
  }, props), {}, {
    children: withHandle && <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border" children="/*#__PURE__*/(0" {
        className="size-2.5" />
    })
  }));
}

export default _interopRequireWildcard;