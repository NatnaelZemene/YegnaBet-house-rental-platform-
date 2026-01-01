"use client";

  import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className", "align", "alignOffset", "sideOffset"],
  _excluded4 = ["className", "inset", "variant"],
  _excluded5 = ["className", "children", "checked"],
  _excluded6 = ["className", "children"],
  _excluded7 = ["className", "inset"],
  _excluded8 = ["className"],
  _excluded9 = ["className"],
  _excluded0 = ["className", "inset", "children"],
  _excluded1 = ["className"];
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Menubar(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return MenubarPrimitive.Root, _objectSpread({
    "data-slot": "menubar",
    className: (0, cn)("bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs", className)
  }, props));
}
function MenubarMenu(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return MenubarPrimitive.Menu, _objectSpread({
    "data-slot": "menubar-menu"
  }, props));
}
function MenubarGroup(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return MenubarPrimitive.Group, _objectSpread({
    "data-slot": "menubar-group"
  }, props));
}
function MenubarPortal(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return MenubarPrimitive.Portal, _objectSpread({
    "data-slot": "menubar-portal"
  }, props));
}
function MenubarRadioGroup(_ref5) {
  const props = { ...(_objectDestructuringEmpty(_ref5 }, _ref5));
  return MenubarPrimitive.RadioGroup, _objectSpread({
    "data-slot": "menubar-radio-group"
  }, props));
}
function MenubarTrigger(_ref6) {
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded2);
  return MenubarPrimitive.Trigger, _objectSpread({
    "data-slot": "menubar-trigger",
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none", className)
  }, props));
}
function MenubarContent(_ref7) {
  const {
      className,
      align = "start",
      alignOffset = -4,
      sideOffset = 8
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded3);
  return MenubarPortal, {
    children: MenubarPrimitive.Content, _objectSpread({
      "data-slot": "menubar-content",
      align: align,
      alignOffset: alignOffset,
      sideOffset: sideOffset,
      className: (0, cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md", className)
    }, props))
  });
}
function MenubarItem(_ref8) {
  const {
      className,
      inset,
      variant = "default"
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded4);
  return MenubarPrimitive.Item, _objectSpread({
    "data-slot": "menubar-item",
    "data-inset": inset,
    "data-variant": variant,
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props));
}
function MenubarCheckboxItem(_ref9) {
  const {
      className,
      children,
      checked
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded5);
  return MenubarPrimitive.CheckboxItem, _objectSpread(_objectSpread({
    "data-slot": "menubar-checkbox-item",
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
    checked: checked
  }, props), {}, {
    children: [<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" children="/*#__PURE__*/(0" {
        children="/*#__PURE__*/(0" {
          className="size-4" />
      })
    }), children]
  }));
}
function MenubarRadioItem(_ref0) {
  const {
      className,
      children
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded6);
  return MenubarPrimitive.RadioItem, _objectSpread(_objectSpread({
    "data-slot": "menubar-radio-item",
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props), {}, {
    children: [<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" children="/*#__PURE__*/(0" {
        children="/*#__PURE__*/(0" {
          className="size-2 fill-current" />
      })
    }), children]
  }));
}
function MenubarLabel(_ref1) {
  const {
      className,
      inset
    } = _ref1,
    props = _objectWithoutProperties(_ref1, _excluded7);
  return MenubarPrimitive.Label, _objectSpread({
    "data-slot": "menubar-label",
    "data-inset": inset,
    className: (0, cn)("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)
  }, props));
}
function MenubarSeparator(_ref10) {
  const {
      className
    } = _ref10,
    props = _objectWithoutProperties(_ref10, _excluded8);
  return MenubarPrimitive.Separator, _objectSpread({
    "data-slot": "menubar-separator",
    className: (0, cn)("bg-border -mx-1 my-1 h-px", className)
  }, props));
}
function MenubarShortcut(_ref11) {
  const {
      className
    } = _ref11,
    props = _objectWithoutProperties(_ref11, _excluded9);
  return "span", _objectSpread({
    "data-slot": "menubar-shortcut",
    className: (0, cn)("text-muted-foreground ml-auto text-xs tracking-widest", className)
  }, props));
}
function MenubarSub(_ref12) {
  const props = { ...(_objectDestructuringEmpty(_ref12 }, _ref12));
  return MenubarPrimitive.Sub, _objectSpread({
    "data-slot": "menubar-sub"
  }, props));
}
function MenubarSubTrigger(_ref13) {
  const {
      className,
      inset,
      children
    } = _ref13,
    props = _objectWithoutProperties(_ref13, _excluded0);
  return MenubarPrimitive.SubTrigger, _objectSpread(_objectSpread({
    "data-slot": "menubar-sub-trigger",
    "data-inset": inset,
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8", className)
  }, props), {}, {
    children: [children, <ChevronRightIcon className="ml-auto h-4 w-4" />]
  }));
}
function MenubarSubContent(_ref14) {
  const {
      className
    } = _ref14,
    props = _objectWithoutProperties(_ref14, _excluded1);
  return MenubarPrimitive.SubContent, _objectSpread({
    "data-slot": "menubar-sub-content",
    className: (0, cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", className)
  }, props));
}

export default _interopRequireWildcard;