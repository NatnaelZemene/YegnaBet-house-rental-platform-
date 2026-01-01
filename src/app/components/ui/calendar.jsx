"use client";

  import * as React from "react";
import * as LucideIcons from 'lucide-react';
import { reactDayPicker } from 'react-day-picker';
import { cn } from './utils';
import { Button } from './button';

const _excluded = ["className", "classNames", "showOutsideDays"],
  _excluded2 = ["className"],
  _excluded3 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Calendar(_ref) {
  const {
      className,
      classNames,
      showOutsideDays = true
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return DayPicker, _objectSpread({
    showOutsideDays: showOutsideDays,
    className: (0, cn)("p-3", className),
    classNames: _objectSpread({
      months: "flex flex-col sm:flex-row gap-2",
      month: "flex flex-col gap-4",
      caption: "flex justify-center pt-1 relative items-center w-full",
      caption_label: "text-sm font-medium",
      nav: "flex items-center gap-1",
      nav_button: (0, cn)((0, buttonVariants)({
        variant: "outline"
      }), "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-x-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: (0, cn)("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md", props.mode === "range" ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" : "[&:has([aria-selected])]:rounded-md"),
      day: (0, cn)((0, buttonVariants)({
        variant: "ghost"
      }), "size-8 p-0 font-normal aria-selected:opacity-100"),
      day_range_start: "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
      day_range_end: "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible"
    }, classNames),
    components: {
      IconLeft: _ref2 => {
        const {
            className
          } = _ref2,
          props = _objectWithoutProperties(_ref2, _excluded2);
        return ChevronLeft, _objectSpread({
          className: (0, cn)("size-4", className)
        }, props));
      },
      IconRight: _ref3 => {
        const {
            className
          } = _ref3,
          props = _objectWithoutProperties(_ref3, _excluded3);
        return ChevronRight, _objectSpread({
          className: (0, cn)("size-4", className)
        }, props));
      }
    }
  }, props));
}

export default _interopRequireWildcard;