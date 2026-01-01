import * as React from "react";
import { cva } from 'class-variance-authority';
import { cn } from './utils';

const _excluded = ["className", "variant"],
  _excluded2 = ["className"],
  _excluded3 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
const alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(const(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});
function Alert(_ref) {
  const {
      className,
      variant
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return "div", _objectSpread({
    "data-slot": "alert",
    role: "alert",
    className: (0, cn)(alertVariants({
      variant
    }), className)
  }, props));
}
function AlertTitle(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return "div", _objectSpread({
    "data-slot": "alert-title",
    className: (0, cn)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)
  }, props));
}
function AlertDescription(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return "div", _objectSpread({
    "data-slot": "alert-description",
    className: (0, cn)("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)
  }, props));
}

export default _interopRequireWildcard;