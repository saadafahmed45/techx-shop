"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { useCart } from "@/context/CartContext";
import Swal from "sweetalert2";

const API =
  process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutPage() {
  const router =
    useRouter();

  const {
    cart,
    clearCart,
  } = useCart();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

  const totalPrice =
    cart.reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const orderData = {
          customerName:
            formData.name,

          email:
            formData.email,

          phone:
            formData.phone,

          address:
            formData.address,

          products: cart,

          totalPrice,

          paymentMethod:
            "Cash On Delivery",

          status: "Pending",
        };

        const res =
          await fetch(
            `${API}/orders`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                orderData
              ),
            }
          );

        const data =
          await res.json();

        // if (res.ok) {
        //   clearCart();

        //   router.push(
        //     "/success"
        //   );
        // }

        console.log(data);

       Swal.fire({
                   icon: "success",
                   title:
                     "Order Place Successfully",
                   confirmButtonColor:
                     "#4f46e5",
                 });
               } catch (err) {
                 Swal.fire({
                   icon: "error",
                   title:
                     err.message ||
                     "Order failed to place",
                 })
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-4xl font-black mb-8">
        Checkout
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-5"
      >

        <input
          type="text"
          placeholder="Full Name"
          required
          className="w-full border rounded-2xl p-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              name:
                e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border rounded-2xl p-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone Number"
          required
          className="w-full border rounded-2xl p-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              phone:
                e.target.value,
            })
          }
        />

        <textarea
          placeholder="Address"
          required
          className="w-full border rounded-2xl p-4 h-32"
          onChange={(e) =>
            setFormData({
              ...formData,
              address:
                e.target.value,
            })
          }
        />

        <button
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-black text-white font-bold"
        >
          {loading
            ? "Processing..."
            : `Place Order ($${totalPrice})`}
        </button>
      </form>
    </div>
  );
}