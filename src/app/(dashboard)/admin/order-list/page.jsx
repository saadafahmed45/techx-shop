"use client";

import { useMemo, useState } from "react";
import {
  Search, Trash2, Pencil,
  PackageCheck, Clock3, Truck,
  CheckCircle2, XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAdminOrders, useUpdateOrderStatus, useDeleteOrder } from "@/lib/admin-hooks";

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

const OrdersListPage = () => {
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

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

  const stats = useMemo(() => ({
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  }), [orders]);

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
      await deleteOrderMutation.mutateAsync(id);
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Orders List</h1>
            <p className="text-slate-400 mt-2">Manage all customer orders</p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Orders</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Pending</p>
            <p className="text-3xl font-black text-amber-700 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Delivered</p>
            <p className="text-3xl font-black text-emerald-700 mt-2">{stats.delivered}</p>
          </div>
          <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">Cancelled</p>
            <p className="text-3xl font-black text-red-700 mt-2">{stats.cancelled}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400 font-bold">
                  <th className="text-left px-6 py-4">Order ID</th>
                  <th className="text-left px-6 py-4">Customer</th>
                  <th className="text-left px-6 py-4">Products</th>
                  <th className="text-left px-6 py-4">Total</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = STATUS_ICONS[order.status];
                  return (
                    <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-5">
                        <span className="font-mono font-bold text-indigo-600">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-900">{order.customerName || "—"}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{order.email}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-2">
                          {order.products?.slice(0, 3).map((p, i) => (
                            <ProductThumb key={i} src={p.image} alt={p.title} />
                          ))}
                          {(order.products?.length || 0) > 3 && (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                              +{order.products.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-900">${order.totalPrice?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_STYLES[order.status]}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="appearance-none h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <div className="flex gap-1">
                            <button onClick={() => deleteOrder(order._id)}
                              className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center text-slate-400">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersListPage;
