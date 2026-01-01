import React from "react";
"use client";

  import * as React from "react";
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as LucideIcons from 'lucide-react';
import { UseMobile } from './use-mobile';
import { cn } from './utils';
import { Button } from './button';
import { Input } from './input';
import { Separator } from './separator';
import { Sheet } from './sheet';
import { Skeleton } from './skeleton';
import { Tooltip } from './tooltip';

const _excluded = ["defaultOpen", "open", "onOpenChange", "className", "style", "children"],
  _excluded2 = ["side", "variant", "collapsible", "className", "children"],
  _excluded3 = ["className", "onClick"],
  _excluded4 = ["className"],
  _excluded5 = ["className"],
  _excluded6 = ["className"],
  _excluded7 = ["className"],
  _excluded8 = ["className"],
  _excluded9 = ["className"],
  _excluded0 = ["className"],
  _excluded1 = ["className"],
  _excluded10 = ["className", "asChild"],
  _excluded11 = ["className", "asChild"],
  _excluded12 = ["className"],
  _excluded13 = ["className"],
  _excluded14 = ["className"],
  _excluded15 = ["asChild", "isActive", "variant", "size", "tooltip", "className"],
  _excluded16 = ["className", "asChild", "showOnHover"],
  _excluded17 = ["className"],
  _excluded18 = ["className", "showIcon"],
  _excluded19 = ["className"],
  _excluded20 = ["className"],
  _excluded21 = ["asChild", "size", "isActive", "className"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = /*#__PURE__*/React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider(_ref) {
  const {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children
    } = _ref,
    props = (({ className, variant, size, asChild, ...props }) => props)(_ref);
  const isMobile = (0, useIsMobile)();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp !== null && openProp !== void 0 ? openProp : _open;
  const setOpen = React.useCallback(value => {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) {
      setOpenProp(openState);
    } else {
      _setOpen(openState);
    }

    // This sets the cookie to keep the sidebar state.
    document.cookie = `${SIDEBAR_COOKIE_NAME}=` + openState, "; path=/; max-age=") + SIDEBAR_COOKIE_MAX_AGE);
  }, [setOpenProp, open]);

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar
  }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);
  return SidebarContext.Provider, {
    value: contextValue,
    children: TooltipProvider, {
      delayDuration: 0,
      children: "div", _objectSpread(_objectSpread({
        "data-slot": "sidebar-wrapper",
        style: _objectSpread({
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON
        }, style),
        className: (0, cn)("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)
      }, props), {}, {
        children: children
      }))
    })
  });
}
function Sidebar(_ref2) {
  const {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children
    } = _ref2,
    props = _objectWithoutProperties(_ref2, _excluded2);
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile
  } = useSidebar();
  if (collapsible === "none") {
    return "div", _objectSpread(_objectSpread({
      "data-slot": "sidebar",
      className: (0, cn)("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)
    }, props), {}, {
      children: children
    }));
  }
  if (isMobile) {
    return Sheet, _objectSpread(_objectSpread({
      open: openMobile,
      onOpenChange: setOpenMobile
    }, props), {}, {
      children: SheetContent, {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side: side,
        children: [SheetHeader, {
          className: "sr-only",
          children: [<SheetTitle>{Sidebar}</SheetTitle>, <SheetDescription>Displays the mobile sidebar.</SheetDescription>]
        }), <div className="flex h-full w-full flex-col" >{children}< />]
      })
    }));
  }
  return "div", {
    className: "group peer text-sidebar-foreground hidden md:block",
    "data-state": state,
    "data-collapsible": state === "collapsed" ? collapsible : "",
    "data-variant": variant,
    "data-side": side,
    "data-slot": "sidebar",
    children: [<div data-slot="sidebar-gap" className="(0" group-data-[collapsible=offcanvas]="w-0" group-data-[side=right]="rotate-180" variant === floating || variant === inset ? group-data-[collapsible=icon]="w-[calc(const(--sidebar-width-icon)+(--spacing(4)))]" />, "div", _objectSpread(_objectSpread({
      "data-slot": "sidebar-container",
      className: (0, cn)("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(const(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(const(--sidebar-width)*-1)]",
      // Adjust the padding for floating and inset variants.
      variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(const(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className)
    }, props), {}, {
      children: <div data-sidebar={sidebar} data-slot="sidebar-inner" className="bg-sidebar group-data-[variant=floating]" >{children}< />
    }))]
  });
}
function SidebarTrigger(_ref3) {
  const {
      className,
      onClick: _onClick
    } = _ref3,
    props = _objectWithoutProperties(_ref3, _excluded3);
  const {
    toggleSidebar
  } = useSidebar();
  return Button, _objectSpread(_objectSpread({
    "data-sidebar": "trigger",
    "data-slot": "sidebar-trigger",
    variant: "ghost",
    size: "icon",
    className: (0, cn)("size-7", className),
    onClick: event => {
      _onClick === null || _onClick === void 0 || _onClick(event);
      toggleSidebar();
    }
  }, props), {}, {
    children: [<PanelLeftIcon />, <span className="sr-only">Toggle Sidebar</span>]
  }));
}
function SidebarRail(_ref4) {
  const {
      className
    } = _ref4,
    props = _objectWithoutProperties(_ref4, _excluded4);
  const {
    toggleSidebar
  } = useSidebar();
  return "button", _objectSpread({
    "data-sidebar": "rail",
    "data-slot": "sidebar-rail",
    "aria-label": "Toggle Sidebar",
    tabIndex: -1,
    onClick: toggleSidebar,
    title: "Toggle Sidebar",
    className: (0, cn)("hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className)
  }, props));
}
function SidebarInset(_ref5) {
  const {
      className
    } = _ref5,
    props = _objectWithoutProperties(_ref5, _excluded5);
  return "main", _objectSpread({
    "data-slot": "sidebar-inset",
    className: (0, cn)("bg-background relative flex w-full flex-1 flex-col", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", className)
  }, props));
}
function SidebarInput(_ref6) {
  const {
      className
    } = _ref6,
    props = _objectWithoutProperties(_ref6, _excluded6);
  return Input, _objectSpread({
    "data-slot": "sidebar-input",
    "data-sidebar": "input",
    className: (0, cn)("bg-background h-8 w-full shadow-none", className)
  }, props));
}
function SidebarHeader(_ref7) {
  const {
      className
    } = _ref7,
    props = _objectWithoutProperties(_ref7, _excluded7);
  return "div", _objectSpread({
    "data-slot": "sidebar-header",
    "data-sidebar": "header",
    className: (0, cn)("flex flex-col gap-2 p-2", className)
  }, props));
}
function SidebarFooter(_ref8) {
  const {
      className
    } = _ref8,
    props = _objectWithoutProperties(_ref8, _excluded8);
  return "div", _objectSpread({
    "data-slot": "sidebar-footer",
    "data-sidebar": "footer",
    className: (0, cn)("flex flex-col gap-2 p-2", className)
  }, props));
}
function SidebarSeparator(_ref9) {
  const {
      className
    } = _ref9,
    props = _objectWithoutProperties(_ref9, _excluded9);
  return Separator, _objectSpread({
    "data-slot": "sidebar-separator",
    "data-sidebar": "separator",
    className: (0, cn)("bg-sidebar-border mx-2 w-auto", className)
  }, props));
}
function SidebarContent(_ref0) {
  const {
      className
    } = _ref0,
    props = _objectWithoutProperties(_ref0, _excluded0);
  return "div", _objectSpread({
    "data-slot": "sidebar-content",
    "data-sidebar": "content",
    className: (0, cn)("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)
  }, props));
}
function SidebarGroup(_ref1) {
  const {
      className
    } = _ref1,
    props = _objectWithoutProperties(_ref1, _excluded1);
  return "div", _objectSpread({
    "data-slot": "sidebar-group",
    "data-sidebar": "group",
    className: (0, cn)("relative flex w-full min-w-0 flex-col p-2", className)
  }, props));
}
function SidebarGroupLabel(_ref10) {
  const {
      className,
      asChild = false
    } = _ref10,
    props = _objectWithoutProperties(_ref10, _excluded10);
  const Comp = asChild ? Slot : "div";
  return Comp, _objectSpread({
    "data-slot": "sidebar-group-label",
    "data-sidebar": "group-label",
    className: (0, cn)("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className)
  }, props));
}
function SidebarGroupAction(_ref11) {
  const {
      className,
      asChild = false
    } = _ref11,
    props = _objectWithoutProperties(_ref11, _excluded11);
  const Comp = asChild ? Slot : "button";
  return Comp, _objectSpread({
    "data-slot": "sidebar-group-action",
    "data-sidebar": "group-action",
    className: (0, cn)("text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    // Increases the hit area of the button on mobile.
    "after:absolute after:-inset-2 md:after:hidden", "group-data-[collapsible=icon]:hidden", className)
  }, props));
}
function SidebarGroupContent(_ref12) {
  const {
      className
    } = _ref12,
    props = _objectWithoutProperties(_ref12, _excluded12);
  return "div", _objectSpread({
    "data-slot": "sidebar-group-content",
    "data-sidebar": "group-content",
    className: (0, cn)("w-full text-sm", className)
  }, props));
}
function SidebarMenu(_ref13) {
  const {
      className
    } = _ref13,
    props = _objectWithoutProperties(_ref13, _excluded13);
  return "ul", _objectSpread({
    "data-slot": "sidebar-menu",
    "data-sidebar": "menu",
    className: (0, cn)("flex w-full min-w-0 flex-col gap-1", className)
  }, props));
}
function SidebarMenuItem(_ref14) {
  const {
      className
    } = _ref14,
    props = _objectWithoutProperties(_ref14, _excluded14);
  return "li", _objectSpread({
    "data-slot": "sidebar-menu-item",
    "data-sidebar": "menu-item",
    className: (0, cn)("group/menu-item relative", className)
  }, props));
}
const sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background shadow-[0_0_0_1px_hsl(const(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(const(--sidebar-accent))]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
function SidebarMenuButton(_ref15) {
  const {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className
    } = _ref15,
    props = _objectWithoutProperties(_ref15, _excluded15);
  const Comp = asChild ? Slot : "button";
  const {
    isMobile,
    state
  } = useSidebar();
  const button = Comp, _objectSpread({
    "data-slot": "sidebar-menu-button",
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-active": isActive,
    className: (0, cn)(sidebarMenuButtonVariants({
      variant,
      size
    }), className)
  }, props));
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return Tooltip, {
    children: [<TooltipTrigger asChild={true} >{button}< />, TooltipContent, _objectSpread({
      side: "right",
      align: "center",
      hidden: state !== "collapsed" || isMobile
    }, tooltip))]
  });
}
function SidebarMenuAction(_ref16) {
  const {
      className,
      asChild = false,
      showOnHover = false
    } = _ref16,
    props = _objectWithoutProperties(_ref16, _excluded16);
  const Comp = asChild ? Slot : "button";
  return Comp, _objectSpread({
    "data-slot": "sidebar-menu-action",
    "data-sidebar": "menu-action",
    className: (0, cn)("text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    // Increases the hit area of the button on mobile.
    "after:absolute after:-inset-2 md:after:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0", className)
  }, props));
}
function SidebarMenuBadge(_ref17) {
  const {
      className
    } = _ref17,
    props = _objectWithoutProperties(_ref17, _excluded17);
  return "div", _objectSpread({
    "data-slot": "sidebar-menu-badge",
    "data-sidebar": "menu-badge",
    className: (0, cn)("text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className)
  }, props));
}
function SidebarMenuSkeleton(_ref18) {
  const {
      className,
      showIcon = false
    } = _ref18,
    props = _objectWithoutProperties(_ref18, _excluded18);
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return "div", _objectSpread(_objectSpread({
    "data-slot": "sidebar-menu-skeleton",
    "data-sidebar": "menu-skeleton",
    className: (0, cn)("flex h-8 items-center gap-2 rounded-md px-2", className)
  }, props), {}, {
    children: [showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />, Skeleton, {
      className: "h-4 max-w-(--skeleton-width) flex-1",
      "data-sidebar": "menu-skeleton-text",
      style: {
        "--skeleton-width": width
      }
    })]
  }));
}
function SidebarMenuSub(_ref19) {
  const {
      className
    } = _ref19,
    props = _objectWithoutProperties(_ref19, _excluded19);
  return "ul", _objectSpread({
    "data-slot": "sidebar-menu-sub",
    "data-sidebar": "menu-sub",
    className: (0, cn)("border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className)
  }, props));
}
function SidebarMenuSubItem(_ref20) {
  const {
      className
    } = _ref20,
    props = _objectWithoutProperties(_ref20, _excluded20);
  return "li", _objectSpread({
    "data-slot": "sidebar-menu-sub-item",
    "data-sidebar": "menu-sub-item",
    className: (0, cn)("group/menu-sub-item relative", className)
  }, props));
}
function SidebarMenuSubButton(_ref21) {
  const {
      asChild = false,
      size = "md",
      isActive = false,
      className
    } = _ref21,
    props = _objectWithoutProperties(_ref21, _excluded21);
  const Comp = asChild ? Slot : "a";
  return Comp, _objectSpread({
    "data-slot": "sidebar-menu-sub-button",
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    className: (0, cn)("text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className)
  }, props));
}

export default _interopRequireWildcard;