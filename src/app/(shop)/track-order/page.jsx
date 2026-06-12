"use client";

import { useState } from "react";
import {
  FiSearch, FiTruck, FiCalendar, FiCreditCard,
  FiInfo, FiPackage, FiHelpCircle, FiDownload,
} from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import jsPDF from "jspdf";

const API = process.env.NEXT_PUBLIC_API_URL;

const STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

const STATUS_META = {
  Pending:    { label: "Pending",    desc: "Your order is placed and awaiting confirmation.", step: 0, bg: "bg-gray-50",    border: "border-gray-200",   icon: "text-gray-500",   badge: "bg-gray-100 text-gray-600"    },
  Confirmed:  { label: "Confirmed",  desc: "Your order has been confirmed by the seller.",    step: 1, bg: "bg-blue-50",    border: "border-blue-200",   icon: "text-blue-500",   badge: "bg-blue-100 text-blue-600"    },
  Processing: { label: "Processing", desc: "Your order is being packed and prepared.",        step: 2, bg: "bg-indigo-50",  border: "border-indigo-200", icon: "text-indigo-500", badge: "bg-indigo-100 text-indigo-600" },
  Shipped:    { label: "Shipped",    desc: "Your order is on the way!",                       step: 3, bg: "bg-yellow-50",  border: "border-yellow-200", icon: "text-yellow-500", badge: "bg-yellow-100 text-yellow-600" },
  Delivered:  { label: "Delivered",  desc: "Your order has been delivered! 🎉",               step: 4, bg: "bg-green-50",   border: "border-green-200",  icon: "text-green-500",  badge: "bg-green-100 text-green-600"  },
  Cancelled:  { label: "Cancelled",  desc: "This order has been cancelled.",                  step: -1, bg: "bg-red-50",   border: "border-red-200",    icon: "text-red-500",    badge: "bg-red-100 text-red-500"      },
};

