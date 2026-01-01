import * as React from "react";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Textarea(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return "textarea", _objectSpread({
    "data-slot": "textarea",
    className: (0, cn)("resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)
  }, props));
}

export default _interopRequireWildcard;