"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useRef } from "react";
import {
  Search, Edit2, Trash2, Plus, RefreshCw,
  CheckCircle2, Clock3, Loader2, ImageIcon,
  Package, X, ChevronDown, Star, GripVertical,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAdminProducts, useAdminCollections, useDeleteProduct } from "@/lib/admin-hooks";

const FEATURE_OPTIONS = [
  "Featured", "Best Seller", "New Arrivals", "Popular Sales",
  "Limited Edition", "Top Selling Products", "Trending Now",
];

const ProductThumb = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  useMemo(() => setError(false), [src]);

  if (!src || error) {
    return (
      <div className={`${className} bg-slate-100 flex items-center justify-center`}>
        <ImageIcon className="w-5 h-5 text-slate-400" />
      </div>
    );
  }
  return (
    <img src={src} alt={alt} className={className}
      onError={() => setError(true)} />
  );
};

const DraggableImageList = ({ images, onReorder, onRemove }) => {
  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (i) => { dragIndex.current = i; };
  const handleDragOver  = (e, i) => { e.preventDefault(); setDragOver(i); };
  const handleDrop      = (i) => {
    const from = dragIndex.current;
    if (from === null || from === i) { setDragOver(null); return; }
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    onReorder(next);
    dragIndex.current = null;
    setDragOver(null);
  };
  const handleDragEnd = () => { dragIndex.current = null; setDragOver(null); };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
      {images.map((img, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={() => handleDrop(i)}
          onDragEnd={handleDragEnd}
          className={`relative group rounded-3xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing
            ${dragOver === i ? "border-indigo-400 scale-105 shadow-lg" : "border-slate-200"}`}
        >
          <ProductThumb
            src={typeof img === "string" ? img : URL.createObjectURL(img)}
            alt={`image-${i}`}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/50 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition">
            <GripVertical size={14} className="text-white" />
          </div>
          <div className="absolute top-2 right-8 bg-black/50 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition">
            #{i + 1}
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default function ManageProducts() {
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useAdminProducts();
  const { data: collections = [] } = useAdminCollections();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        p.title?.toLowerCase().includes(q) ||
        p.vendor?.toLowerCase().includes(q) ||
        p.productType?.toLowerCase().includes(q);
      const matchStatus = status === "all" || p.status === status;
      return matchSearch && matchStatus;
    });
  }, [products, search, status]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProduct.mutateAsync(id);
      Swal.fire({ icon: "success", title: "Deleted", timer: 1400, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Delete Failed" });
    }
  };

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount  = products.filter((p) => p.status === "draft").length;

  if (productsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm text-slate-400">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Products</h1>
            <p className="text-sm text-slate-400 mt-1">
              {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => refetchProducts()}
              className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-medium flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link href="/admin/add-products"
              className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">Total</h3>
            <p className="mt-2 text-3xl font-black text-slate-900">{products.length}</p>
          </div>
          <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-5">
            <h3 className="text-emerald-500 text-xs uppercase tracking-widest font-bold">Active</h3>
            <p className="mt-2 text-3xl font-black text-emerald-700">{activeCount}</p>
          </div>
          <div className="bg-amber-50 rounded-3xl border border-amber-100 p-5">
            <h3 className="text-amber-500 text-xs uppercase tracking-widest font-bold">Draft</h3>
            <p className="mt-2 text-3xl font-black text-amber-700">{draftCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search products..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />
          </div>
          <div className="relative">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="appearance-none h-11 px-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-widest text-slate-400 font-bold">
            <div className="col-span-1">#</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Featured</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <Package className="w-12 h-12" />
              <p className="mt-4 font-semibold">No Products Found</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={product._id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition">

                <div className="lg:col-span-1 flex items-center text-sm text-slate-400 font-semibold">
                  {index + 1}
                </div>

                <div className="lg:col-span-4 flex items-center gap-4">
                  <ProductThumb
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 truncate">{product.title}</h2>
                    <p className="text-sm text-slate-400 truncate">{product.vendor || "No vendor"}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 flex items-center text-sm text-slate-500">
                  {product.productType || "—"}
                </div>

                <div className="lg:col-span-1 flex items-center font-bold text-indigo-600">
                  ${Number(product.price || 0).toFixed(2)}
                </div>

                <div className="lg:col-span-1 flex items-center">
                  {product.status === "draft" ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                      <Clock3 className="w-3 h-3" /> Draft
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <div className="lg:col-span-1 flex items-center">
                  {Array.isArray(product.featured) && product.featured.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-yellow-500 text-xs font-bold">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      {product.featured.length}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>

                <div className="lg:col-span-2 flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedProduct(product); setEditModal(true); }}
                    className="w-10 h-10 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(product._id)}
                    className="w-10 h-10 rounded-2xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          collections={collections}
          onClose={() => setEditModal(false)}
          onUpdated={() => {
            setEditModal(false);
            refetchProducts();
          }}
        />
      )}
    </div>
  );
}

function EditProductModal({ product, collections, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState(product.images || []);
  // Stock toggle
  const [showStock, setShowStock] = useState(
    product.stock !== undefined && product.stock !== null && product.stock !== 0
  );
  const [formData, setFormData] = useState({
    title:       product.title       || "",
    slug:        product.slug        || "",
    price:       product.price       || "",
    vendor:      product.vendor      || "",
    stock:       product.stock       ?? 0,
    productType: product.productType || "",
    description: product.description || "",
    status:      product.status      || "draft",
    featured:    Array.isArray(product.featured) ? product.featured : [],
    collections: Array.isArray(product.collections) ? product.collections : [],
  });

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();

      // Append all scalar fields
      fd.append("title", formData.title);
      fd.append("slug", formData.slug);
      fd.append("price", formData.price);
      fd.append("vendor", formData.vendor);
      fd.append("stock", showStock ? formData.stock : 0);
      fd.append("productType", formData.productType);
      fd.append("description", formData.description);
      fd.append("status", formData.status);
      fd.append("featured", JSON.stringify(formData.featured));

      // Send collections as array of full objects (server's parseCollections handles it)
      fd.append("collections", JSON.stringify(formData.collections));

      // Separate existing URL strings from new File objects
      const existingImages = images.filter((img) => typeof img === "string");
      const newFiles = images.filter((img) => img instanceof File);

      fd.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach((file) => fd.append("images", file));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/products/${product._id}`,
        { method: "PUT", body: fd }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Update failed");
      }
      const updated = await res.json();
      onUpdated(updated);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Edit Product</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Slug</label>
              <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Price</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Vendor</label>
              <input value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
            </div>
            <div>
              {/* Stock with toggle */}
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Stock</label>
                <button type="button"
                  onClick={() => {
                    setShowStock((p) => !p);
                    if (showStock) setFormData((p) => ({ ...p, stock: 0 }));
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                    showStock
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                      : "bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500"
                  }`}>
                  {showStock ? <ToggleRight size={14} className="text-indigo-500" /> : <ToggleLeft size={14} />}
                  {showStock ? "On" : "Off"}
                </button>
              </div>
              {showStock ? (
                <input type="number" min="0" value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
              ) : (
                <div className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-4 flex items-center text-sm text-slate-400">
                  Toggle on to track stock
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Product Type</label>
              <input value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Featured Tags</label>
              <div className="mt-1 flex flex-wrap gap-1.5 p-2 rounded-2xl border border-slate-200 min-h-[48px]">
                {FEATURE_OPTIONS.map((opt) => {
                  const active = formData.featured.includes(opt);
                  return (
                    <button key={opt} type="button"
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        featured: active
                          ? prev.featured.filter((f) => f !== opt)
                          : [...prev.featured, opt],
                      }))}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Collections</label>
              <div className="mt-1 flex flex-wrap gap-1.5 p-2 rounded-2xl border border-slate-200 min-h-[48px] max-h-32 overflow-y-auto">
                {collections.map((col) => {
                  const active = formData.collections.some((c) => (c._id || c) === col._id);
                  return (
                    <button key={col._id} type="button"
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        collections: active
                          ? prev.collections.filter((c) => (c._id || c) !== col._id)
                          : [...prev.collections, { _id: col._id, name: col.name, slug: col.slug, imageUrl: col.imageUrl || "" }],
                      }))}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {col.name}
                    </button>
                  );
                })}
                {collections.length === 0 && (
                  <span className="text-xs text-slate-400 p-1">No collections available</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Images (drag to reorder)</label>
            <label className="mt-2 flex items-center justify-center h-28 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-medium">Click to upload images</span>
              </div>
            </label>
            {images.length > 0 && (
              <DraggableImageList images={images} onReorder={setImages} onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))} />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="h-12 px-6 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
