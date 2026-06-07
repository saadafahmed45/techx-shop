"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, ShieldCheck, CreditCard, Truck, Plus, Minus, ArrowRight, Tag } from "lucide-react";

export default function CartPage() {
  const { cart, removeItem, increaseQuantity, decreaseQuantity } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 120;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Your</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-600">
                <ShoppingBag size={14} />
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12">

        {/* ── Empty State ── */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 md:p-24 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-700 transition-all">
              Continue Shopping <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6 md:gap-8 items-start">

            {/* ── LEFT: Cart Items ── */}
            <div className="lg:col-span-3 space-y-4">

              {/* Breadcrumb steps */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-bold text-gray-900 bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-gray-900">Cart</span>
                <div className="flex-1 h-px bg-gray-200 mx-1" />
                <span className="text-xs font-bold text-gray-300 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">2</span>
                <span className="text-xs text-gray-400">Checkout</span>
                <div className="flex-1 h-px bg-gray-200 mx-1" />
                <span className="text-xs font-bold text-gray-300 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">3</span>
                <span className="text-xs text-gray-400">Done</span>
              </div>

              {cart.map((item, i) => (
                <div key={item._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all group">
                  <div className="p-5 md:p-6">
                    <div className="flex gap-4 md:gap-5">

                      {/* Image */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gray-50">
                          <img
                            src={item.images?.[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {/* item number badge */}
                        <span className="absolute -top-2 -left-2 w-5 h-5 bg-gray-900 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-black text-gray-900 text-base md:text-lg leading-tight truncate">{item.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{item._id?.slice(-8).toUpperCase()}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                            <Tag size={8} /> SIZE: 37
                          </span>
                          <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                            COLOR: Default
                          </span>
                        </div>

                        {/* Price + Qty row */}
                        <div className="flex items-center justify-between mt-4 gap-3">
                          <div>
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Unit price</p>
                            <p className="text-lg font-black text-gray-900">৳{item.price.toLocaleString()}</p>
                          </div>

                          {/* Qty control */}
                          <div className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-200">
                            <button
                              onClick={() => decreaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal bar */}
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">
                        {item.quantity} × ৳{item.price.toLocaleString()}
                      </span>
                      <span className="text-base font-black text-gray-900">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo code */}
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Promo Code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition-all placeholder-gray-300"
                  />
                  <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-700 transition-all">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-2 space-y-4 sticky top-20">

              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 px-6 py-5">
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={18} className="text-white/70" />
                    <h2 className="text-white font-black text-lg">Order Summary</h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Line items */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                      <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                        {shipping === 0 ? "FREE" : `৳${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[11px] text-gray-400 bg-amber-50 rounded-xl px-3 py-2">
                        Add ৳{(2000 - subtotal).toLocaleString()} more for free shipping
                      </p>
                    )}
                  </div>

                  {/* Savings pill */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex justify-between items-center">
                    <span className="text-green-700 text-sm font-bold">🎉 You're saving</span>
                    <span className="text-green-700 text-sm font-black">৳5,620</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="font-black text-gray-900 text-lg">Total</span>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-2xl">৳{total.toLocaleString()}</p>
                        <p className="text-[11px] text-gray-400">incl. all taxes</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust badge */}
                  <div className="flex items-center gap-2.5 bg-gray-50 rounded-2xl px-4 py-3">
                    <ShieldCheck size={16} className="text-gray-500 shrink-0" />
                    <p className="text-[12px] text-gray-500 font-medium leading-snug">
                      Secure checkout · COD available · Easy returns
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white py-4 rounded-2xl font-black text-sm tracking-wide transition-all group"
                  >
                    Proceed to Checkout
                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                  >
                    <Truck size={14} />
                    Continue Shopping
                  </Link>

                  {/* Payment icons */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    {["bKash", "Nagad", "Card", "COD"].map((m) => (
                      <span key={m} className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                        {m}
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