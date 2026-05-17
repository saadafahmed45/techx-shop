"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";

import {
  Search,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  Package,
  CheckCircle2,
  Clock3,
  Loader2,
  ImageIcon,
} from "lucide-react";

import Swal from "sweetalert2";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function ManageProducts() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [editModal, setEditModal] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts =
    useCallback(async () => {
      try {
        const res = await fetch(
          `${API}/products`
        );

        const data =
          await res.json();

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.log(err);

        Swal.fire({
          icon: "error",
          title:
            "Failed to fetch products",
          confirmButtonColor:
            "#4f46e5",
        });
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // =========================================
  // FILTER
  // =========================================

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (product) => {
          const q =
            search.toLowerCase();

          const matchSearch =
            product.title
              ?.toLowerCase()
              .includes(q) ||
            product.vendor
              ?.toLowerCase()
              .includes(q) ||
            product.productType
              ?.toLowerCase()
              .includes(q);

          const matchStatus =
            status === "all"
              ? true
              : product.status ===
                status;

          return (
            matchSearch &&
            matchStatus
          );
        }
      );
    }, [
      products,
      search,
      status,
    ]);

  // =========================================
  // DELETE
  // =========================================

  const handleDelete =
    async (id) => {
      const result =
        await Swal.fire({
          title:
            "Delete Product?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:
            "#ef4444",
          cancelButtonColor:
            "#d1d5db",
          confirmButtonText:
            "Delete",
        });

      if (!result.isConfirmed)
        return;

      try {
        const res = await fetch(
          `${API}/products/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok)
          throw new Error();

        setProducts((prev) =>
          prev.filter(
            (p) => p._id !== id
          )
        );

        Swal.fire({
          icon: "success",
          title:
            "Deleted Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title:
            "Delete Failed",
        });
      }
    };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-7">
      <div className="max-w-7xl mx-auto">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Products
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {
                filteredProducts.length
              }{" "}
              of {products.length}{" "}
              products
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={
                fetchProducts
              }
              className="h-11 px-5 rounded-xl border border-gray-200 bg-white flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <Link
              href="/admin/add-products"
              className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* ================================= */}
        {/* FILTER */}
        {/* ================================= */}

        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm outline-none"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="draft">
              Draft
            </option>
          </select>
        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* TABLE HEAD */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
            <div className="col-span-1">
              #
            </div>

            <div className="col-span-4">
              Product
            </div>

            <div className="col-span-2">
              Type
            </div>

            <div className="col-span-1">
              Price
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-2 text-right">
              Actions
            </div>
          </div>

          {/* PRODUCTS */}
          {filteredProducts.map(
            (
              product,
              index
            ) => (
              <div
                key={
                  product._id
                }
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50/70 transition"
              >

                {/* NUMBER */}
                <div className="lg:col-span-1 flex items-center text-sm text-gray-500 font-medium">
                  {index + 1}
                </div>

                {/* PRODUCT */}
                <div className="lg:col-span-4 flex items-center gap-4">
                  {product
                    .images?.[0] ? (
                    <img
                      src={
                        product
                          .images[0]
                      }
                      alt={
                        product.title
                      }
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {
                        product.title
                      }
                    </h2>

                    <p className="text-sm text-gray-400 truncate">
                      {product.vendor ||
                        "No vendor"}
                    </p>
                  </div>
                </div>

                {/* TYPE */}
                <div className="lg:col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    {product.productType ||
                      "—"}
                  </span>
                </div>

                {/* PRICE */}
                <div className="lg:col-span-1 flex items-center">
                  <span className="font-bold text-gray-900">
                    $
                    {Number(
                      product.price ||
                        0
                    ).toFixed(2)}
                  </span>
                </div>

                {/* STATUS */}
                <div className="lg:col-span-2 flex items-center">
                  {product.status ===
                  "draft" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      <Clock3 className="w-3 h-3" />
                      Draft
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="lg:col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(
                        product
                      );

                      setEditModal(
                        true
                      );
                    }}
                    className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        product._id
                      )
                    }
                    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================================= */}
      {/* EDIT MODAL */}
      {/* ================================= */}

      {editModal &&
        selectedProduct && (
          <EditProductModal
            product={
              selectedProduct
            }
            onClose={() =>
              setEditModal(false)
            }
            onUpdated={(
              updated
            ) => {
              setProducts(
                (prev) =>
                  prev.map((p) =>
                    p._id ===
                    updated._id
                      ? updated
                      : p
                  )
              );

              setEditModal(
                false
              );
            }}
          />
        )}
    </div>
  );
}

// =========================================
// EDIT MODAL
// =========================================

function EditProductModal({
  product,
  onClose,
  onUpdated,
}) {
  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title:
        product.title || "",
      price:
        product.price || "",
      vendor:
        product.vendor || "",
      productType:
        product.productType ||
        "",
      description:
        product.description ||
        "",
      status:
        product.status ||
        "draft",
    });

  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
// ==========================================
// FRONTEND UPDATE FIX
// ==========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const data = new FormData();

    Object.entries(formData).forEach(
      ([key, value]) => {
        data.append(key, value);
      }
    );

    // ONLY APPEND IF NEW IMAGE EXISTS
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        data.append("images", file);
      });
    }

    const res = await fetch(
      `${API}/products/${product._id}`,
      {
        method: "PUT",

        headers: {
          Accept: "application/json",
        },

        body: data,
      }
    );

    // ======================================
    // DEBUG RESPONSE
    // ======================================
    const text = await res.text();

    console.log(text);

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      throw new Error(
        "Server returned invalid JSON"
      );
    }

    if (!res.ok) {
      throw new Error(
        result.message ||
          "Update failed"
      );
    }

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text:
        "Product updated successfully",
      timer: 2000,
      showConfirmButton: false,
      confirmButtonColor: "#4f46e5",
    });

    onUpdated(result.data);
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        err.message ||
        "Update failed",
    });
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Edit Product
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update product
              details
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="p-6 space-y-5"
        >

          <div className="grid md:grid-cols-2 gap-4">

            {/* TITLE */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* VENDOR */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vendor
              </label>

              <input
                type="text"
                name="vendor"
                value={
                  formData.vendor
                }
                onChange={
                  handleChange
                }
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Product Type
              </label>

              <input
                type="text"
                name="productType"
                value={
                  formData.productType
                }
                onChange={
                  handleChange
                }
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">
                  Active
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </label>

              <textarea
                rows={4}
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 transition disabled:opacity-60"
            >
              {saving && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}