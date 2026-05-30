"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

// ==========================================
// CHECKMARK ANIMATION
// ==========================================

const AnimatedCheck = () => (
  <div className="relative flex items-center justify-center">
    <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
      <svg
        className="w-12 h-12 text-emerald-500"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
        <path
          d="M14 26 L22 34 L38 18"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[drawCheck_0.4s_ease-out_0.3s_forwards]"
          style={{ strokeDasharray: 30, strokeDashoffset: 30 }}
        />
      </svg>
    </div>

    {/* Ping rings */}
    <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />

    <style>{`
      @keyframes popIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes drawCheck {
        to { stroke-dashoffset: 0; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp 0.5s ease forwards; }
    `}</style>
  </div>
);

// ==========================================
// INFO ROW
// ==========================================

const InfoRow = ({ label, value, delay = "0s" }) => (
  <div
    className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0 fade-up"
    style={{ animationDelay: delay, opacity: 0 }}
  >
    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 w-28 shrink-0">
      {label}
    </span>
    <span className="text-sm font-medium text-slate-800 text-right">{value || "—"}</span>
  </div>
);

// ==========================================
// COPY BUTTON
// ==========================================
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const value = text.slice(-6).toUpperCase();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        copied
          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" />
            <path strokeLinecap="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
};
// ==========================================
// STEP TRACKER
// ==========================================

const STEPS = [
  { label: "Order Placed", icon: "📦", done: true },
  { label: "Confirmed", icon: "✅", done: true },
  { label: "Processing", icon: "⚙️", done: false },
  { label: "Delivered", icon: "🚚", done: false },
];

const StepTracker = () => (
  <div className="flex items-center w-full">
    {STEPS.map((step, i) => (
      <div key={i} className="flex-1 flex flex-col items-center">
        <div className="flex items-center w-full">
          {/* Left line */}
          {i > 0 && (
            <div className={`flex-1 h-0.5 ${i <= 1 ? "bg-emerald-400" : "bg-slate-200"}`} />
          )}
          {/* Circle */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 border-2 ${
              step.done
                ? "bg-emerald-50 border-emerald-400"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            {step.icon}
          </div>
          {/* Right line */}
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 ${i < 1 ? "bg-emerald-400" : "bg-slate-200"}`} />
          )}
        </div>
        <span className={`text-[10px] font-semibold mt-1.5 ${step.done ? "text-emerald-600" : "text-slate-400"}`}>
          {step.label}
        </span>
      </div>
    ))}
  </div>
);

// ==========================================
// MAIN PAGE CONTENT
// ==========================================

function OrderSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId") || "";
  const name    = params.get("name")    || "";
  const phone   = params.get("phone")   || "";
  const email   = params.get("email")   || "";
  const address = params.get("address") || "";
  const total   = params.get("total")   || "0";
  const items   = params.get("items")   || "0";

  // Format order ID for display
  const shortId = orderId ? orderId.slice(-8).toUpperCase() : "N/A";
  const displayId = orderId ? `#${shortId}` : "N/A";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-lg">

        {/* ── SUCCESS CARD ── */}
        <div
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden fade-up"
          style={{ animationDelay: "0.05s", opacity: 0 }}
        >
          {/* Green top stripe */}
          <div className="h-1.5 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400" />

          {/* Header */}
          <div className="flex flex-col items-center pt-10 pb-6 px-6 text-center">
            <AnimatedCheck />
            <h1
              className="mt-5 text-2xl font-black text-slate-900 tracking-tight fade-up"
              style={{ animationDelay: "0.35s", opacity: 0 }}
            >
              Order Confirmed!
            </h1>
            <p
              className="mt-1.5 text-sm text-slate-500 fade-up"
              style={{ animationDelay: "0.45s", opacity: 0 }}
            >
              Thank you{name ? `, ${name.split(" ")[0]}` : ""}! Your order has been placed successfully.
            </p>

            {/* Order ID pill */}
            <div
              className="mt-4 flex items-center gap-1 bg-slate-100 rounded-2xl px-4 py-2 fade-up"
              style={{ animationDelay: "0.5s", opacity: 0 }}
            >
              <span className="text-xs text-slate-500 font-medium">Order ID</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-sm font-black text-slate-800 tracking-wider font-mono">
                {displayId}
              </span>
              {orderId && <CopyButton text={orderId} />}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-dashed border-slate-200" />

          {/* Step tracker */}
          <div
            className="px-6 py-5 fade-up"
            style={{ animationDelay: "0.55s", opacity: 0 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Order Status
            </p>
            <StepTracker />
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-dashed border-slate-200" />

          {/* Order details */}
          <div className="px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Delivery Details
            </p>
            <InfoRow label="Name"    value={name}    delay="0.6s" />
            <InfoRow label="Phone"   value={phone}   delay="0.65s" />
            {email && <InfoRow label="Email"   value={email}   delay="0.7s" />}
            <InfoRow label="Address" value={address} delay="0.75s" />
            <InfoRow label="Payment" value="Cash On Delivery" delay="0.8s" />
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-dashed border-slate-200" />

          {/* Order total */}
          <div
            className="px-6 py-5 flex items-center justify-between fade-up"
            style={{ animationDelay: "0.85s", opacity: 0 }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                Tk {Number(total).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Items</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{items}</p>
            </div>
          </div>

          {/* Info banner */}
          <div
            className="mx-6 mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex gap-3 fade-up"
            style={{ animationDelay: "0.9s", opacity: 0 }}
          >
            <span className="text-xl shrink-0">📞</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              Our team will contact you at <strong>{phone}</strong> to confirm your delivery. Please keep your phone reachable.
            </p>
          </div>

          {/* Actions */}
          <div
            className="px-6 pb-8 flex flex-col sm:flex-row gap-3 fade-up"
            style={{ animationDelay: "0.95s", opacity: 0 }}
          >
            <Link
              href="/"
              className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-200"
            >
              🛍 Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              🏠 Go Home
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs text-slate-400 mt-5 fade-up"
          style={{ animationDelay: "1s", opacity: 0 }}
        >
          Need help? Contact us at{" "}
          <a href="mailto:support@techxshop.com" className="text-blue-500 underline">
            support@techxshop.com
          </a>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// EXPORT — wrapped in Suspense for useSearchParams
// ==========================================

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}