"use client";

  import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function Popover(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return PopoverPrimitive.Root, _objectSpread({
    "data-slot": "popover"
  }, props));
}
function PopoverTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return PopoverPrimitive.Trigger, _objectSpread({
    "data-slot": "popover-trigger"
  }, props));
}
function PopoverContent(_ref3) {
  const {
      className,
      align = "center",
      sideOffset = 4
    } = _ref3,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref3);
  return PopoverPrimitive.Portal, {
    children: PopoverPrimitive.Content, _objectSpread({
      "data-slot": "popover-content",
      align: align,
      sideOffset: sideOffset,
      className: (0, cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className)
    }, props))
  });
}
function PopoverAnchor(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return PopoverPrimitive.Anchor, _objectSpread({
    "data-slot": "popover-anchor"
  }, props));
}

export default _interopRequireWildcard;