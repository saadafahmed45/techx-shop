"use client";

import { useMemo, useState } from "react";
import {
  PackageCheck,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { generateInvoice } from "@/utils/generateInvoice";
import {
  useAdminOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "@/lib/admin-hooks";

const STATUS_COLORS = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Processing: "bg-violet-100 text-violet-800 border-violet-200",
  Shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

const STATUS_ICONS = {
  Pending: Clock3,
  Confirmed: PackageCheck,
  Processing: PackageCheck,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
};

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const ProductThumbnail = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
        <Package className="w-6 h-6 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Product"}
      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
      onError={() => setError(true)}
    />
  );
};

const OrdersPage = () => {
  const { data: orders = [], isLoading, refetch, isFetching } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  // Filter and search
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter =
        activeFilter === "All" ||
        order.status?.toLowerCase() === activeFilter.toLowerCase();

      if (!matchesFilter) return false;
      if (!q) return true;

      const orderId = order._id?.toLowerCase() || "";
      const customerName = order.customerName?.toLowerCase() || "";
      const email = order.email?.toLowerCase() || "";
      const phone = order.phone?.toLowerCase() || "";
      const address = order.address?.toLowerCase() || "";

      return (
        orderId.includes(q) ||
        customerName.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        address.includes(q)
      );
    });
  }, [orders, search, activeFilter]);

  // Statistics
  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      processing: orders.filter(
        (o) => o.status === "Processing" || o.status === "Confirmed" || o.status === "Shipped"
      ).length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    }),
    [orders]
  );

  // Status update with toast & optimistic feedback
  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId || !newStatus) return;

    try {
      setUpdatingId(orderId);
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success(
        `Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus}`
      );
    } catch (err) {
      toast.error(err?.message || "Failed to update delivery status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
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
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success("Order deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete order");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Order Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage customer orders & delivery status
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Orders</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-slate-900">{stats.total}</span>
              <ShoppingBag className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="bg-amber-50/60 rounded-3xl border border-amber-100 p-5 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-amber-600 font-bold">Pending</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-amber-800">{stats.pending}</span>
              <Clock3 className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          <div className="bg-indigo-50/60 rounded-3xl border border-indigo-100 p-5 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold">In Transit</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-indigo-800">{stats.processing}</span>
              <Truck className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div className="bg-emerald-50/60 rounded-3xl border border-emerald-100 p-5 shadow-xs">
            <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold">Delivered</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-800">{stats.delivered}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["All", ...STATUS_OPTIONS].map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-400 transition"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const Icon = STATUS_ICONS[order.status] || Clock3;
            const statusClass =
              STATUS_COLORS[order.status] || "bg-slate-100 text-slate-700 border-slate-200";
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                  <div className="flex-1">
                    {/* Header Row: ID, Status, Date */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                        #{order._id?.slice(-6).toUpperCase()}
                      </h2>

                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{order.status || "Pending"}</span>
                      </div>

                      {order.createdAt && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Customer Details Grid */}
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                          Customer
                        </p>
                        <h3 className="font-bold text-slate-900 mt-1 text-sm">
                          {order.customerName || "—"}
                        </h3>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                          Phone
                        </p>
                        <h3 className="font-medium text-slate-700 mt-1 text-sm flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.phone || "—"}</span>
                        </h3>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                          Email
                        </p>
                        <h3 className="font-medium text-slate-700 mt-1 text-sm truncate max-w-full">
                          {order.email || "—"}
                        </h3>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                          Total Amount
                        </p>
                        <h3 className="font-black text-indigo-600 text-lg mt-1">
                          ${order.totalPrice?.toLocaleString() || 0}
                        </h3>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mt-4 flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-700">Delivery Address: </span>
                        <span className="text-slate-600 leading-relaxed">
                          {order.address || "No address provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column: Status Selector, Invoice, Delete */}
                  <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 min-w-[200px] xl:w-56 shrink-0 justify-end">
                    <div className="relative">
                      <select
                        value={order.status || "Pending"}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`w-full appearance-none rounded-2xl border bg-slate-50 px-4 py-2.5 text-xs font-bold outline-none cursor-pointer transition ${
                          isUpdating
                            ? "opacity-60 border-slate-200 cursor-not-allowed"
                            : "border-slate-200 hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            Status: {opt}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => generateInvoice(order)}
                      className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white py-2.5 px-4 text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Invoice</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="cursor-pointer flex items-center justify-center gap-2 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 py-2.5 px-4 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Order</span>
                    </button>
                  </div>
                </div>

                {/* Ordered Products Section */}
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-wider font-black text-slate-900">
                      Ordered Products ({order.products?.length || 0})
                    </h3>
                    <span className="text-xs font-medium text-slate-400">
                      Method: {order.paymentMethod || "Cash On Delivery"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.products?.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-2xl bg-slate-50/70 border border-slate-100 p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ProductThumbnail src={product.image} alt={product.title} />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">
                              {product.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Qty: {product.quantity} × ${product.price}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-black text-indigo-600 shrink-0 ml-2">
                          ${(product.price * product.quantity)?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 py-20 px-4 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
              <h2 className="text-xl font-bold text-slate-800">No Orders Found</h2>
              <p className="text-slate-400 text-sm mt-1">
                {search || activeFilter !== "All"
                  ? "Try clearing your search or changing the status filter."
                  : "Customer orders will appear here once placed."}
              </p>
              {(search || activeFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("All");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrdersPage;
