import React from "react";
"use client";

  import * as React from "react";
import { inputOtp } from 'input-otp';
import * as LucideIcons from 'lucide-react';
import { cn } from './utils';

const _excluded = ["className", "containerClassName"],
  _excluded2 = ["className"],
  _excluded3 = ["index", "className"];
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function InputOTP(_ref) {
  const {
      className,
      containerClassName
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  return OTPInput, _objectSpread({
    "data-slot": "input-otp",
    containerClassName: (0, cn)("flex items-center gap-2 has-disabled:opacity-50", containerClassName),
    className: (0, cn)("disabled:cursor-not-allowed", className)
  }, props));
}
function InputOTPGroup(_ref2) {
  const {
      className
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  return "div", _objectSpread({
    "data-slot": "input-otp-group",
    className: (0, cn)("flex items-center gap-1", className)
  }, props));
}
function InputOTPSlot(_ref3) {
  const _inputOTPContext$slot;
  const {
      index,
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  const inputOTPContext = React.useContext(OTPInputContext);
  const {
    char,
    hasFakeCaret,
    isActive
  } = (_inputOTPContext$slot = inputOTPContext === null || inputOTPContext === void 0 ? void 0 : inputOTPContext.slots[index]) !== null && _inputOTPContext$slot !== void 0 ? _inputOTPContext$slot : {};
  return "div", _objectSpread(_objectSpread({
    "data-slot": "input-otp-slot",
    "data-active": isActive,
    className: (0, cn)("data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm bg-input-background transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]", className)
  }, props), {}, {
    children: [char, hasFakeCaret && <div className="pointer-events-none absolute inset-0 flex items-center justify-center" children="/*#__PURE__*/(0" {
        className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
    })]
  }));
}
function InputOTPSeparator(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  return "div", _objectSpread(_objectSpread({
    "data-slot": "input-otp-separator",
    role: "separator"
  }, props), {}, {
    children: <MinusIcon />
  }));
}

export default _interopRequireWildcard;