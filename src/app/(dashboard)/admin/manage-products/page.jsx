"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search, Edit2, Trash2, Plus, RefreshCw, CheckCircle2,
  Clock3, Loader2, ImageIcon, Package, X, ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      Swal.fire({ icon: "error", title: "Failed to fetch products" });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch(`${API}/collections`);
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) { console.log(err); }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, [fetchProducts, fetchCollections]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        p.title?.toLowerCase().includes(q) ||
        p.vendor?.toLowerCase().includes(q) ||
        p.productType?.toLowerCase().includes(q);
      const matchStatus = status === "all" ? true : p.status === status;
      return matchSearch && matchStatus;
    });
  }, [products, search, status]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p._id !== id));
      Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Delete Failed" });
    }
  };

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount  = products.filter((p) => p.status === "draft").length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
        </div>
        <p className="mt-5 text-slate-400 text-xs font-semibold tracking-widest uppercase">
          Loading products
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 px-4 py-8 md:px-8 md:py-10">
      <div className="max-w-325 mx-auto space-y-6">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Products
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {filteredProducts.length} of {products.length} items
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-medium flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-500 shadow-sm hover:shadow-indigo-100 transition-all duration-200"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <Link
              href="/admin/add-products"
              className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-px transition-all duration-200"
            >
              <Plus size={14} />
              Add Product
            </Link>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total",  value: products.length, dot: "bg-indigo-400",  bg: "bg-indigo-50",  border: "border-indigo-100",  num: "text-indigo-700"  },
            { label: "Active", value: activeCount,     dot: "bg-emerald-400", bg: "bg-emerald-50", border: "border-emerald-100", num: "text-emerald-700" },
            { label: "Drafts", value: draftCount,      dot: "bg-amber-400",   bg: "bg-amber-50",   border: "border-amber-100",   num: "text-amber-700"   },
          ].map(({ label, value, dot, bg, border, num }) => (
            <div
              key={label}
              className={`${bg} border ${border} rounded-2xl px-4 py-4 relative overflow-hidden`}
            >
              <div className={`text-2xl font-black ${num}`}>{value}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 shadow-sm">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search title, vendor, type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none h-10 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-all min-w-36.25"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Table Head */}
          <div className="hidden lg:grid grid-cols-[40px_1fr_140px_100px_110px_80px_1fr_90px] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/80">
            {["#", "Product", "Type", "Price", "Status", "Stock", "Collections", "Actions"].map((h) => (
              <div key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {h}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <Package size={44} strokeWidth={1.5} />
              <p className="mt-3 font-bold text-slate-400">No products found</p>
              <p className="text-sm mt-1 text-slate-300">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className="group grid grid-cols-1 lg:grid-cols-[40px_1fr_140px_100px_110px_80px_1fr_90px] gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0 hover:bg-indigo-50/40 transition-colors duration-150 relative"
              >
                {/* hover accent bar */}
                <div className="absolute left-0 inset-y-0 w-0.5 bg-linear-to-b from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r" />

                {/* # */}
                <div className="flex items-center text-xs font-bold text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Product */}
                <div className="flex items-center gap-3">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-300">
                      <ImageIcon size={16} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-50">
                      {product.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-50 mt-0.5">
                      {product.vendor || "No vendor"}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center text-sm text-slate-400">
                  {product.productType || "—"}
                </div>

                {/* Price */}
                <div className="flex items-center text-sm font-bold text-indigo-600">
                  ${Number(product.price || 0).toFixed(2)}
                </div>

                {/* Status */}
                <div className="flex items-center">
                  {product.status === "draft" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-bold uppercase tracking-wider">
                      <Clock3 size={10} /> Draft
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={10} /> Active
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center text-sm font-bold text-slate-700">
                  {product.stock || 0}
                </div>

                {/* Collections */}
                <div className="flex items-center">
                  <div className="flex flex-wrap gap-1">
                    {product.collections?.map((c) => (
                      <span
                        key={c._id}
                        className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-500 text-[11px] font-semibold"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedProduct(product); setEditModal(true); }}
                    className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 hover:border-indigo-200 transition-all duration-150 hover:scale-105"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-400 flex items-center justify-center hover:bg-rose-100 hover:border-rose-200 transition-all duration-150 hover:scale-105"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ── EDIT MODAL ── */}
      {editModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          collections={collections}
          onClose={() => setEditModal(false)}
          onUpdated={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p))
            );
            setEditModal(false);
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────── */
function EditProductModal({ product, collections, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title:       product.title       || "",
    price:       product.price       || "",
    vendor:      product.vendor      || "",
    stock:       product.stock       || 0,
    productType: product.productType || "",
    description: product.description || "",
    status:      product.status      || "draft",
    collections: product.collections || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeCollection = (id) => {
    setFormData((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c._id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        collections: JSON.stringify(formData.collections),
      };
      const res = await fetch(`${API}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({ icon: "success", title: "Product Updated", confirmButtonColor: "#4f46e5" });
      onUpdated(data.data);
    } catch (err) {
      Swal.fire({ icon: "error", title: err.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl shadow-slate-200/80 ring-1 ring-indigo-100">

        {/* Head */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-linear-to-r from-indigo-50/60 to-white rounded-t-3xl shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Edit Product
            </h2>
            <p className="text-xs text-slate-400 mt-1">Update the details and save changes</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body + form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/* Title */}
            <div>
              <label className={labelCls}>Title</label>
              <input
                type="text" name="title" value={formData.title}
                onChange={handleChange} placeholder="Product title"
                className={inputCls}
              />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price ($)</label>
                <input
                  type="number" name="price" value={formData.price}
                  onChange={handleChange} placeholder="0.00" step="0.01"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Stock</label>
                <input
                  type="number" name="stock" value={formData.stock}
                  onChange={handleChange} placeholder="0"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Vendor + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Vendor</label>
                <input
                  type="text" name="vendor" value={formData.vendor}
                  onChange={handleChange} placeholder="Vendor name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Product Type</label>
                <input
                  type="text" name="productType" value={formData.productType}
                  onChange={handleChange} placeholder="e.g. Apparel"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <div className="relative">
                <select
                  name="status" value={formData.status} onChange={handleChange}
                  className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={3} name="description" value={formData.description}
                onChange={handleChange} placeholder="Product description…"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              />
            </div>

            {/* Collections */}
            <div>
              <label className={labelCls}>Collections</label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <select
                  multiple
                  value={formData.collections.map((c) => c._id)}
                  onChange={(e) => {
                    const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
                    setFormData((prev) => ({
                      ...prev,
                      collections: collections.filter((c) => ids.includes(c._id)),
                    }));
                  }}
                  className="w-full min-h-32.5 bg-transparent px-3 py-2 text-sm text-slate-600 outline-none cursor-pointer"
                >
                  {collections.map((col) => (
                    <option key={col._id} value={col._id} className="py-1.5 bg-white rounded">
                      {col.name}
                    </option>
                  ))}
                </select>

                {formData.collections.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-3 pb-3 pt-1 border-t border-slate-200">
                    {formData.collections.map((col) => (
                      <span
                        key={col._id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-500 text-xs font-semibold"
                      >
                        {col.name}
                        <button
                          type="button"
                          onClick={() => removeCollection(col._id)}
                          className="text-indigo-400 hover:text-indigo-600 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="px-3 pb-2.5 text-[11px] text-slate-400">
                  Hold Ctrl / ⌘ to select multiple
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}