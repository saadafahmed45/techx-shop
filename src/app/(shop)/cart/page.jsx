"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-slate-900">
          Shopping Cart
        </h1>
        <p className="text-slate-400 mt-2">
          Review your selected products before checkout
        </p>
      </div>

      {/* EMPTY STATE */}
      {cart.length === 0 ? (
        <div className="max-w-5xl mx-auto bg-white border rounded-3xl p-16 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h2>
          <p className="text-slate-400 mt-2">
            Add some products to continue shopping
          </p>

          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-xl"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT - CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">

            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white  rounded-3xl p-5 flex gap-5 shadow-md hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <img
                  src={item.images[0]}
                  className="w-24 h-24 object-cover rounded-2xl border"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-slate-900">
                    {item.title}
                  </h2>

                  <p className="text-indigo-600 font-black mt-1">
                    ${item.price}
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-4">

                    <button
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                      className="w-9 h-9 rounded-xl border hover:bg-slate-100"
                    >
                      -
                    </button>

                    <span className="font-bold w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                      className="w-9 h-9 rounded-xl border hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ACTION */}
                <div className="flex flex-col justify-between items-end">

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 />
                  </button>

                  <p className="font-black text-slate-900">
                    ${item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="bg-white border rounded-3xl p-6 h-fit shadow-md sticky top-10">

            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-slate-600">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-black text-slate-900 text-lg">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block mt-6 w-full text-center bg-black text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="block mt-3 text-center text-sm text-slate-500 hover:text-slate-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}