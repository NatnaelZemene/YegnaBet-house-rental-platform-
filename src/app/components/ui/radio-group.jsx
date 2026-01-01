"use client";

  import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function RadioGroup(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return RadioGroupPrimitive.Root, _objectSpread({
    "data-slot": "radio-group",
    className: (0, cn)("grid gap-3", className)
  }, props));
}
function RadioGroupItem(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return RadioGroupPrimitive.Item, _objectSpread(_objectSpread({
    "data-slot": "radio-group-item",
    className: (0, cn)("border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className)
  }, props), {}, {
    children: <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="relative flex items-center justify-center" children="/*#__PURE__*/(0" {
        className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
    })
  }));
}

export default _interopRequireWildcard;