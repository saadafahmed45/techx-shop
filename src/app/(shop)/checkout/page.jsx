"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
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

        // ── Build query params for success page ──
        const params = new URLSearchParams({
          orderId:  data.insertedId || data._id || data.orderId || "",
          name:     formData.name,
          phone:    formData.phone,
          email:    formData.email,
          address:  `${formData.address}, ${formData.district}, ${formData.division}`,
          total:    totalPrice.toString(),
          items:    cart.length.toString(),
        });

        Swal.fire({
          icon: "success",
          title: "Order Placed Successfully",
          confirmButtonColor: "#2563eb",
        }).then(() => router.push(`/order-success?${params.toString()}`));
      } else {
        throw new Error(data?.message || "Something went wrong");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message || "Order failed to place",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 py-18">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

            {/* LEFT — Delivery Information */}
            <div>
              <h1 className="text-xl font-semibold mb-6">Delivery Information</h1>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name <span className="text-slate-950">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                    onChange={handleChange("name")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-slate-950">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      required
                      value={formData.phone}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                      onChange={handleChange("phone")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email (optional)</label>
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                      onChange={handleChange("email")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Division <span className="text-slate-950">*</span>
                    </label>
                    <select
                      required
                      value={formData.division}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                      onChange={handleChange("division")}
                    >
                      <option value="" disabled>Select Division</option>
                      {Object.keys(DIVISIONS_DISTRICTS).map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      District <span className="text-slate-950">*</span>
                    </label>
                    <select
                      required
                      value={formData.district}
                      disabled={!formData.division}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                  <label className="block text-sm font-medium mb-1">
                    Address <span className="text-slate-950">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="House / Road / Area"
                    required
                    value={formData.address}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-600"
                    onChange={handleChange("address")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Order Note</label>
                  <textarea
                    placeholder="Any special instruction (optional)"
                    value={formData.note}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:border-blue-600"
                    onChange={handleChange("note")}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <span className="text-2xl">🚚</span>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>
              ) : (
                <div className="space-y-4 mb-4">
                  {cart.map((item, i) => (
                    <div key={item._id ?? i} className="flex items-start gap-3">
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.title}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {item.size && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">size: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">color: {item.color}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button type="button" onClick={() => decreaseQuantity(item._id)}
                            className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 text-sm flex items-center justify-center hover:border-blue-600">−</button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => increaseQuantity(item._id)}
                            className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 text-sm flex items-center justify-center hover:border-blue-600">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button type="button" onClick={() => removeItem(item._id)}
                          className="text-gray-300 hover:text-red-500 transition-colors" aria-label="Remove item">🗑</button>
                        <span className="text-sm font-semibold">Tk {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <hr className="my-3 border-gray-100" />

              {/* Coupon */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 mb-4">
                <p className="text-sm font-medium mb-2">🏷 Have a coupon?</p>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
                  />
                  <button type="button"
                    className="border border-blue-700 text-blue-700 rounded-r-xl px-4 text-sm font-semibold hover:bg-blue-50 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-black font-medium">Tk {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Charge</span>
                  <span className="text-black font-medium">Tk 0</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>Tk {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center mb-3">
                <a href="#" className="text-xs text-blue-600 underline">Read Exchange Policy</a>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Place Order — Tk ${totalPrice.toLocaleString()}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}