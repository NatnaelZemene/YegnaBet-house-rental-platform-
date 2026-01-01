import React from "react";
"use client";

  import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from './utils';

function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Slider(_ref) {
  const {
      className,
      defaultValue,
      value,
      min = 0,
      max = 100
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  const _values = React.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max], [value, defaultValue, min, max]);
  return SliderPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "slider",
    defaultValue: defaultValue,
    value: value,
    min: min,
    max: max,
    className: (0, cn)("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", className)
  }, props), {}, {
    children: [<SliderPrimitive.Track data-slot="slider-track" className="(0" cn)(bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]="h-4 data-[orientation=horizontal]" children="/*#__PURE__*/(0" {
        data-slot="slider-range" className="(0" cn)(bg-primary absolute data-[orientation=horizontal]="h-full data-[orientation=vertical]" />
    }), Array.from({
      length: length
    }, (_, index) => SliderPrimitive.Thumb, {
      "data-slot": "slider-thumb",
      className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
    }, index))]
  }));
}

export default _interopRequireWildcard;