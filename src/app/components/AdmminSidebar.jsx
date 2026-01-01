import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Calendar,
  CheckCircle,
  BarChart3,
  X,
  Home
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

const menuItems = [
  { id: "admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "add-property", icon: PlusCircle, label: "Add Property" },
  { id: "manage-listings", icon: List, label: "Manage Listings" },
  { id: "view-bookings", icon: Calendar, label: "View Bookings" },
  { id: "approvals", icon: CheckCircle, label: "Approvals" },
  { id: "reports", icon: BarChart3, label: "Reports" }
];

export function AdminSidebar({ currentPage, onNavigate, isOpen = true, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r z-40 transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2>Admin Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start mb-4"
            onClick={() => {
              onNavigate("home");
              onClose?.();
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Button
                key={item.id}
                variant="isActive ? "default" : "ghost""
                className="w-full justify-start"
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;