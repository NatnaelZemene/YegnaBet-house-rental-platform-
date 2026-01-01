"use client";

  import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Checkbox(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return CheckboxPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "checkbox",
    className: (0, cn)("peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)
  }, props), {}, {
    children: <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-current transition-none" children="/*#__PURE__*/(0" {
        className="size-3.5" />
    })
  }));
}

export default _interopRequireWildcard;