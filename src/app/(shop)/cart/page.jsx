"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const FALLBACK = "https://picsum.photos/120/120";

export default function CartPage() {
  const { cart, removeItem, increaseQuantity, decreaseQuantity, clearCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 120;
  const total = subtotal + shipping;

  return (
    <div className="min-h-[80vh] bg-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Review Bag
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              Shopping Cart ({cart.length})
            </h1>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear your cart?")) {
                  clearCart();
                }
              }}
              className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Explore our tech catalog and add your favorite items to get started.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-[#09090b] hover:bg-neutral-800 text-white text-xs font-medium transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-8 items-start">
            {/* LEFT: Cart Items (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => {
                const rawImg = Array.isArray(item.images) ? item.images[0] : item.images;
                const img =
                  typeof rawImg === "string" ? rawImg.replace(/[\[\]"]/g, "") : FALLBACK;

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg bg-[#f6f6f7] p-2 shrink-0 overflow-hidden">
                      <Image
                        src={img}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.slug || item._id}`}
                            className="font-medium text-xs sm:text-sm text-neutral-900 hover:text-neutral-600 truncate leading-snug"
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Unit Price: ৳{Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-neutral-200 rounded-md bg-white">
                          <button
                            onClick={() => decreaseQuantity(item._id)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item._id)}
                            className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-neutral-950">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                <h3 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs divide-y divide-neutral-200/60">
                  <div className="flex justify-between text-neutral-600 pb-2">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600 py-2">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-neutral-900">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-semibold">Free Delivery</span>
                      ) : (
                        `৳${shipping}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-950 font-bold text-base pt-3">
                    <span>Total Amount</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-[11px] text-neutral-400 text-center">
                  Cash on Delivery & Instant Confirmation
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-4 rounded-xl border border-neutral-200/80 bg-white grid grid-cols-2 gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-400" />
                  <span>Free over ৳5,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-400" />
                  <span>Secure Order</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                  <span>7-Day Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-neutral-400" />
                  <span>100% Genuine</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}