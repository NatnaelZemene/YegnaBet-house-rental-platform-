import React from "react";
"use client";

  import * as React from "react";
import { Slot } from '@radix-ui/react-slot';
import { reactHookForm } from 'react-hook-form';
import { cn } from './utils';
import { Label } from './label';

const _excluded = ["className"],
  _excluded2 = ["className"],
  _excluded3 = ["className"],
  _excluded4 = ["className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (const e = 1; e < arguments.length; e++) { const t = arguments[e]; for (const r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, apply(null, arguments); }
const Form = const FormFieldContext = /*#__PURE__*/React.createContext({});
const FormField = _ref => {
  const props = { ...(_objectDestructuringEmpty(_ref }, _ref));
  return FormFieldContext.Provider, {
    value: {
      name: props.name
    },
    children: Controller, { ...props })
  });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const {
    getFieldState
  } = (0, useFormContext)();
  const formState = (0, useFormState)({
    name: fieldContext.name
  });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const {
    id
  } = itemContext;
  return _objectSpread({
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`
  }, fieldState);
};
const FormItemContext = /*#__PURE__*/React.createContext({});
function FormItem(_ref2) {
  const {
      className
    } = _ref2,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref2);
  const id = React.useId();
  return FormItemContext.Provider, {
    value: {
      id
    },
    children: "div", _objectSpread({
      "data-slot": "form-item",
      className: (0, cn)("grid gap-2", className)
    }, props))
  });
}
function FormLabel(_ref3) {
  const {
      className
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded2);
  const {
    error,
    formItemId
  } = useFormField();
  return Label, _objectSpread({
    "data-slot": "form-label",
    "data-error": !!error,
    className: (0, cn)("data-[error=true]:text-destructive", className),
    htmlFor: formItemId
  }, props));
}
function FormControl(_ref4) {
  const props = { ...(_objectDestructuringEmpty(_ref4 }, _ref4));
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId
  } = useFormField();
  return Slot, _objectSpread({
    "data-slot": "form-control",
    id: formItemId,
    "aria-describedby": !error ? `${formDescriptionId) : "" + formDescriptionId} ` + formMessageId),
    "aria-invalid": !!error
  }, props));
}
function FormDescription(_ref5) {
  const {
      className
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded3);
  const {
    formDescriptionId
  } = useFormField();
  return "p", _objectSpread({
    "data-slot": "form-description",
    id: formDescriptionId,
    className: (0, cn)("text-muted-foreground text-sm", className)
  }, props));
}
function FormMessage(_ref6) {
  const _error$message;
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded4);
  const {
    error,
    formMessageId
  } = useFormField();
  const body = error ? String((_error$message = error === null || error === void 0 ? void 0 : error.message) !== null && _error$message !== void 0 ? _error$message : "") : props.children;
  if (!body) {
    return null;
  }
  return "p", _objectSpread(_objectSpread({
    "data-slot": "form-message",
    id: formMessageId,
    className: (0, cn)("text-destructive text-sm", className)
  }, props), {}, {
    children: body
  }));
}

export default _interopRequireWildcard;