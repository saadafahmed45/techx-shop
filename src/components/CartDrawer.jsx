"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FALLBACK = "https://picsum.photos/120/120";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 5000;
  const freeShippingProgress = Math.min(100, (total / freeShippingThreshold) * 100);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-105 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h2 className="text-sm font-bold text-neutral-950">
              Your Bag ({itemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100">
            <div className="flex justify-between text-[11px] font-medium text-neutral-600 mb-1.5">
              <span>
                {total >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-semibold">
                    ✓ You qualify for Free Delivery!
                  </span>
                ) : (
                  <>Add ৳{(freeShippingThreshold - total).toLocaleString()} for Free Delivery</>
                )}
              </span>
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-sm">
                  Your shopping bag is empty
                </p>
                <p className="text-neutral-400 text-xs mt-1">
                  Discover tech essentials and upgrade your workspace
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const rawImg = Array.isArray(item.images) ? item.images[0] : item.images;
              const img =
                typeof rawImg === "string" ? rawImg.replace(/[\[\]"]/g, "") : FALLBACK;

              return (
                <div
                  key={item._id}
                  className="flex gap-3.5 p-3 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-300 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg bg-[#f6f6f7] p-1 shrink-0 overflow-hidden">
                    <Image
                      src={img}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-contain mix-blend-multiply p-1"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.slug || item._id}`}
                        onClick={closeCart}
                        className="text-xs font-medium text-neutral-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        ৳{Number(item.price || 0).toLocaleString()} each
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-md bg-neutral-50 px-1.5 h-6">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="text-neutral-500 hover:text-neutral-900 p-0.5 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-[11px] font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="text-neutral-500 hover:text-neutral-900 p-0.5 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-950">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-neutral-300 hover:text-red-500 transition-colors self-start p-1 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-100 bg-white space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-neutral-500 font-medium">Subtotal</span>
              <span className="text-base font-bold text-neutral-950">
                ৳{total.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Taxes and shipping calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/cart"
              onClick={closeCart}
              className="flex items-center justify-center w-full h-10 border border-neutral-200 hover:border-indigo-300 hover:text-indigo-600 text-neutral-700 rounded-lg text-xs font-medium transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}