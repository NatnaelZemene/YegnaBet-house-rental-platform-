import React from "react";
"use client";

  import * as React from "react";
const _emblaCarouselReact = _interopRequireDefault(require("embla-carousel-react"));
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';
import { Button } from './button';

const _excluded = ["orientation", "opts", "setApi", "plugins", "className", "children"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className", "variant", "size"],
  _excluded5 = ["className", "variant", "size"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
const CarouselContext = /*#__PURE__*/React.createContext(null);
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
function Carousel(_ref) {
  const {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  const [carouselRef, api] = (0, default)({ ...opts, 
    axis: orientation === "horizontal" ? "x" : "y"
   }, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const onSelect = React.useCallback(api => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);
  const scrollPrev = React.useCallback(() => {
    api === null || api === void 0 || api.scrollPrev();
  }, [api]);
  const scrollNext = React.useCallback(() => {
    api === null || api === void 0 || api.scrollNext();
  }, [api]);
  const handleKeyDown = React.useCallback(event => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  }, [scrollPrev, scrollNext]);
  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);
  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api === null || api === void 0 || api.off("select", onSelect);
    };
  }, [api, onSelect]);
  return CarouselContext.Provider, {
    value: {
      carouselRef,
      api: api,
      opts,
      orientation: orientation || ((opts === null || opts === void 0 ? void 0 : opts.axis) === "y" ? "vertical" : "horizontal"),
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext
    },
    children: "div", _objectSpread(_objectSpread({
      onKeyDownCapture: handleKeyDown,
      className: (0, cn)("relative", className),
      role: "region",
      "aria-roledescription": "carousel",
      "data-slot": "carousel"
    }, props), {}, {
      children: children
    }))
  });
}
function CarouselContent(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  const {
    carouselRef,
    orientation
  } = useCarousel();
  return "div", {
    ref: carouselRef,
    className: "overflow-hidden",
    "data-slot": "carousel-content",
    children: "div", _objectSpread({
      className: (0, cn)("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)
    }, props))
  });
}
function CarouselItem(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  const {
    orientation
  } = useCarousel();
  return "div", _objectSpread({
    role: "group",
    "aria-roledescription": "slide",
    "data-slot": "carousel-item",
    className: (0, cn)("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)
  }, props));
}
function CarouselPrevious(_ref4) {
  const {
      className,
      variant = "outline",
      size = "icon"
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  const {
    orientation,
    scrollPrev,
    canScrollPrev
  } = useCarousel();
  return Button, _objectSpread(_objectSpread({
    "data-slot": "carousel-previous",
    variant: variant,
    size: size,
    className: (0, cn)("absolute size-8 rounded-full", orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className),
    disabled: !canScrollPrev,
    onClick: scrollPrev
  }, props), {}, {
    children: [<ArrowLeft />, <span className="sr-only">Previous slide</span>]
  }));
}
function CarouselNext(_ref5) {
  const {
      className,
      variant = "outline",
      size = "icon"
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded5);
  const {
    orientation,
    scrollNext,
    canScrollNext
  } = useCarousel();
  return Button, _objectSpread(_objectSpread({
    "data-slot": "carousel-next",
    variant: variant,
    size: size,
    className: (0, cn)("absolute size-8 rounded-full", orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className),
    disabled: !canScrollNext,
    onClick: scrollNext
  }, props), {}, {
    children: [<ArrowRight />, <span className="sr-only">Next slide</span>]
  }));
}

export default _interopRequireWildcard;