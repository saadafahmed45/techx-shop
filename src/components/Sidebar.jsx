"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Plus,
  Settings,
  Menu,
  X,
  Layers3,
  Home,
  ChevronRight,
  Users,
} from "lucide-react";

const menuGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/order-list", label: "Order List", icon: ShoppingBag },
      { href: "/admin/users", label: "Manage Users", icon: Users },
    ],
  },
    {
    label: "Hero Slider",
    items: [
      { href: "/admin/add-hero-slider", label: "Add Hero Slider", icon: Plus },
      { href: "/admin/manage-hero-sliders", label: "Manage Hero Sliders", icon: Package },
    ],
  },
  {
    label: "Products",
    items: [
      { href: "/admin/add-products", label: "Add Product", icon: Plus },
      { href: "/admin/manage-products", label: "Manage Products", icon: Package },
    ],
  },
  {
    label: "Collections",
    items: [
      { href: "/admin/add-collections", label: "Add Collection", icon: Plus },
      { href: "/admin/manage-collections", label: "Manage Collections", icon: Layers3 },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/", label: "View Store", icon: Home, exact: true },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // FIX: exact match for "/" and "/admin" to prevent false positives
  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    // FIX: prevent "/admin" matching "/admin/orders" etc when not exact,
    // but still allow "/admin/orders" to match startsWith
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition border border-gray-100"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          w-64 shrink-0
          bg-gray-950 text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 shrink-0">
              <Package className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Admin Panel</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">Store Management</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-150 group relative
                          ${active
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                            : "text-gray-400 hover:bg-white/6 hover:text-white"
                          }
                        `}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                          active
                            ? "bg-white/20"
                            : "bg-white/5 group-hover:bg-white/10"
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="flex-1 truncate">{item.label}</span>
                        {active && (
                          <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8">
          <div className="bg-white/5 rounded-xl p-3.5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Settings className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xs font-semibold text-white">Need Help?</p>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Contact support for assistance with your store.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;