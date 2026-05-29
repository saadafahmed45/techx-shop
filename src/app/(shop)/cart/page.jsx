"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  ShoppingCart,
  ShieldCheck,
  CreditCard,
  Truck,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#fafafa] px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP HEADER */}
        <div className="flex justify-between items-center mb-12">

          <div className="flex items-center gap-3">
            <ShoppingCart size={30} />

            <h1 className="text-2xl font-">
              Shopping Cart
            </h1>
          </div>

          <p className="text-gray-500 text-lg">
            {cart.length} items
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center">
            <h2 className="text-3xl font-bold">
              Cart Empty
            </h2>

            <Link
              href="/"
              className="mt-5 inline-block px-6 py-3 bg-pink-600 text-white rounded-xl"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-2">

              {/* title row */}
              <div className="flex justify-between mb-6">

                <h2 className="text-2xl ">
                  Cart Items ({cart.length})
                </h2>

                <p className="text-gray-500">
                  Total: Tk {total}
                </p>
              </div>

              <div className="space-y-5">

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white shadow-sm rounded-3xl p-6"
                  >
                    <div className="flex gap-5">

                      {/* IMAGE */}
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-28 h-28 rounded-2xl object-cover"
                      />

                      {/* CONTENT */}
                      <div className="flex-1">

                        {/* TOP */}
                        <div className="flex justify-between">

                          <div>

                            <h2 className="font-semibold text-xl">
                              {item.title}
                            </h2>

                            <p className="text-gray-400 mt-1">
                              SKU: {item._id?.slice(0, 8)}
                            </p>

                            <div className="flex gap-3 mt-3">

                              <span className="border rounded-lg px-3 py-1 text-sm">
                                SIZE: 37
                              </span>

                              <span className="border rounded-lg px-3 py-1 text-sm">
                                COLOR: Default
                              </span>

                            </div>

                           



    {/* qty */}
                         
                          </div>

                          <button
                            onClick={() =>
                              removeItem(item._id)
                            }
                            className="text-gray-400"
                          >
                            <Trash2 />
                          </button>
                        </div>



<div className="flex justify-between items-end mt-5">
 <p className="text-pink-600 text-xl font-medium mt-4">
                              Tk {item.price}

                              <span className="text-gray-500 text-lg ml-2">
                                each
                              </span>
                            </p>


     <div className="flex gap-2 items-center">

                              <button
                                onClick={() =>
                                  decreaseQuantity(
                                    item._id
                                  )
                                }
                                className="w-10 h-10 rounded-xl border border-pink-500 text-pink-500"
                              >
                                -
                              </button>

                              <div className="border border-pink-500 px-5 py-2 rounded-xl">
                                {item.quantity}
                              </div>

                              <button
                                onClick={() =>
                                  increaseQuantity(
                                    item._id
                                  )
                                }
                                className="w-10 h-10 rounded-xl border border-pink-500 text-pink-500"
                              >
                                +
                              </button>
                            </div>
</div>


                        <hr className="my-5" />

                        {/* bottom */}
                        <div className="flex justify-between items-end">

                          <div>
                            <p className="text-gray-500">
                              Subtotal
                            </p>
                          </div>

                          <div className="flex items-center gap-6">

                        

                            <h2 className="text-2xl text-pink-600 font-medium">
                              Tk{" "}
                              {item.price *
                                item.quantity}
                            </h2>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="bg-white shadow-md rounded-3xl p-7 h-fit sticky top-10">

              <div className="flex gap-3 items-center mb-8">
                <CreditCard size={22} />

                <h2 className="text-2xl font-semibold">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-5">

                <div className="flex justify-between">
                  <span>
                    Items ({cart.length})
                  </span>

                  <span>
                    Tk {total}
                  </span>
                </div>

                <div className="bg-green-100 rounded-xl px-4 py-3 flex justify-between text-green-700 font-medium">

                  <span>
                    You saved
                  </span>

                  <span>
                    Tk 5620 (23%)
                  </span>

                </div>

                <hr />

                <div className="flex justify-between text-2xl font-medium">

                  <span>Total</span>

                  <span>
                    Tk {total}
                  </span>

                </div>

                <div className="bg-green-50 rounded-xl p-4 flex gap-2 text-green-700">

                  <ShieldCheck size={20} />

                  <span>
                    Secure Checkout &
                    COD Available
                  </span>

                </div>

                <Link
                  href="/checkout"
                  className="block text-center bg-pink-600 text-white py-4 rounded-xl font-semibold mt-6"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="border border-pink-600 text-pink-600 py-4 rounded-xl block text-center mt-4"
                >
                  <div className="flex justify-center gap-2">
                    <Truck size={18} />
                    Continue Shopping
                  </div>
                </Link>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}