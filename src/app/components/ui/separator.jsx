"use client";

  import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Separator(_ref) {
  const {
      className,
      orientation = "horizontal",
      decorative = true
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return SeparatorPrimitive.Root, _objectSpread({
    "data-slot": "separator-root",
    decorative: decorative,
    orientation: orientation,
    className: (0, cn)("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)
  }, props));
}

export default _interopRequireWildcard;