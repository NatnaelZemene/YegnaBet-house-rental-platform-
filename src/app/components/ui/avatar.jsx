"use client";

  import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Avatar(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return AvatarPrimitive.Root, _objectSpread({
    "data-slot": "avatar",
    className: (0, cn)("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)
  }, props));
}
function AvatarImage(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return AvatarPrimitive.Image, _objectSpread({
    "data-slot": "avatar-image",
    className: (0, cn)("aspect-square size-full", className)
  }, props));
}
function AvatarFallback(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return AvatarPrimitive.Fallback, _objectSpread({
    "data-slot": "avatar-fallback",
    className: (0, cn)("bg-muted flex size-full items-center justify-center rounded-full", className)
  }, props));
}

export default _interopRequireWildcard;