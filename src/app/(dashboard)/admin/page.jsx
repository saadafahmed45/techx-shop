"use client";

import {
  Package, ShoppingCart, DollarSign, Clock, ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line,
  CartesianGrid, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import {
  useAdminProducts, useAdminCollections, useAdminOrders, useAdminUsers,
} from "@/lib/admin-hooks";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

function buildMonthlyData(orders) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({ name: months[d.getMonth()], revenue: 0, orders: 0, _key: key });
  }
  orders.forEach((o) => {
    const d   = new Date(o.createdAt || o.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const row = result.find((r) => r._key === key);
    if (row) { row.orders += 1; row.revenue += Number(o.totalPrice || 0); }
  });
  return result;
}

function statusColor(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered")                      return "bg-emerald-100 text-emerald-700";
  if (s === "confirmed" || s === "processing") return "bg-blue-100 text-blue-700";
  if (s === "cancelled")                      return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

/* ── Stat Card ─────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, dark }) {
  if (dark) {
    return (
      <div className="relative rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between min-h-[120px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between relative">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">{icon}</div>
        </div>
        <div className="relative">
          <p className="text-3xl font-black text-white mt-2">{value}</p>
          <p className="text-[11px] text-blue-400 mt-1 font-medium">{sub}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between min-h-[120px] hover:shadow-md hover:shadow-blue-600/5 transition">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* ── Chart Tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-[12px]">
      <p className="text-slate-400 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.dataKey === "revenue" ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function AdminPage() {
  const { user }                                     = useCart();
  const { data: products    = [], isLoading: pl }    = useAdminProducts();
  const { data: collections = [], isLoading: cl }    = useAdminCollections();
  const { data: orders      = [], isLoading: ol }    = useAdminOrders();
  const { data: users       = [], isLoading: ul }    = useAdminUsers();

  const loading = pl || cl || ol || ul;

  const totalRevenue    = orders
    .filter((o) => o.status?.toLowerCase() === "delivered")
    .reduce((acc, o) => acc + Number(o.totalPrice || 0), 0);

  const pendingOrders   = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status?.toLowerCase())
  ).length;

  const activeProducts  = products.filter((p) => p.status === "active").length;
  const chartData       = buildMonthlyData(orders);
  const firstName       = user?.name?.split(" ")[0]?.toUpperCase() || "ADMIN";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-7 space-y-6 max-w-[1400px]">

      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
            Welcome Back, {firstName}!
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">Your current store performance and fulfillment overview</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/manage-products"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-semibold transition"
          >
            <Package className="w-3.5 h-3.5" /> Catalog
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold transition shadow-sm shadow-blue-600/30"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Orders
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          dark
          icon={<DollarSign className="w-4 h-4 text-blue-400" />}
          label="Total Sales"
          value={`$${totalRevenue.toLocaleString()}`}
          sub="Lifetime store revenue"
        />
        <StatCard
          icon={<ShoppingCart className="w-4 h-4 text-blue-600" />}
          label="Total Orders"
          value={orders.length}
          sub="Customer purchases"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-blue-600" />}
          label="Pending Orders"
          value={pendingOrders}
          sub={pendingOrders > 0 ? "Awaiting fulfillment" : "All fulfilled"}
        />
        <StatCard
          icon={<Package className="w-4 h-4 text-blue-600" />}
          label="Active Catalog"
          value={activeProducts}
          sub="Active catalog items"
        />
      </div>

      {/* ── Chart + Top Products ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* Chart */}
        <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-[14px] font-bold text-slate-900">Sales &amp; Orders Over Time</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Monthly revenue summary &amp; order volume</p>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(v) => <span style={{ color: "#64748b" }}>{v}</span>}
                />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#2563eb" }} />
                <Line type="monotone" dataKey="orders"  name="Orders"  stroke="#0ea5e9" strokeWidth={2}   dot={false} activeDot={{ r: 4, fill: "#0ea5e9" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">Top Catalog Products</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Best-selling active catalog</p>
            </div>
            <Link href="/admin/manage-products" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              All Products <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {products.filter((p) => p.status === "active").slice(0, 5).map((p) => (
              <li key={p._id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.title} width={36} height={36} className="object-cover w-full h-full" />
                  ) : (
                    <Package className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-slate-900 truncate">{p.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">${p.price} &bull; {p.collections?.[0]?.name || "Product"}</p>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 border border-blue-100">Active</span>
              </li>
            ))}
            {products.filter((p) => p.status === "active").length === 0 && (
              <li className="text-[12px] text-slate-400 text-center py-6">No active products</li>
            )}
          </ul>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-[14px] font-bold text-slate-900">Recent Customer Orders</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Live orders awaiting fulfillment &amp; dispatch</p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition shadow-sm shadow-blue-600/20"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {["Order ID","Customer","District","Total","Status","Date","Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order._id} className="border-b border-slate-50 hover:bg-blue-50/30 transition">
                  <td className="px-5 py-3.5 text-[12px] font-bold text-blue-600 whitespace-nowrap">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[12px] font-semibold text-slate-900">{order.customerName || order.name || "N/A"}</p>
                    <p className="text-[10px] text-slate-400">{order.phone || order.customerPhone || ""}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-slate-500">{order.district || order.city || "N/A"}</td>
                  <td className="px-5 py-3.5 text-[12px] font-bold text-slate-900">${order.totalPrice}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "N/A"}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href="/admin/orders" className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition">
                      <ExternalLink className="w-3 h-3" /> Details
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-slate-400">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}