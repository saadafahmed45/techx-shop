"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Truck,
  Search,
  RefreshCw,
  Copy,
  Calendar,
  Filter,
  Package,
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  Wallet,
  Phone,
  User,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useAdminParcels,
  useRefreshCourierStatus,
} from "@/lib/admin-hooks";
import CourierStatusBadge from "@/components/courier/CourierStatusBadge";
import CourierBalanceWidget from "@/components/courier/CourierBalanceWidget";
import SendToSteadfastModal from "@/components/courier/SendToSteadfastModal";

const STATUS_FILTER_OPTIONS = [
  "All",
  "in_review",
  "pending",
  "delivered",
  "partial_delivered",
  "cancelled",
  "hold",
  "return",
];

export default function CourierManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [refreshingId, setRefreshingId] = useState(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 20,
      search: search.trim(),
      deliveryStatus: statusFilter,
      startDate,
      endDate,
    }),
    [page, search, statusFilter, startDate, endDate]
  );

  const { data, isLoading, isFetching, refetch } = useAdminParcels(queryParams);
  const refreshStatusMutation = useRefreshCourierStatus();

  const parcels = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 };
  const stats = data?.stats || {
    total: 0,
    inReview: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    totalCod: 0,
    deliveredCod: 0,
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    toast.info(`${label} copied to clipboard!`);
  };

  const handleRefreshSingle = async (orderId) => {
    try {
      setRefreshingId(orderId);
      const res = await refreshStatusMutation.mutateAsync(orderId);
      toast.success(res?.message || "Parcel status refreshed");
      refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to refresh parcel status");
    } finally {
      setRefreshingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase tracking-wider">
                Logistics Hub
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Official API Integration
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Steadfast Courier Management
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Monitor shipments, track delivery states, and manage Cash on Delivery collections
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>All Orders</span>
            </Link>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              <span>Sync All</span>
            </button>
          </div>
        </div>

        {/* Merchant Balance + Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Balance Widget */}
          <div className="lg:col-span-1">
            <CourierBalanceWidget className="h-full" />
          </div>

          {/* Quick Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Parcels</p>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-2xl font-black text-slate-900">{stats.total}</span>
                <Truck className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Total Booked</p>
            </div>

            <div className="bg-amber-50/60 rounded-3xl border border-amber-100 p-4 shadow-xs">
              <p className="text-[11px] uppercase tracking-wider text-amber-700 font-bold">In Transit</p>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-2xl font-black text-amber-900">{stats.inTransit}</span>
                <Clock3 className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-[10px] text-amber-700 mt-1">{stats.inReview} review • {stats.pending} pending</p>
            </div>

            <div className="bg-emerald-50/60 rounded-3xl border border-emerald-100 p-4 shadow-xs">
              <p className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold">Delivered</p>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-2xl font-black text-emerald-900">{stats.delivered}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-[10px] text-emerald-700 mt-1">৳{stats.deliveredCod?.toLocaleString()} COD collected</p>
            </div>

            <div className="bg-rose-50/60 rounded-3xl border border-rose-100 p-4 shadow-xs">
              <p className="text-[11px] uppercase tracking-wider text-rose-700 font-bold">Returned / Cancelled</p>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-2xl font-black text-rose-900">{stats.returned}</span>
                <RotateCcw className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-[10px] text-rose-700 mt-1">{stats.cancelled} cancelled</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Order ID, Consignment ID, Tracking Code, Phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Date Range Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer"
                />
              </div>

              {(search || statusFilter !== "All" || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-600 transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none border-t border-slate-100">
            {STATUS_FILTER_OPTIONS.map((statusKey) => {
              const active = statusFilter === statusKey;
              const displayLabel = statusKey === "All" ? "All Parcels" : statusKey.replace(/_/g, " ").toUpperCase();
              return (
                <button
                  key={statusKey}
                  onClick={() => {
                    setStatusFilter(statusKey);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Parcels Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Order & Consignment</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">COD Receivable</th>
                  <th className="py-3.5 px-4">Courier Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                      <p className="font-medium text-xs">Loading Steadfast shipments...</p>
                    </td>
                  </tr>
                ) : parcels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <Truck className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                      <p className="font-bold text-slate-700 text-sm">No Parcels Found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {search || statusFilter !== "All"
                          ? "Try clearing your search or filters."
                          : "Orders booked with Steadfast Courier will appear here."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  parcels.map((order) => {
                    const courier = order.courier || {};
                    const isRefreshing = refreshingId === order._id;

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-50/70 transition group"
                      >
                        {/* Order & Consignment Column */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 text-xs">
                                #{order._id?.slice(-8).toUpperCase()}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {order.status}
                              </span>
                            </div>

                            {courier.consignmentId ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400">CID:</span>
                                <span className="font-mono font-bold text-indigo-700">
                                  {courier.consignmentId}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(courier.consignmentId, "Consignment ID")}
                                  title="Copy Consignment ID"
                                  className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-600 font-semibold">
                                {courier.bookingState || "Not Booked"}
                              </span>
                            )}

                            {courier.trackingCode && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400">Track:</span>
                                <span className="font-mono text-slate-600">
                                  {courier.trackingCode}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(courier.trackingCode, "Tracking Code")}
                                  title="Copy Tracking Code"
                                  className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(courier.bookedAt || order.createdAt)}
                            </p>
                          </div>
                        </td>

                        {/* Recipient Details */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              {courier.recipientName || order.customerName || "—"}
                            </p>

                            <p className="text-slate-600 text-xs flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="font-mono">{courier.recipientPhone || order.phone || "—"}</span>
                              <button
                                onClick={() => copyToClipboard(courier.recipientPhone || order.phone, "Phone")}
                                className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer"
                              >
                                <Copy className="w-2.5 h-2.5" />
                              </button>
                            </p>

                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex items-start gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                              <span>{courier.recipientAddress || order.address || "—"}</span>
                            </p>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-slate-700">
                              {order.products?.length || 0} product(s)
                            </span>
                            <ul className="text-[10px] text-slate-500 space-y-0.5">
                              {order.products?.slice(0, 2).map((item, idx) => (
                                <li key={idx} className="truncate">
                                  • {item.title} <span className="text-slate-400">×{item.quantity}</span>
                                </li>
                              ))}
                              {order.products?.length > 2 && (
                                <li className="text-slate-400 italic">
                                  +{order.products.length - 2} more...
                                </li>
                              )}
                            </ul>
                          </div>
                        </td>

                        {/* Financials & COD */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-0.5">
                            <span className="text-base font-black text-indigo-700 block">
                              ৳{Number(courier.codAmount ?? order.totalPrice ?? 0).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Order Total: ${Number(order.totalPrice || 0).toLocaleString()}
                            </span>
                            {Number(courier.deliveryCharge) > 0 && (
                              <span className="text-[10px] text-slate-400 block">
                                Delivery: +৳{Number(courier.deliveryCharge).toLocaleString()}
                              </span>
                            )}
                            {Number(courier.alreadyPaid) > 0 && (
                              <span className="text-[10px] text-emerald-600 font-semibold block">
                                Paid: -৳{Number(courier.alreadyPaid).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Courier Status */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1.5">
                            <CourierStatusBadge
                              status={courier.deliveryStatus}
                              bookingState={courier.bookingState}
                            />
                            {courier.lastCheckedAt && (
                              <p className="text-[9px] text-slate-400">
                                Synced: {formatDate(courier.lastCheckedAt)}
                              </p>
                            )}
                            {courier.error && (
                              <p className="text-[9px] text-rose-500 font-medium line-clamp-1" title={courier.error}>
                                Error: {courier.error}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {courier.bookingState !== "created" && (
                              <button
                                onClick={() => setSelectedOrderForModal(order)}
                                title="Retry Booking with Steadfast"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Retry</span>
                              </button>
                            )}

                            {courier.consignmentId && (
                              <button
                                onClick={() => handleRefreshSingle(order._id)}
                                disabled={isRefreshing}
                                title="Refresh Delivery Status"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
                              </button>
                            )}

                            <Link
                              href="/admin/orders"
                              title="View Order in Order Management"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="py-3.5 px-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing page <strong className="text-slate-800">{pagination.page}</strong> of{" "}
                <strong className="text-slate-800">{pagination.totalPages}</strong> ({pagination.total} total parcels)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Steadfast Booking Modal for Retries */}
      {selectedOrderForModal && (
        <SendToSteadfastModal
          key={selectedOrderForModal._id}
          order={selectedOrderForModal}
          isOpen={!!selectedOrderForModal}
          onClose={() => setSelectedOrderForModal(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
