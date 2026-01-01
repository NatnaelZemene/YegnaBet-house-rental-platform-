"use client";

  import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from './utils';

const _excluded = ["className", "children"],
  _excluded2 = ["className", "orientation"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function ScrollArea(_ref) {
  const {
      className,
      children
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return ScrollAreaPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "scroll-area",
    className: (0, cn)("relative", className)
  }, props), {}, {
    children: [<ScrollAreaPrimitive.Viewport data-slot="scroll-area-viewport" className="focus-visible" box-shadow] outline-none focus-visible="ring-[3px] focus-visible" >{children}< />, <ScrollBar />, <ScrollAreaPrimitive.Corner />]
  }));
}
function ScrollBar(_ref2) {
  const {
      className,
      orientation = "vertical"
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return ScrollAreaPrimitive.ScrollAreaScrollbar, _objectSpread(_objectSpread({
    "data-slot": "scroll-area-scrollbar",
    orientation: orientation,
    className: (0, cn)("flex touch-none p-px transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", className)
  }, props), {}, {
    children: <ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" className="bg-border relative flex-1 rounded-full" />
  }));
}

export default _interopRequireWildcard;