"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* BACKDROP */}
      {isCartOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-95 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-black">Your Cart</h2>

          <button onClick={closeCart}>
            <X />
          </button>
        </div>

        {/* ITEMS */}
        <div className="p-5 space-y-4 overflow-y-auto h-[70%]">
          {cart.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">
              Cart is empty
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 border rounded-xl p-3"
              >
                <img
                  src={item.images[0]}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h4 className="font-bold text-sm">
                    {item.title}
                  </h4>

                  <p className="text-indigo-600 font-bold">
                    ${item.price}
                  </p>

                  {/* QTY */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="p-1 border rounded"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="p-1 border rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 w-full border-t p-5 bg-white">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-black text-indigo-600">
              ${total}
            </span>
          </div>

          <Link  href="/checkout"       className="px-4 py-2 bg-black text-white rounded-xl">
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
}