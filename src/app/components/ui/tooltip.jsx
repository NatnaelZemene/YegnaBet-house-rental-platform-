"use client";

  import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from './utils';

const _excluded = ["delayDuration"],
  _excluded2 = ["className", "sideOffset", "children"];
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function TooltipProvider(_ref) {
  const {
      delayDuration = 0
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return TooltipPrimitive.Provider, _objectSpread({
    "data-slot": "tooltip-provider",
    delayDuration: delayDuration
  }, props));
}
function Tooltip(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return TooltipProvider, {
    children: TooltipPrimitive.Root, _objectSpread({
      "data-slot": "tooltip"
    }, props))
  });
}
function TooltipTrigger(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return TooltipPrimitive.Trigger, _objectSpread({
    "data-slot": "tooltip-trigger"
  }, props));
}
function TooltipContent(_ref4) {
  const {
      className,
      sideOffset = 0,
      children
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded2);
  return TooltipPrimitive.Portal, {
    children: TooltipPrimitive.Content, _objectSpread(_objectSpread({
      "data-slot": "tooltip-content",
      sideOffset: sideOffset,
      className: (0, cn)("bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className)
    }, props), {}, {
      children: [children, <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />]
    }))
  });
}

export default _interopRequireWildcard;