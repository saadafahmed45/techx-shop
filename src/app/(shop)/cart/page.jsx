"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Trash2, ShoppingBag, ShieldCheck, CreditCard,
  Truck, Plus, Minus, ArrowRight, Tag, Percent
} from "lucide-react";

export default function CartPage() {
  const { cart, removeItem, increaseQuantity, decreaseQuantity } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 120;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 mt-8 md:mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page Header & Stepper ── */}
      <div className="bg-white border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">Your Shopping Journey</p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
            </div>
            
            {/* Stepper (Consolidated for cleaner layout) */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl md:w-96 self-start md:self-auto">
              <StepDot active label="Cart" num={1} />
              <div className="flex-1 h-0.5 bg-slate-200" />
              <StepDot label="Checkout" num={2} />
              <div className="flex-1 h-0.5 bg-slate-200" />
              <StepDot label="Done" num={3} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">

        {/* ── Empty State ── */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 md:p-24 text-center max-w-lg mx-auto border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
              <ShoppingBag size={32} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Explore our collections and add products to start your journey.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Continue Shopping <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* ── LEFT: Cart Items (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Products ({cart.length})
                </span>
                <button 
                  onClick={() => {
                    if(confirm("Are you sure you want to clear your cart?")) {
                      localStorage.removeItem("cart");
                      window.location.reload();
                    }
                  }}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Cart Items List */}
              {cart.map((item, i) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.02)] transition-all duration-300 group"
                >
                  <div className="p-5 md:p-6">
                    <div className="flex gap-4 md:gap-6">

                      {/* Image container */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2">
                          <img
                            src={item.images?.[0]}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-slate-900 border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                          {i + 1}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-800 text-sm md:text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {item.title}
                              </h3>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">
                                ID: {item._id?.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            
                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(item._id)}
                              aria-label="Remove item"
                              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0 cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Options/Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 text-[10.5px] font-medium text-slate-500">
                              <Tag size={10} className="text-slate-400" /> SIZE: 37
                            </span>
                            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 text-[10.5px] font-medium text-slate-500">
                              COLOR: Default
                            </span>
                          </div>
                        </div>

                        {/* Price + Qty details */}
                        <div className="flex items-center justify-between mt-4 gap-3 pt-3 border-t border-slate-50">
                          <div>
                            <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Unit price</p>
                            <p className="text-base font-bold text-slate-800">৳{item.price.toLocaleString()}</p>
                          </div>

                          {/* Qty controls */}
                          <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl p-1 border border-slate-100">
                            <button
                              onClick={() => decreaseQuantity(item._id)}
                              aria-label="Decrease quantity"
                              className="w-7.5 h-7.5 flex items-center justify-center rounded-lg bg-white border border-slate-100 hover:bg-slate-100 text-slate-600 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-800 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item._id)}
                              aria-label="Increase quantity"
                              className="w-7.5 h-7.5 flex items-center justify-center rounded-lg bg-white border border-slate-100 hover:bg-slate-100 text-slate-600 transition-all shadow-sm cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Subtotal line */}
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">
                        Subtotal for ({item.quantity} items)
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                </div>
              ))}

              {/* Promo Code section */}
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <div className="flex items-center gap-2 mb-3">
                  <Percent size={14} className="text-indigo-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Apply Promo Code</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-300 focus:bg-white transition-all placeholder:text-slate-300 text-slate-700"
                  />
                  <button className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary (5 Cols) ── */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-[0_16px_48px_rgba(0,0,0,0.02)] overflow-hidden">
                
                {/* Header */}
                <div className="bg-slate-900 px-6 py-5.5 flex items-center gap-2.5">
                  <CreditCard size={18} className="text-slate-400" />
                  <h2 className="text-white font-bold text-md tracking-wide">Order Summary</h2>
                </div>

                <div className="p-6 md:p-8 space-y-6">

                  {/* Pricing lines */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
                      <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Estimated Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? "text-emerald-600 font-bold" : "text-slate-800"}`}>
                        {shipping === 0 ? "FREE" : `৳${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <div className="text-[10.5px] text-amber-700 bg-amber-50/60 border border-amber-100 rounded-xl px-3 py-2 leading-relaxed">
                        Add <span className="font-bold">৳{(2000 - subtotal).toLocaleString()}</span> more to unlock <span className="font-bold">FREE SHIPPING</span>
                      </div>
                    )}
                  </div>

                  {/* savings badge (hardcoded copy from source design, optimized) */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl px-4 py-3 flex justify-between items-center">
                    <span className="text-emerald-700 text-xs font-semibold">🎉 Direct Savings</span>
                    <span className="text-emerald-700 text-sm font-bold">৳5,620</span>
                  </div>

                  {/* Total pricing */}
                  <div className="border-t border-dashed border-slate-150 pt-5.5 flex justify-between items-end">
                    <span className="font-bold text-slate-800 text-sm uppercase tracking-wider">Total Amount</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-2xl tracking-tight">৳{total.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">including local taxes</p>
                    </div>
                  </div>

                  {/* Secure payment badging */}
                  <div className="flex items-start gap-2.5 bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-100">
                    <ShieldCheck size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Guaranteed secure checkout. We support cash on delivery (COD) and 7-day hassle-free refunds.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2.5">
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
                    >
                      Proceed to Checkout
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href="/"
                      className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-850 py-3.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer bg-white"
                    >
                      <Truck size={13} />
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Payment methods */}
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    {["bKash", "Nagad", "Visa", "Mastercard", "COD"].map((m) => (
                      <span
                        key={m}
                        className="text-[9px] font-bold tracking-wide text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1"
                      >
                        {m.toUpperCase()}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ── Stepper Dot ──
function StepDot({ active, label, num }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 border transition-all duration-300 ${
          active
            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
            : "bg-white border-slate-200 text-slate-400"
        }`}
      >
        {num}
      </span>
      <span className={`text-[11px] font-semibold transition-colors duration-300 ${active ? "text-slate-800" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}