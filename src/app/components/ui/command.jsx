"use client";

  import * as React from "react";
import { cmdk } from 'cmdk';
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';
import { Dialog } from './dialog';

const _excluded = ["className"],
  _excluded2 = ["title", "description", "children"],
  _excluded3 = ["className"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"],
  _excluded7 = ["className"],
  _excluded8 = ["className"];
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Command(_ref) {
  const {
      className
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return Command, _objectSpread({
    "data-slot": "command",
    className: (0, cn)("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className)
  }, props));
}
function CommandDialog(_ref2) {
  const {
      title = "Command Palette",
      description = "Search for a command to run...",
      children
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return Dialog, _objectSpread({ ...props }, {}, {
    children: [DialogHeader, {
      className: "sr-only",
      children: [<DialogTitle>{title}</DialogTitle>, <DialogDescription>{description}</DialogDescription>]
    }), <DialogContent className="overflow-hidden p-0" children="/*#__PURE__*/(0" {
        className="[&_[cmdk-group-heading]]" >{children}< />
    })]
  }));
}
function CommandInput(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  return <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">{[<SearchIcon className="size-4 shrink-0 opacity-50" />, Command.Input, _objectSpread({
      "data-slot": "command-input",
      className: (0, cn)("placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className)
    }, props))]}</div>;
}
function CommandList(_ref4) {
  const {
      className
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  return Command.List, _objectSpread({
    "data-slot": "command-list",
    className: (0, cn)("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)
  }, props));
}
function CommandEmpty(_ref5) {
  const props = { ...(_objectDestructuringEmpty(_ref5 }, _ref5));
  return Command.Empty, _objectSpread({
    "data-slot": "command-empty",
    className: "py-6 text-center text-sm"
  }, props));
}
function CommandGroup(_ref6) {
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded5);
  return Command.Group, _objectSpread({
    "data-slot": "command-group",
    className: (0, cn)("text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium", className)
  }, props));
}
function CommandSeparator(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded6);
  return Command.Separator, _objectSpread({
    "data-slot": "command-separator",
    className: (0, cn)("bg-border -mx-1 h-px", className)
  }, props));
}
function CommandItem(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded7);
  return Command.Item, _objectSpread({
    "data-slot": "command-item",
    className: (0, cn)("data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)
  }, props));
}
function CommandShortcut(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded8);
  return "span", _objectSpread({
    "data-slot": "command-shortcut",
    className: (0, cn)("text-muted-foreground ml-auto text-xs tracking-widest", className)
  }, props));
}
"use client";

export default _interopRequireWildcard;