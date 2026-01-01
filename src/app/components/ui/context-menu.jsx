"use client";

  import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className", "inset", "children"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className", "inset", "variant"],
  _excluded5 = ["className", "children", "checked"],
  _excluded6 = ["className", "children"],
  _excluded7 = ["className", "inset"],
  _excluded8 = ["className"],
  _excluded9 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function ContextMenu(_ref) {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return ContextMenuPrimitive.Root, _objectSpread({
    "data-slot": "context-menu"
  }, props));
}
function ContextMenuTrigger(_ref2) {
  const props = { ...(_objectDestructuringEmpty(_ref2 }, _ref2));
  return ContextMenuPrimitive.Trigger, _objectSpread({
    "data-slot": "context-menu-trigger"
  }, props));
}
function ContextMenuGroup(_ref3) {
  const props = { ...(_objectDestructuringEmpty(_ref3 }, _ref3));
  return ContextMenuPrimitive.Group, _objectSpread({
    "data-slot": "context-menu-group"
  }, props));
}
function ContextMenuPortal(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return ContextMenuPrimitive.Portal, _objectSpread({
    "data-slot": "context-menu-portal"
  }, props));
}
function ContextMenuSub(_ref5) {
  const props = { ...(_objectDestructuringEmpty(_ref5 }, _ref5));
  return ContextMenuPrimitive.Sub, _objectSpread({
    "data-slot": "context-menu-sub"
  }, props));
}
function ContextMenuRadioGroup(_ref6) {
  const props = { ...(_objectDestructuringEmpty(_ref6 }, _ref6));
  return ContextMenuPrimitive.RadioGroup, _objectSpread({
    "data-slot": "context-menu-radio-group"
  }, props));
}
function ContextMenuSubTrigger(_ref7) {
  const {
      className,
      inset,
      children
    } = _ref7,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref7);
  return ContextMenuPrimitive.SubTrigger, _objectSpread(_objectSpread({
    "data-slot": "context-menu-sub-trigger",
    "data-inset": inset,
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props), {}, {
    children: [children, <ChevronRightIcon className="ml-auto" />]
  }));
}
function ContextMenuSubContent(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded2);
  return ContextMenuPrimitive.SubContent, _objectSpread({
    "data-slot": "context-menu-sub-content",
    className: (0, cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", className)
  }, props));
}
function ContextMenuContent(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded3);
  return ContextMenuPrimitive.Portal, {
    children: ContextMenuPrimitive.Content, _objectSpread({
      "data-slot": "context-menu-content",
      className: (0, cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className)
    }, props))
  });
}
function ContextMenuItem(_ref0) {
  const {
      className,
      inset,
      variant = "default"
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded4);
  return ContextMenuPrimitive.Item, _objectSpread({
    "data-slot": "context-menu-item",
    "data-inset": inset,
    "data-variant": variant,
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props));
}
function ContextMenuCheckboxItem(_ref1) {
  const {
      className,
      children,
      checked
    } = _ref1,
    props = _objectWithoutProperties(_ref1, _excluded5);
  return ContextMenuPrimitive.CheckboxItem, _objectSpread(_objectSpread({
    "data-slot": "context-menu-checkbox-item",
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
    checked: checked
  }, props), {}, {
    children: [<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" children="/*#__PURE__*/(0" {
        children="/*#__PURE__*/(0" {
          className="size-4" />
      })
    }), children]
  }));
}
function ContextMenuRadioItem(_ref10) {
  const {
      className,
      children
    } = _ref10,
    props = _objectWithoutProperties(_ref10, _excluded6);
  return ContextMenuPrimitive.RadioItem, _objectSpread(_objectSpread({
    "data-slot": "context-menu-radio-item",
    className: (0, cn)("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props), {}, {
    children: [<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" children="/*#__PURE__*/(0" {
        children="/*#__PURE__*/(0" {
          className="size-2 fill-current" />
      })
    }), children]
  }));
}
function ContextMenuLabel(_ref11) {
  const {
      className,
      inset
    } = _ref11,
    props = _objectWithoutProperties(_ref11, _excluded7);
  return ContextMenuPrimitive.Label, _objectSpread({
    "data-slot": "context-menu-label",
    "data-inset": inset,
    className: (0, cn)("text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)
  }, props));
}
function ContextMenuSeparator(_ref12) {
  const {
      className
    } = _ref12,
    props = _objectWithoutProperties(_ref12, _excluded8);
  return ContextMenuPrimitive.Separator, _objectSpread({
    "data-slot": "context-menu-separator",
    className: (0, cn)("bg-border -mx-1 my-1 h-px", className)
  }, props));
}
function ContextMenuShortcut(_ref13) {
  const {
      className
    } = _ref13,
    props = _objectWithoutProperties(_ref13, _excluded9);
  return "span", _objectSpread({
    "data-slot": "context-menu-shortcut",
    className: (0, cn)("text-muted-foreground ml-auto text-xs tracking-widest", className)
  }, props));
}

export default _interopRequireWildcard;