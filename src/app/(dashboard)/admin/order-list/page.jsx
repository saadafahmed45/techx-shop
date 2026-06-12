"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search, Trash2, Pencil,
  PackageCheck, Clock3, Truck,
  CheckCircle2, XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_STYLES = {
  Pending:    "bg-amber-100 text-amber-700",
  Confirmed:  "bg-blue-100 text-blue-700",
  Processing: "bg-violet-100 text-violet-700",
  Shipped:    "bg-indigo-100 text-indigo-700",
  Delivered:  "bg-emerald-100 text-emerald-700",
  Cancelled:  "bg-red-100 text-red-700",
};

const STATUS_ICONS = {
  Pending:    Clock3,
  Confirmed:  PackageCheck,
  Processing: PackageCheck,
  Shipped:    Truck,
  Delivered:  CheckCircle2,
  Cancelled:  XCircle,
};

const STATUS_OPTIONS = [
  "Pending", "Confirmed", "Processing",
  "Shipped", "Delivered", "Cancelled",
];

// ─── Product image with fallback ─────────────────────────────────────────────
const ProductThumb = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return error || !src ? (
    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 text-xs">
      N/A
    </div>
  ) : (
    <img
      src={src} alt={alt}
      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
      onError={() => setError(true)}
    />
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const OrdersListPage = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res  = await fetch(`${API}/orders`);
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Delete this order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  // ── Update Status ──────────────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.map((o) => o._id === id ? { ...o, status } : o)
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((order) => {
      const matchSearch =
        order.customerName?.toLowerCase().includes(q) ||
        order.email?.toLowerCase().includes(q) ||
        order.phone?.includes(search) ||
        order._id?.toLowerCase().includes(q);
      const matchFilter = filter === "All" || order.status === filter;
      return matchSearch && matchFilter;
    });
  }, [orders, search, filter]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  }), [orders]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Orders List</h1>
            <p className="text-slate-400 mt-2">Manage all customer orders</p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: stats.total,     color: "bg-slate-900 text-white"    },
            { label: "Pending",      value: stats.pending,   color: "bg-amber-400 text-white"    },
            { label: "Delivered",    value: stats.delivered, color: "bg-emerald-500 text-white"  },
            { label: "Cancelled",    value: stats.cancelled, color: "bg-red-500 text-white"      },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-4 text-center shadow-sm`}>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs font-semibold opacity-80 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex gap-2 flex-wrap">
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`h-9 px-4 rounded-xl border text-xs font-bold transition-all ${
                filter === s
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">
          <table className="w-full min-w-225">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {["Order ID", "Customer", "Phone", "Total", "Products", "Status", "Update", "Actions"].map((h) => (
                  <th key={h} className={`px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black ${h === "Actions" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const Icon = STATUS_ICONS[order.status] || Clock3;
                return (
                  <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition">

                    {/* ORDER ID */}
                    <td className="px-6 py-5 font-bold text-slate-900">
                      #{order._id?.slice(-6)}
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-5">
                      <h3 className="font-bold text-slate-900">{order.customerName}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">{order.email}</p>
                    </td>

                    {/* PHONE */}
                    <td className="px-6 py-5 text-slate-600 text-sm">{order.phone}</td>

                    {/* TOTAL */}
                    <td className="px-6 py-5 font-black text-indigo-600">
                      TK {order.totalPrice?.toLocaleString()}
                    </td>

                    {/* PRODUCTS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {order.products?.slice(0, 2).map((product, i) => (
                          <ProductThumb key={i} src={product.image} alt={product.title} />
                        ))}
                        {order.products?.length > 2 && (
                          <span className="text-sm text-slate-400 font-medium">
                            +{order.products.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${STATUS_STYLES[order.status] || "bg-slate-100 text-slate-600"}`}>
                        <Icon className="w-4 h-4" />
                        {order.status}
                      </div>
                    </td>

                    {/* UPDATE */}
                    <td className="px-6 py-5">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-indigo-500 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <button className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* EMPTY */}
          {filteredOrders.length === 0 && (
            <div className="py-24 text-center">
              <h2 className="text-3xl font-black text-slate-900">No Orders Found</h2>
              <p className="text-slate-400 mt-3">Try another search or filter</p>
            </div>
          )}
        </div>

        {/* FOOTER COUNT */}
        <p className="text-sm text-slate-400 text-right">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>

      </div>
    </div>
  );
};

export default OrdersListPage;