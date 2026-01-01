"use client";

  import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function HoverCard(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return HoverCardPrimitive.Root, _objectSpread({
    "data-slot": "hover-card"
  }, props));
}
function HoverCardTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return HoverCardPrimitive.Trigger, _objectSpread({
    "data-slot": "hover-card-trigger"
  }, props));
}
function HoverCardContent(_ref3) {
  const {
      className,
      align = "center",
      sideOffset = 4
    } = _ref3,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref3);
  return HoverCardPrimitive.Portal, {
    "data-slot": "hover-card-portal",
    children: HoverCardPrimitive.Content, _objectSpread({
      "data-slot": "hover-card-content",
      align: align,
      sideOffset: sideOffset,
      className: (0, cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className)
    }, props))
  });
}

export default _interopRequireWildcard;