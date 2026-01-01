"use client";

  import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Tabs(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return TabsPrimitive.Root, _objectSpread({
    "data-slot": "tabs",
    className: (0, cn)("flex flex-col gap-2", className)
  }, props));
}
function TabsList(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return TabsPrimitive.List, _objectSpread({
    "data-slot": "tabs-list",
    className: (0, cn)("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex", className)
  }, props));
}
function TabsTrigger(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return TabsPrimitive.Trigger, _objectSpread({
    "data-slot": "tabs-trigger",
    className: (0, cn)("data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props));
}
function TabsContent(_ref4) {
  const {
      className
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  return TabsPrimitive.Content, _objectSpread({
    "data-slot": "tabs-content",
    className: (0, cn)("flex-1 outline-none", className)
  }, props));
}

export default _interopRequireWildcard;