"use client";

import {
  Package, Layers3, ShoppingCart,
  TrendingUp, DollarSign, Activity,
  Users, UserCheck, UserX, ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area,
  CartesianGrid, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell,
} from "recharts";
import { useAdminProducts, useAdminCollections, useAdminOrders, useAdminUsers } from "@/lib/admin-hooks";

const COLORS = ["#4f46e5", "#f59e0b"];

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4780 },
  { name: "May", sales: 5890 },
  { name: "Jun", sales: 6390 },
  { name: "Jul", sales: 7490 },
];

function StatCard({ icon, label, value, sub, color }) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-600",
    violet: "bg-violet-100 text-violet-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
  };
  const iconBg = colorMap[color] || colorMap.indigo;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <h2 className="mt-6 text-4xl font-black text-slate-900">{value}</h2>
      <p className="mt-2 text-sm text-slate-400">{sub}</p>
    </div>
  );
}

export default function AdminPage() {
  const { data: products = [], isLoading: productsLoading } = useAdminProducts();
  const { data: collections = [], isLoading: collectionsLoading } = useAdminCollections();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();

  const loading = productsLoading || collectionsLoading || ordersLoading || usersLoading;

  const totalRevenue = orders
    .filter((item) => item.status?.toLowerCase() === "delivered")
    .reduce((acc, item) => acc + Number(item.totalPrice || 0), 0);

  const activeProducts = products.filter((p) => p.status === "active").length;

  const productStatusData = [
    { name: "Active", value: products.filter((p) => p.status === "active").length },
    { name: "Draft",  value: products.filter((p) => p.status === "draft").length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-400 mt-2">Overview of your store analytics & performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard icon={<Package className="w-7 h-7" />} label="Products" value={products.length} sub={`${activeProducts} active products`} color="indigo" />
          <StatCard icon={<Layers3 className="w-7 h-7" />} label="Collections" value={collections.length} sub="Total collections" color="violet" />
          <StatCard icon={<ShoppingCart className="w-7 h-7" />} label="Orders" value={orders.length} sub="Total customer orders" color="emerald" />
          <StatCard icon={<DollarSign className="w-7 h-7" />} label="Revenue" value={`$${totalRevenue.toFixed(0)}`} sub="Total earnings" color="amber" />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">User Statistics</h2>
            <p className="text-slate-400 text-xs mt-1">Platform user registrations and roles summary</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard icon={<Users className="w-7 h-7" />} label="Total Users" value={users.length} sub="Registered accounts" color="indigo" />
            <StatCard icon={<UserCheck className="w-7 h-7" />} label="Active" value={users.filter(u => u.status === "active").length} sub="Active status accounts" color="emerald" />
            <StatCard icon={<UserX className="w-7 h-7" />} label="Blocked" value={users.filter(u => u.status === "blocked").length} sub="Restricted access users" color="red" />
            <StatCard icon={<ShieldAlert className="w-7 h-7" />} label="Admins" value={users.filter(u => u.role === "admin").length} sub="Authorized administrators" color="amber" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Sales Analytics</h2>
                <p className="text-sm text-slate-400 mt-1">Monthly sales performance</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <div style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                  <YAxis tick={{ fill: "#64748b" }} />
                  <Tooltip />
                  <Area
                    type="monotone" dataKey="sales"
                    stroke="#4f46e5" fillOpacity={1}
                    fill="url(#sales)" strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Product Status</h2>
                <p className="text-sm text-slate-400 mt-1">Active vs Draft</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
            </div>

            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productStatusData}
                    dataKey="value" nameKey="name"
                    outerRadius={100} innerRadius={60} paddingAngle={4}
                  >
                    {productStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-sm text-slate-600">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-600">Draft</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Recent Orders</h2>
              <p className="text-sm text-slate-400 mt-1">Latest customer purchases</p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                <div>
                  <h3 className="font-bold text-slate-900">#{order._id?.slice(-6)}</h3>
                  <p className="text-sm text-slate-400 mt-1">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-indigo-600">${order.totalPrice}</p>
                  <span className="text-xs text-slate-400">{order.status}</span>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="py-14 text-center text-slate-400">No orders found</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