// ─── INVOICE GENERATOR ────────────────────────────────────────────────────────
const generateInvoice = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(79, 70, 229);
  doc.roundedRect(0, 0, pageWidth, 55, 0, 0, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("TechX Shop", 20, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text("Your trusted tech store", 20, 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", pageWidth - 20, 28, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  doc.text(`#${order._id?.slice(-8).toUpperCase()}`, pageWidth - 20, 38, { align: "right" });

  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  doc.text(`Date: ${date}`, pageWidth - 20, 47, { align: "right" });

  const statusColors = {
    Delivered: [16, 185, 129],
    Confirmed: [79, 70, 229],
    Processing: [99, 102, 241],
    Shipped: [245, 158, 11],
    Pending: [100, 116, 139],
    Cancelled: [239, 68, 68],
  };
  const [r, g, b] = statusColors[order.status] || [100, 116, 139];

  doc.setFillColor(r, g, b);
  doc.roundedRect(pageWidth - 52, 58, 42, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(order.status.toUpperCase(), pageWidth - 31, 65, { align: "center" });

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 72, 85, 58, 4, 4, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, 72, 85, 58, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("BILL TO", 22, 82);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(order.customerName, 22, 92);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(order.email, 22, 101);
  doc.text(order.phone, 22, 110);
  const addressLines = doc.splitTextToSize(order.address, 72);
  doc.text(addressLines, 22, 119);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(110, 72, 85, 58, 4, 4, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(110, 72, 85, 58, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("PAYMENT INFO", 117, 82);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Method", 117, 94);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(order.paymentMethod || "COD", 117, 103);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("Order Status", 117, 115);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(r, g, b);
  doc.text(order.status, 117, 124);

  const tableTop = 145;
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(15, tableTop, pageWidth - 30, 12, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("#",               22,              tableTop + 8);
  doc.text("Product",         32,              tableTop + 8);
  doc.text("Qty",             140,             tableTop + 8, { align: "center" });
  doc.text("Unit Price",      162,             tableTop + 8, { align: "center" });
  doc.text("Subtotal",        pageWidth - 18,  tableTop + 8, { align: "right" });

  let y = tableTop + 18;
  order.products.forEach((item, index) => {
    const rowBg = index % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(...rowBg);
    doc.rect(15, y - 7, pageWidth - 30, 14, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(15, y + 7, pageWidth - 15, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text(`${index + 1}`, 22, y + 1);

    const titleLines = doc.splitTextToSize(item.title, 95);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(titleLines[0], 32, y + 1);

    doc.setTextColor(71, 85, 105);
    doc.text(`${item.quantity}`,                      140,            y + 1, { align: "center" });
    doc.text(`TK ${item.price}`,                      162,            y + 1, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`TK ${item.price * item.quantity}`,      pageWidth - 18, y + 1, { align: "right" });
    y += 14;
  });

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  doc.setFillColor(79, 70, 229);
  doc.roundedRect(pageWidth - 80, y - 8, 65, 18, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254);
  doc.text("TOTAL", pageWidth - 73, y + 1);
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`TK ${order.totalPrice}`, pageWidth - 18, y + 1, { align: "right" });

  const footerY = pageHeight - 22;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, footerY - 8, pageWidth, 30, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(15, footerY - 8, pageWidth - 15, footerY - 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for shopping with TechX Shop!", pageWidth / 2, footerY, { align: "center" });
  doc.text("For support: support@techxshop.com  |  www.techxshop.com", pageWidth / 2, footerY + 7, { align: "center" });

  doc.save(`TechX-Invoice-${order._id?.slice(-8).toUpperCase()}.pdf`);
};

// ─── STEPPER ──────────────────────────────────────────────────────────────────
function Stepper({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex justify-center py-5">
        <span className="bg-red-100 text-red-500 text-sm font-medium px-5 py-2 rounded-full border border-red-200">
          ✕ Order Cancelled
        </span>
      </div>
    );
  }

  const currentStep = STEPS.findIndex(
    (step) => step.toLowerCase() === status?.toLowerCase()
  );

  return (
    <div className="flex items-start w-full py-6 px-2">
      {STEPS.map((step, i) => {
        const done   = i < currentStep;
        const active = i === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${done   ? "bg-blue-600 border-blue-500 text-white"
                : active ? "bg-white border-blue-500 text-blue-500"
                :          "bg-white border-gray-200"}`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : active ? (
                  <FiTruck className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${done || active ? "text-gray-700" : "text-gray-400"}`}>
                {step}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: i < currentStep ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function TrackOrderPage() {
  const [query,   setQuery]   = useState("");
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    const searchValue = query.trim();
    if (!searchValue) { setError("Please enter your Order ID"); return; }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const res = await fetch(`${API}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");

      const orders = await res.json();
      const foundOrder = orders.find((item) => {
        const fullId  = item._id?.toLowerCase();
        const shortId = item._id?.slice(-6).toLowerCase();
        return (
          fullId === searchValue.toLowerCase() ||
          shortId === searchValue.toLowerCase() ||
          fullId.includes(searchValue.toLowerCase())
        );
      });

      if (!foundOrder) throw new Error("Order not found");
      setOrder(foundOrder);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const shortId    = order?._id ? order._id.slice(-6).toUpperCase() : "";
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };
  const meta = order ? STATUS_META[order.status] || STATUS_META.Pending : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">

      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
          <FiTruck className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Track Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your Order ID to get live updates</p>
      </div>

      {/* Search */}
      <form onSubmit={handleTrack}
        className="w-full max-w-xl flex items-center border border-gray-200 rounded-full bg-white shadow-sm px-4 py-1 mb-6">
        <FiSearch className="text-gray-400 w-5 h-5 shrink-0" />
        <input
          type="text"
          placeholder="Enter Order ID e.g. e6de65"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-gray-700"
        />
        <button type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2 rounded-full flex items-center gap-2 transition-all disabled:opacity-60 shrink-0">
          {loading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <>→ Track</>}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="w-full max-w-xl bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {order && meta && (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Status Banner */}
          <div className={`flex items-center gap-4 px-5 py-4 ${meta.bg} border-b ${meta.border}`}>
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <FiTruck className={`w-5 h-5 ${meta.icon}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-gray-800 text-base">{meta.label}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{meta.desc}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="px-4">
            <Stepper status={order.status} />
          </div>

          {/* Order Details */}
          <div className="px-5 pb-5">
            <div className="border border-gray-100 rounded-xl p-4 space-y-4">

              <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                <FiPackage className="text-blue-500 w-4 h-4" /> Order Details
              </h3>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                    <FiCalendar className="w-3 h-3" /> Order Date
                  </p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                    <FiCreditCard className="w-3 h-3" /> Total Amount
                  </p>
                  <p className="text-sm font-medium text-gray-700">TK {order.totalPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                    <FiCreditCard className="w-3 h-3" /> Payment
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {order.paymentMethod ?? "COD"} —{" "}
                    <span className={order.status === "Delivered" ? "text-green-600" : "text-yellow-500"}>
                      {order.status === "Delivered" ? "Paid" : "Pending"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5">
                    <FiInfo className="w-3 h-3" /> Order ID
                  </p>
                  <p className="text-sm font-medium text-gray-700">#{shortId}</p>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Products */}
              {order.products?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                    <BsBoxSeam className="w-3 h-3" /> Items ({order.products.length})
                  </p>
                  <div className="space-y-3">
                    {order.products.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                          <div className="flex gap-2 mt-0.5 flex-wrap">
                            {item.size  && <span className="text-xs text-gray-400">Size: {item.size}</span>}
                            {item.color && <span className="text-xs text-gray-400">· Color: {item.color}</span>}
                          </div>
                          <span className={`inline-block text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${meta.badge}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-800">
                            TK {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity} · TK {item.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-base font-bold text-gray-800">
                  TK {order.totalPrice?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Download Invoice + Help ── */}
          <div className="flex items-center justify-between px-5 pb-5 gap-3">

            {/* Download Invoice Button */}
            <button
              type="button"
              onClick={() => generateInvoice(order)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
            >
              <FiDownload className="w-4 h-4" />
              Download Invoice
            </button>

            {/* Need Help Button */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <FiHelpCircle className="w-4 h-4" /> Need Help?
            </button>

          </div>

        </div>
      )}
    </div>
  );
}