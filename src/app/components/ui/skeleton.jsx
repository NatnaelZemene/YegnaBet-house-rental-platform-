import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Skeleton(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return "div", _objectSpread({
    "data-slot": "skeleton",
    className: (0, cn)("bg-accent animate-pulse rounded-md", className)
  }, props));
}

export default _defineProperty;