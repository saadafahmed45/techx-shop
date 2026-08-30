"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_URL;

const DIVISIONS_DISTRICTS = {
  Dhaka: [
    "Dhaka", "Gazipur", "Narayanganj", "Narsingdi", "Manikganj",
    "Munshiganj", "Rajbari", "Shariatpur", "Faridpur", "Madaripur",
    "Gopalganj", "Kishoreganj", "Tangail",
  ],
  Chittagong: [
    "Chittagong", "Cox's Bazar", "Comilla", "Feni", "Brahmanbaria",
    "Lakshmipur", "Chandpur", "Noakhali", "Rangamati", "Khagrachhari",
    "Bandarban",
  ],
  Rajshahi: [
    "Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore",
    "Naogaon", "Chapainawabganj", "Joypurhat",
  ],
  Khulna: [
    "Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail",
    "Magura", "Jhenaidah", "Kushtia", "Meherpur", "Chuadanga",
  ],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Barisal: ["Barisal", "Bhola", "Patuakhali", "Pirojpur", "Jhalokati", "Barguna"],
  Rangpur: [
    "Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari",
    "Lalmonirhat", "Panchagarh", "Thakurgaon",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, removeItem, increaseQuantity, decreaseQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    division: "",
    district: "",
    address: "",
    note: "",
  });

  const districts = formData.division ? DIVISIONS_DISTRICTS[formData.division] ?? [] : [];

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (field) => (e) => {
    const update = { ...formData, [field]: e.target.value };
    if (field === "division") update.district = "";
    setFormData(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.district}, ${formData.division}`,
        note: formData.note,
        products: cart,
        totalPrice,
        paymentMethod: "Cash On Delivery",
        status: "Pending",
      };

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();

        const params = new URLSearchParams({
          orderId: data.insertedId || data._id || data.orderId || "",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.district}, ${formData.division}`,
          total: totalPrice.toString(),
          items: cart.length.toString(),
        });

        Swal.fire({
          icon: "success",
          title: "Order Placed Successfully",
          text: "Thank you for shopping with TechX Shop.",
          confirmButtonColor: "#09090b",
        }).then(() => router.push(`/order-success?${params.toString()}`));
      } else {
        throw new Error(data?.message || "Failed to place order.");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: err.message || "Something went wrong while processing your order.",
        confirmButtonColor: "#09090b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="pb-8 border-b border-neutral-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Final Step
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 mt-1">
            Express Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT — Delivery Information (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-xl border border-neutral-200/80 bg-white space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Shipping & Contact Details
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    required
                    value={formData.name}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    onChange={handleChange("name")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      required
                      value={formData.phone}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                      onChange={handleChange("phone")}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                      onChange={handleChange("email")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Division <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.division}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-all cursor-pointer"
                      onChange={handleChange("division")}
                    >
                      <option value="" disabled>Select Division</option>
                      {Object.keys(DIVISIONS_DISTRICTS).map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.district}
                      disabled={!formData.division}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-neutral-900 focus:bg-white transition-all disabled:opacity-50 cursor-pointer"
                      onChange={handleChange("district")}
                    >
                      <option value="" disabled>
                        {formData.division ? "Select District" : "Select Division first"}
                      </option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Street Address & House / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="House number, road number, apartment, area"
                    required
                    value={formData.address}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    onChange={handleChange("address")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Delivery Note (Optional)
                  </label>
                  <textarea
                    placeholder="Any specific delivery instructions or preferences..."
                    value={formData.note}
                    rows={2}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:bg-white resize-none transition-all"
                    onChange={handleChange("note")}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    <span className="text-xs font-bold text-neutral-900">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    Pay upon receipt
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 pl-6.5">
                  Inspect your parcel with the courier delivery agent before completing your payment.
                </p>
              </div>
            </div>

            {/* RIGHT — Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Items in Order ({cart.length})
                </h3>

                {cart.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">
                    Your cart is empty.
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-neutral-200/60 pr-1 space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 pt-2 first:pt-0"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-white border border-neutral-200 p-1 shrink-0 overflow-hidden">
                          <Image
                            src={item.images?.[0] || "https://picsum.photos/80"}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-neutral-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Qty: {item.quantity} × ৳{Number(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-neutral-950 shrink-0">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      ৳{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Charge</span>
                    <span className="text-emerald-700 font-semibold">Free Delivery</span>
                  </div>
                  <div className="flex justify-between text-neutral-950 font-bold text-base pt-2 border-t border-neutral-200">
                    <span>Total Due</span>
                    <span>৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full flex items-center justify-center gap-2 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                  <span>
                    {loading
                      ? "Placing Your Order..."
                      : `Confirm Order — ৳${totalPrice.toLocaleString()}`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-2 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-400" />
                  <span>Buyer Protection & Official Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-400" />
                  <span>2–4 Days Nationwide Express Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}