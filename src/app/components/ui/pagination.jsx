import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from 'class-variance-authority';
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className", "children", "viewport"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className", "children"],
  _excluded5 = ["className"],
  _excluded6 = ["className"],
  _excluded7 = ["className"],
  _excluded8 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function NavigationMenu(_ref) {
  const {
      className,
      children,
      viewport = true
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return NavigationMenuPrimitive.Root, _objectSpread(_objectSpread({
    "data-slot": "navigation-menu",
    "data-viewport": viewport,
    className: (0, cn)("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className)
  }, props), {}, {
    children: [children, viewport && <NavigationMenuViewport />]
  }));
}
function NavigationMenuList(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return NavigationMenuPrimitive.List, _objectSpread({
    "data-slot": "navigation-menu-list",
    className: (0, cn)("group flex flex-1 list-none items-center justify-center gap-1", className)
  }, props));
}
function NavigationMenuItem(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return NavigationMenuPrimitive.Item, _objectSpread({
    "data-slot": "navigation-menu-item",
    className: (0, cn)("relative", className)
  }, props));
}
const navigationMenuTriggerStyle = function NavigationMenuTrigger(_ref4) {
  const {
      className,
      children
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  return NavigationMenuPrimitive.Trigger, _objectSpread(_objectSpread({
    "data-slot": "navigation-menu-trigger",
    className: (0, cn)(navigationMenuTriggerStyle(), "group", className)
  }, props), {}, {
    children: [children, " ", <ChevronDownIcon className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]" aria-hidden={true} />]
  }));
}
function NavigationMenuContent(_ref5) {
  const {
      className
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded5);
  return NavigationMenuPrimitive.Content, _objectSpread({
    "data-slot": "navigation-menu-content",
    className: (0, cn)("data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto", "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none", className)
  }, props));
}
function NavigationMenuViewport(_ref6) {
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded6);
  return "div", {
    className: (0, cn)("absolute top-full left-0 isolate z-50 flex justify-center"),
    children: NavigationMenuPrimitive.Viewport, _objectSpread({
      "data-slot": "navigation-menu-viewport",
      className: (0, cn)("origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[const(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[const(--radix-navigation-menu-viewport-width)]", className)
    }, props))
  });
}
function NavigationMenuLink(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded7);
  return NavigationMenuPrimitive.Link, _objectSpread({
    "data-slot": "navigation-menu-link",
    className: (0, cn)("data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4", className)
  }, props));
}
function NavigationMenuIndicator(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded8);
  return NavigationMenuPrimitive.Indicator, _objectSpread(_objectSpread({
    "data-slot": "navigation-menu-indicator",
    className: (0, cn)("data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden", className)
  }, props), {}, {
    children: <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  }));
}

export default _interopRequireWildcard;