"use client";

  import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Progress(_ref) {
  const {
      className,
      value
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return ProgressPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "progress",
    className: (0, cn)("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className)
  }, props), {}, {
    children: ProgressPrimitive.Indicator, {
      "data-slot": "progress-indicator",
      className: "bg-primary h-full w-full flex-1 transition-all",
      style: {
        transform: "translateX(-" + 100 - (value || 0), "%)")
      }
    })
  }));
}

export default _interopRequireWildcard;