"use client";

  import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from 'class-variance-authority';
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
const toggleVariants = function Toggle(_ref) {
  const {
      className,
      variant,
      size
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return TogglePrimitive.Root, _objectSpread({
    "data-slot": "toggle",
    className: (0, cn)(toggleVariants({
      variant,
      size,
      className
    }))
  }, props));
}

export default _interopRequireWildcard;