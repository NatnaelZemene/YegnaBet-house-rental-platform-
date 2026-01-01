import React from "react";
"use client";

  import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from './utils';
import { Toggle } from './toggle';

const _excluded = ["className", "variant", "size", "children"],
  _excluded2 = ["className", "children", "variant", "size"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
const ToggleGroupContext = /*#__PURE__*/React.createContext({
  size: "default",
  variant: "default"
});
function ToggleGroup(_ref) {
  const {
      className,
      variant,
      size,
      children
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return ToggleGroupPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "toggle-group",
    "data-variant": variant,
    "data-size": size,
    className: (0, cn)("group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs", className)
  }, props), {}, {
    children: ToggleGroupContext.Provider, {
      value: {
        variant,
        size
      },
      children: children
    })
  }));
}
function ToggleGroupItem(_ref2) {
  const {
      className,
      children,
      variant,
      size
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  const context = React.useContext(ToggleGroupContext);
  return ToggleGroupPrimitive.Item, _objectSpread(_objectSpread({
    "data-slot": "toggle-group-item",
    "data-variant": context.variant || variant,
    "data-size": context.size || size,
    className: (0, cn)((0, toggleVariants)({
      variant: context.variant || variant,
      size: context.size || size
    }), "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l", className)
  }, props), {}, {
    children: children
  }));
}

export default _interopRequireWildcard;