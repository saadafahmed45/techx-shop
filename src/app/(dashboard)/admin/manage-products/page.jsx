"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search, Edit2, Trash2, Plus, X, Package, RefreshCw,
  Upload, Eye, ImageIcon, Layers3, CheckCircle2, Clock3,
  Loader2, AlertTriangle, MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────
const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    // FIX: clear interval properly
    const interval = setInterval(fetchProducts, 30000); // 30s, not 10s (less aggressive)
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        product.title?.toLowerCase().includes(q) ||
        product.productType?.toLowerCase().includes(q) ||
        product.vendor?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || product.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <Layers3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {filteredProducts.length} of {products.length} products shown
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchProducts}
              className="h-10 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition font-medium text-sm flex items-center gap-2 text-gray-600 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <Link
              href="/admin/add-products"
              className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-indigo-200 transition"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total", value: products.length, color: "text-gray-900" },
            { label: "Active", value: activeCount, color: "text-green-600" },
            { label: "Draft", value: draftCount, color: "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
              <h2 className={`text-3xl font-black mt-1 ${color}`}>{value}</h2>
            </div>
          ))}
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, type, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {[
              { val: "all", label: "All" },
              { val: "active", label: "Active" },
              { val: "draft", label: "Draft" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                className={`px-4 h-8 rounded-lg text-sm font-medium transition ${
                  statusFilter === val
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">No Products Found</h2>
            <p className="text-sm text-gray-500 mt-1">Try adjusting the search or filter</p>
          </div>
        ) : (
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
              >
                {/* IMAGE */}
                <div className="relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    {product.status === "active" ? (
                      <span className="inline-flex items-center gap-1 bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm">
                        <Clock3 className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>

                  {/* Hover action buttons */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => { setSelectedProduct(product); setEditModal(true); }}
                      className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-indigo-600 flex items-center justify-center shadow-sm transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product)}
                      className="w-8 h-8 rounded-lg bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 flex items-center justify-center shadow-sm transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 truncate">{product.title}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">{product.vendor || "No vendor"}</p>
                    </div>
                    <span className="text-lg font-black text-indigo-600 shrink-0">
                      ${Number(product.price || 0).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {product.productType || "—"}
                      </span>
                      <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {product.variants?.length || 0} variants
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setSelectedProduct(product); setEditModal(true); }}
                        className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 text-center">Delete Product?</h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              "<span className="font-medium text-gray-700">{deleteConfirm.title}</span>" will be permanently deleted.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setEditModal(false)}
          onUpdated={(updated) => {
            setProducts((prev) => prev.map((p) => p._id === updated._id ? updated : p));
            setEditModal(false);
          }}
        />
      )}
    </div>
  );
};

// ────────────────────────────────────────
// EDIT PRODUCT MODAL
// ────────────────────────────────────────
const EditProductModal = ({ product, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: product.title || "",
    description: product.description || "",
    price: product.price || 0,
    vendor: product.vendor || "",
    productType: product.productType || "",
    status: product.status || "draft",
  });

  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState(product.images || []);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // FIX: revoke previous new image blobs
    newImages.forEach((_, i) => {
      if (previews[i]?.startsWith("blob:")) URL.revokeObjectURL(previews[i]);
    });
    setNewImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      newImages.forEach((file) => data.append("images", file));

      const res = await fetch(`${API}/products/${product._id}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Product updated");
      onUpdated(result.data);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{product.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Image preview + upload */}
          <div>
            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {previews.map((img, i) => (
                  <img key={i} src={img} className="w-full aspect-square rounded-xl object-cover" alt="" />
                ))}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 h-11 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Replace images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vendor</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Type</label>
              <input
                type="text"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageProduct;