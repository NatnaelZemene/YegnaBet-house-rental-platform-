"use client";

  import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Switch(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return SwitchPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "switch",
    className: (0, cn)("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)
  }, props), {}, {
    children: <SwitchPrimitive.Thumb data-slot="switch-thumb" className="(0" cn)(bg-card dark="data-[state=unchecked]" />
  }));
}

export default _interopRequireWildcard;