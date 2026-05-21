"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  Search,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock3,
  Loader2,
  ImageIcon,
  Package,
  X,
  ChevronDown,
  Star,
  UploadCloud,
} from "lucide-react";

import Swal from "sweetalert2";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */

export default function ManageProducts() {
  const [products, setProducts] =
    useState([]);

  const [collections, setCollections] =
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

  // FETCH PRODUCTS
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
        });
      } finally {
        setLoading(false);
      }
    }, []);

  // FETCH COLLECTIONS
  const fetchCollections =
    useCallback(async () => {
      try {
        const res = await fetch(
          `${API}/collections`
        );

        const data =
          await res.json();

        setCollections(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.log(err);
      }
    }, []);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, [
    fetchProducts,
    fetchCollections,
  ]);

  // FILTER PRODUCTS
  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (p) => {
          const q =
            search.toLowerCase();

          const matchSearch =
            p.title
              ?.toLowerCase()
              .includes(q) ||
            p.vendor
              ?.toLowerCase()
              .includes(q) ||
            p.productType
              ?.toLowerCase()
              .includes(q);

          const matchStatus =
            status === "all"
              ? true
              : p.status ===
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

  // DELETE
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
          title: "Deleted",
          timer: 1400,
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

  const activeCount =
    products.filter(
      (p) =>
        p.status === "active"
    ).length;

  const draftCount =
    products.filter(
      (p) =>
        p.status === "draft"
    ).length;

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />

        <p className="mt-4 text-sm text-slate-400">
          Loading Products...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Products
            </h1>

            <p className="text-sm text-slate-400 mt-1">
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
              className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-medium flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <Link
              href="/admin/add-products"
              className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">
              Total
            </h3>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {products.length}
            </p>
          </div>

          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-5">
            <h3 className="text-emerald-500 text-xs uppercase tracking-widest font-bold">
              Active
            </h3>

            <p className="mt-2 text-3xl font-black text-emerald-700">
              {activeCount}
            </p>
          </div>

          <div className="bg-amber-50 rounded-3xl border border-amber-100 p-5">
            <h3 className="text-amber-500 text-xs uppercase tracking-widest font-bold">
              Draft
            </h3>

            <p className="mt-2 text-3xl font-black text-amber-700">
              {draftCount}
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3">

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="appearance-none h-11 px-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
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

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

          {/* HEAD */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-widest text-slate-400 font-bold">
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

            <div className="col-span-1">
              Status
            </div>

            <div className="col-span-1">
              Featured
            </div>

            <div className="col-span-2">
              Actions
            </div>
          </div>

          {/* PRODUCTS */}
          {filteredProducts.length ===
          0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Package className="w-12 h-12" />

              <p className="mt-4 font-semibold">
                No Products Found
              </p>
            </div>
          ) : (
            filteredProducts.map(
              (
                product,
                index
              ) => (
                <div
                  key={
                    product._id
                  }
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  {/* NUMBER */}
                  <div className="lg:col-span-1 flex items-center text-sm text-slate-400 font-semibold">
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
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="font-bold text-slate-900 truncate">
                        {
                          product.title
                        }
                      </h2>

                      <p className="text-sm text-slate-400 truncate">
                        {product.vendor ||
                          "No vendor"}
                      </p>
                    </div>
                  </div>

                  {/* TYPE */}
                  <div className="lg:col-span-2 flex items-center text-sm text-slate-500">
                    {product.productType ||
                      "—"}
                  </div>

                  {/* PRICE */}
                  <div className="lg:col-span-1 flex items-center font-bold text-indigo-600">
                    $
                    {Number(
                      product.price ||
                        0
                    ).toFixed(2)}
                  </div>

                  {/* STATUS */}
                  <div className="lg:col-span-1 flex items-center">
                    {product.status ===
                    "draft" ? (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        Draft
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>

                  {/* FEATURED */}
                  <div className="lg:col-span-1 flex items-center">
                    {product.featured ? (
                      <span className="inline-flex items-center gap-1 text-yellow-500 text-xs font-bold">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="lg:col-span-2 flex items-center gap-2">

                    <button
                      onClick={() => {
                        setSelectedProduct(
                          product
                        );

                        setEditModal(
                          true
                        );
                      }}
                      className="w-10 h-10 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          product._id
                        )
                      }
                      className="w-10 h-10 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* MODAL */}
      {editModal &&
        selectedProduct && (
          <EditProductModal
            product={
              selectedProduct
            }
            collections={
              collections
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

/* ─────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────── */

function EditProductModal({
  product,
  collections,
  onClose,
  onUpdated,
}) {
  const [saving, setSaving] =
    useState(false);

  const [previewImages, setPreviewImages] =
    useState(
      product.images || []
    );

  const [newImages, setNewImages] =
    useState([]);

  const [formData, setFormData] =
    useState({
      title:
        product.title || "",

      price:
        product.price || "",

      vendor:
        product.vendor || "",

      stock:
        product.stock || 0,

      productType:
        product.productType ||
        "",

      description:
        product.description ||
        "",

      status:
        product.status ||
        "draft",

      featured:
        product.featured ||
        false,

      collections:
        product.collections ||
        [],
    });

  useEffect(() => {
    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, []);

  const inputCls =
    "w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition";

  const labelCls =
    "block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2";

  // CHANGE
  const handleChange = (
    e
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // IMAGE CHANGE
  const handleImageChange = (
    e
  ) => {
    const files =
      Array.from(
        e.target.files
      );

    setNewImages(files);

    const previews =
      files.map((file) =>
        URL.createObjectURL(
          file
        )
      );

    setPreviewImages(previews);
  };

  // REMOVE IMAGE
  const removeImage = (
    index
  ) => {
    setPreviewImages((prev) =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    );
  };

  // REMOVE COLLECTION
  const removeCollection = (
    id
  ) => {
    setFormData((prev) => ({
      ...prev,
      collections:
        prev.collections.filter(
          (c) =>
            c._id !== id
        ),
    }));
  };

  // SUBMIT
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setSaving(true);

        const body =
          new FormData();

        Object.entries(
          formData
        ).forEach(
          ([key, value]) => {
            if (
              key ===
              "collections"
            ) {
              body.append(
                key,
                JSON.stringify(
                  value
                )
              );
            } else {
              body.append(
                key,
                value
              );
            }
          }
        );

        newImages.forEach(
          (img) => {
            body.append(
              "images",
              img
            );
          }
        );

        const res =
          await fetch(
            `${API}/products/${product._id}`,
            {
              method: "PUT",
              body,
            }
          );

        const data =
          await res.json();

        if (!res.ok)
          throw new Error(
            data.message
          );

        Swal.fire({
          icon: "success",
          title:
            "Product Updated",
          confirmButtonColor:
            "#4f46e5",
        });

        onUpdated(
          data.data
        );
      } catch (err) {
        Swal.fire({
          icon: "error",
          title:
            err.message ||
            "Update failed",
        });
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">

      <div className="relative w-full max-w-5xl bg-white rounded-4xlrder border-slate-200 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">

        {/* HEADER */}
        <div className="shrink-0 px-6 md:px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Edit Product
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Update your product
              information
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="flex flex-col flex-1 min-h-0"
        >

          {/* SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">

            {/* BASIC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div className="lg:col-span-2">
                <label className={labelCls}>
                  Product Title
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
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
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
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
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
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
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
                  className={inputCls}
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className={labelCls}>
                  Status
                </label>

                <div className="relative">
                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                    className={`${inputCls} appearance-none`}
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="draft">
                      Draft
                    </option>
                  </select>

                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  Featured Product
                </label>

                <label className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleChange
                    }
                    className="w-4 h-4"
                  />

                  <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                    Featured
                  </span>
                </label>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelCls}>
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>

            {/* IMAGES */}
            <div>
              <label className={labelCls}>
                Product Images
              </label>

              <label className="rounded-3xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 transition p-8 flex flex-col items-center justify-center cursor-pointer">

                <UploadCloud className="w-10 h-10 text-indigo-500" />

                <h3 className="mt-4 font-bold text-slate-800">
                  Upload Images
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  PNG, JPG, WEBP
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />
              </label>

              {previewImages.length >
                0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                  {previewImages.map(
                    (
                      img,
                      i
                    ) => (
                      <div
                        key={i}
                        className="relative group"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-32 rounded-3xl object-cover border border-slate-200"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              i
                            )
                          }
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* COLLECTIONS */}
            <div>
              <label className={labelCls}>
                Collections
              </label>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">

                <select
                  multiple
                  value={formData.collections.map(
                    (
                      c
                    ) =>
                      c._id
                  )}
                  onChange={(
                    e
                  ) => {
                    const ids =
                      Array.from(
                        e.target
                          .selectedOptions
                      ).map(
                        (
                          o
                        ) =>
                          o.value
                      );

                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        collections:
                          collections.filter(
                            (
                              c
                            ) =>
                              ids.includes(
                                c._id
                              )
                          ),
                      })
                    );
                  }}
                  className="w-full min-h-45 bg-white rounded-2xl border border-slate-200 p-4 text-sm outline-none"
                >
                  {collections.map(
                    (
                      col
                    ) => (
                      <option
                        key={
                          col._id
                        }
                        value={
                          col._id
                        }
                        className="py-2"
                      >
                        {
                          col.name
                        }
                      </option>
                    )
                  )}
                </select>

                {/* SELECTED */}
                {formData
                  .collections
                  .length >
                  0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.collections.map(
                      (
                        col
                      ) => (
                        <div
                          key={
                            col._id
                          }
                          className="px-3 py-2 rounded-2xl bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-2"
                        >
                          {
                            col.name
                          }

                          <button
                            type="button"
                            onClick={() =>
                              removeCollection(
                                col._id
                              )
                            }
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="shrink-0 px-6 md:px-8 py-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-6 rounded-2xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-12 px-7 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-60"
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