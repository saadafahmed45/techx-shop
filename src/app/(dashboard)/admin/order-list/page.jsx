"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Trash2,
  Pencil,
  PackageCheck,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const OrdersListPage = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // =====================================
  // FETCH ORDERS
  // =====================================

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

  // =====================================
  // DELETE ORDER
  // =====================================

  const deleteOrder =
    async (id) => {
      const confirmDelete =
        confirm(
          "Delete this order?"
        );

      if (
        !confirmDelete
      )
        return;

      try {
        const res =
          await fetch(
            `${API}/orders/${id}`,
            {
              method:
                "DELETE",
            }
          );

        if (res.ok) {
          setOrders((prev) =>
            prev.filter(
              (order) =>
                order._id !==
                id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  // =====================================
  // UPDATE STATUS
  // =====================================

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

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredOrders =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.customerName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          order.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          order.phone?.includes(
            search
          ) ||
          order._id
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [orders, search]);

  // =====================================
  // STATUS STYLE
  // =====================================

  const statusStyles = {
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

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Orders List
            </h1>

            <p className="text-slate-400 mt-2">
              Manage all customer
              orders
            </p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-96">

            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search order..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-sm">

          <table className="w-full min-w-300">

            <thead className="border-b border-slate-100 bg-slate-50">

              <tr>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Order ID
                </th>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Customer
                </th>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Phone
                </th>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Total
                </th>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Products
                </th>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Status
                </th>

                <th className="text-left px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Update
                </th>

                <th className="text-right px-6 py-5 text-xs uppercase tracking-widest text-slate-400 font-black">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.map(
                (order) => {
                  const Icon =
                    statusIcons[
                      order.status
                    ];

                  return (
                    <tr
                      key={
                        order._id
                      }
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >

                      {/* ORDER ID */}

                      <td className="px-6 py-5 font-bold text-slate-900">
                        #
                        {order._id?.slice(
                          -6
                        )}
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-5">

                        <h3 className="font-bold text-slate-900">
                          {
                            order.customerName
                          }
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          {
                            order.email
                          }
                        </p>
                      </td>

                      {/* PHONE */}

                      <td className="px-6 py-5 text-slate-600">
                        {
                          order.phone
                        }
                      </td>

                      {/* TOTAL */}

                      <td className="px-6 py-5 font-black text-indigo-600">
                        $
                        {
                          order.totalPrice
                        }
                      </td>

                      {/* PRODUCTS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 flex-wrap">

                          {order.products?.slice(
                            0,
                            2
                          )
                            .map(
                              (
                                product,
                                index
                              ) => (
                                <img
                                  key={
                                    index
                                  }
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.title
                                  }
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                                />
                              )
                            )}

                          {order.products
                            ?.length >
                            2 && (
                            <span className="text-sm text-slate-400 font-medium">
                              +
                              {order
                                .products
                                .length -
                                2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <div
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${statusStyles[order.status]}`}
                        >
                          <Icon className="w-4 h-4" />

                          {
                            order.status
                          }
                        </div>
                      </td>

                      {/* UPDATE */}

                      <td className="px-6 py-5">

                        <select
                          value={
                            order.status
                          }
                          onChange={(
                            e
                          ) =>
                            updateStatus(
                              order._id,
                              e
                                .target
                                .value
                            )
                          }
                          className="border border-slate-200 rounded-xl px-4 py-2 bg-white outline-none focus:border-indigo-500"
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
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-3">

                          <button className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition">
                            <Pencil className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() =>
                              deleteOrder(
                                order._id
                              )
                            }
                            className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          {/* EMPTY */}

          {filteredOrders.length ===
            0 && (
            <div className="py-24 text-center">

              <h2 className="text-3xl font-black text-slate-900">
                No Orders Found
              </h2>

              <p className="text-slate-400 mt-3">
                Try another search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersListPage;