"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  PackageCheck,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { generateInvoice } from "@/utils/generateInvoice";
const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const statusColors = {
  Pending:
    "bg-amber-100 text-amber-700",

  Confirmed:
    "bg-blue-100 text-blue-700",

  Processing:
    "bg-violet-100 text-violet-700",

  Shipped:
    "bg-indigo-100 text-indigo-700",

  Delivered:
    "bg-emerald-100 text-emerald-700",

  Cancelled:
    "bg-red-100 text-red-700",
};

const statusIcons = {
  Pending: Clock3,

  Confirmed:
    PackageCheck,

  Processing:
    PackageCheck,

  Shipped: Truck,

  Delivered:
    CheckCircle2,

  Cancelled:
    XCircle,
};

const OrdersPage = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // FETCH ORDERS
  // ======================================

  useEffect(() => {
    const fetchOrders =
      async () => {
        try {
          const res =
            await fetch(
              `${API}/orders`
            );

          const data =
            await res.json();

          if (
            Array.isArray(
              data
            )
          ) {
            setOrders(data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, []);

  // ======================================
  // UPDATE STATUS
  // ======================================

  const updateStatus =
    async (
      id,
      status
    ) => {
      try {
        const res =
          await fetch(
            `${API}/orders/${id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  status,
                }
              ),
            }
          );

        if (res.ok) {
          setOrders((prev) =>
            prev.map(
              (order) =>
                order._id ===
                id
                  ? {
                      ...order,
                      status,
                    }
                  : order
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900">
            Order Management
          </h1>

          <p className="text-slate-400 mt-2">
            Manage customer
            orders & delivery
            status
          </p>
        </div>

        {/* ORDER LIST */}

        <div className="space-y-6">

          {orders.map((order) => {
            const Icon =
              statusIcons[
                order.status
              ];

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >

                {/* TOP */}

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-center gap-3 flex-wrap">

                      <h2 className="text-2xl font-black text-slate-900">
                        #
                        {order._id?.slice(
                          -6
                        )}
                      </h2>

                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                      >
                        <Icon className="w-4 h-4" />

                        {
                          order.status
                        }
                      </div>
                    </div>

                    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                          Customer
                        </p>

                        <h3 className="font-bold text-slate-900 mt-1">
                          {
                            order.customerName
                          }
                        </h3>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                          Email
                        </p>

                        <h3 className="font-medium text-slate-700 mt-1 break-all">
                          {
                            order.email
                          }
                        </h3>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                          Phone
                        </p>

                        <h3 className="font-medium text-slate-700 mt-1">
                          {
                            order.phone
                          }
                        </h3>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                          Total
                        </p>

                        <h3 className="font-black text-indigo-600 text-xl mt-1">
                          $
                          {
                            order.totalPrice
                          }
                        </h3>
                      </div>
                    </div>

                    {/* ADDRESS */}

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                        Delivery Address
                      </p>

                      <p className="text-slate-600 mt-2 leading-relaxed">
                        {
                          order.address
                        }
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-col gap-3 min-w-55">

                    <select
                      value={
                        order.status
                      }
                      onChange={(
                        e
                      ) =>
                        updateStatus(
                          order._id,
                          e.target
                            .value
                        )
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                    >
                      <option>
                        Pending
                      </option>

                      <option>
                        Confirmed
                      </option>

                      <option>
                        Processing
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>

                      <option>
                        Cancelled
                      </option>
                    </select>

                    {/* <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition">
                      <Download className="w-5 h-5" />

                      Download Invoice
                    </button> */}

                                       <button className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition"
                        onClick={() =>
                          generateInvoice(order)
                        }
                      >
                      <Download className="w-5 h-5" />

                        Download Invoice
                      </button>
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className="mt-8 border-t border-slate-100 pt-6">

                  <h3 className="text-lg font-black text-slate-900 mb-5">
                    Ordered Products
                  </h3>

                  <div className="grid gap-4">

                    {order.products?.map(
                      (
                        product,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-4"
                        >

                          <div className="flex items-center gap-4">

                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.title
                              }
                              className="w-20 h-20 rounded-2xl object-cover"
                            />

                            <div>
                              <h4 className="font-bold text-slate-900">
                                {
                                  product.title
                                }
                              </h4>

                              <p className="text-sm text-slate-400 mt-1">
                                Qty:
                                {
                                  product.quantity
                                }
                              </p>
                            </div>
                          </div>

                          <h3 className="text-lg font-black text-indigo-600">
                            $
                            {
                              product.price
                            }
                          </h3>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* EMPTY */}

          {orders.length ===
            0 && (
            <div className="bg-white rounded-3xl border border-slate-200 py-24 text-center">
              <h2 className="text-3xl font-black text-slate-900">
                No Orders Found
              </h2>

              <p className="text-slate-400 mt-3">
                Customer orders
                will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;