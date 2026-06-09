"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

const FALLBACK = "https://picsum.photos/80/80";

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

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <ShoppingBag size={16} className="text-stone-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-none">Your Cart</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {itemCount === 0
                  ? "No items"
                  : `${itemCount} item${itemCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-colors"
            aria-label="Close cart"
          >
            <X size={15} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center">
                <ShoppingBag size={28} className="text-stone-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-stone-700 text-sm">Your cart is empty</p>
                <p className="text-stone-400 text-xs mt-1">Add some items to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 bg-stone-50 border border-stone-100 rounded-xl p-3 hover:border-stone-200 transition-colors"
              >
                {/* Image */}
                <div className="w-17.5 h-17.5 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                  <img
                    src={item.images?.[0] || FALLBACK}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 text-sm line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  {item.vendor && (
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide mt-0.5">
                      {item.vendor}
                    </p>
                  )}
                  <p className="text-stone-900 font-bold text-sm mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="w-6 h-6 rounded-md border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-semibold text-stone-800 min-w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="w-6 h-6 rounded-md border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={11} />
                    </button>
                    <span className="text-[11px] text-stone-400 ml-1">
                      ${item.price} each
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0 mt-0.5"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-100 bg-white">
            {/* Order summary */}
            <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="h-px bg-stone-200 my-1" />
              <div className="flex justify-between">
                <span className="font-bold text-stone-900 text-sm">Total</span>
                <span className="font-bold text-stone-900 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center w-full h-12 bg-stone-900 hover:bg-stone-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Proceed to Checkout →
            </Link>
            <button
              onClick={closeCart}
              className="w-full mt-2 h-10 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}