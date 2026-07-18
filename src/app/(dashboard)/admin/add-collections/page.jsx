"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Upload,
  X,
  Search,
  ImageIcon,
  Check,
  Layers3,
  Loader2,
  ArrowLeft,
  Send,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddCollection = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);

  // ==========================================
  // SLUG GENERATOR
  // ==========================================
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  useEffect(() => {
    if (!slugEdited) setSlug(generateSlug(name));
  }, [name, slugEdited]);

  // ==========================================
  // FETCH PRODUCTS
  // FIX: API returns {data:[],pagination:{}} — not a plain array
  // ==========================================
  useEffect(() => {
    fetch(`${API}/products?limit=200`)
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d)
          ? d
          : Array.isArray(d && d.data)
          ? d.data
          : [];
        setProducts(list);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.title && p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  // ==========================================
  // IMAGE HANDLERS
  // ==========================================
  const handleImageUpload = (file) => {
    if (!file) return;
    if (imagePreview && imagePreview.startsWith("blob:"))
      URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:"))
      URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  // ==========================================
  // PRODUCT TOGGLE
  // ==========================================
  const toggleProduct = (productId) => {
    const id = String(productId);
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ==========================================
  // SUBMIT — FIX: clean FormData, no duplicates
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !imageFile) {
      toast.error("Please fill all required fields and upload a cover image");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("slug", slug.trim());
      fd.append("description", description.trim());
      fd.append("image", imageFile);
      fd.append("productIds", JSON.stringify(selectedProducts));

      const res = await fetch(`${API}/collections`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create collection");

      // Reset all fields
      setName("");
      setSlug("");
      setSlugEdited(false);
      setDescription("");
      removeImage();
      setSelectedProducts([]);
      setSearch("");

      Swal.fire({
        icon: "success",
        title: "Collection Created!",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full h-11 bg-white border border-slate-100 rounded-xl px-4 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-7 md:px-10 md:py-9">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin/manage-collections"
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shrink-0"
          >
            <ArrowLeft size={16} />
          </a>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add Collection
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Organize products into a curated group
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            {/* ==================== LEFT ==================== */}
            <div className="space-y-4">

              {/* DETAILS */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Layers3 size={14} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-700">
                    Collection Details
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className={labelCls}>
                      Collection Name{" "}
                      <span className="text-rose-400 normal-case">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Summer Essentials 2026"
                      className={inputCls}
                      required
                    />
                  </div>
                  {/* Slug */}
                  <div>
                    <label className={labelCls}>Slug</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
                        /
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlugEdited(true);
                          setSlug(generateSlug(e.target.value));
                        }}
                        placeholder="collection-slug"
                        className={`${inputCls} pl-7`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Auto-generated from name
                    </p>
                  </div>
                  {/* Description */}
                  <div>
                    <label className={labelCls}>
                      Description{" "}
                      <span className="text-rose-400 normal-case">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what makes this collection special…"
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* COVER IMAGE */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon size={14} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-700">
                    Cover Image
                  </h2>
                  <span className="ml-auto text-[11px] text-slate-400">
                    PNG · JPG · WEBP
                  </span>
                </div>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center shadow-sm transition"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] text-white font-medium">
                      {imageFile && imageFile.name}
                    </div>
                  </div>
                ) : (
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const f = e.dataTransfer.files[0];
                      if (f) handleImageUpload(f);
                    }}
                    className={`flex flex-col items-center justify-center h-52 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      dragging
                        ? "border-indigo-400 bg-indigo-50/60"
                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition ${
                        dragging ? "bg-indigo-100" : "bg-slate-100"
                      }`}
                    >
                      <Upload
                        className={`w-5 h-5 transition ${
                          dragging ? "text-indigo-600" : "text-slate-400"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">
                      Drop image or{" "}
                      <span className="text-indigo-500">browse</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Recommended: 1200 x 600px
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* PRODUCTS PICKER */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={14} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-700">
                    Add Products
                  </h2>
                  {selectedProducts.length > 0 && (
                    <span className="ml-auto text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {selectedProducts.length} selected
                    </span>
                  )}
                </div>

                <div className="relative mb-3">
                  <Search
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="w-full h-9 rounded-xl bg-slate-50 border border-slate-100 pl-9 pr-3 text-sm text-slate-600 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {filteredProducts.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">
                      {products.length === 0
                        ? "No products available"
                        : "No results found"}
                    </p>
                  ) : (
                    filteredProducts.map((product) => {
                      const isSelected = selectedProducts.includes(
                        String(product._id)
                      );
                      return (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => toggleProduct(product._id)}
                          className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2 transition-all text-left ${
                            isSelected
                              ? "border-indigo-200 bg-indigo-50"
                              : "border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/30"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon size={14} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isSelected
                                  ? "text-indigo-700"
                                  : "text-slate-700"
                              }`}
                            >
                              {product.title}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              ${Number(product.price || 0).toFixed(2)}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                              <Check size={11} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* ==================== RIGHT SIDEBAR ==================== */}
            <div className="space-y-4">

              {/* PUBLISH CARD */}
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Summary
                  </p>

                  <div className="space-y-2 mb-5">
                    {[
                      { label: "Name", value: name || "—" },
                      { label: "Slug", value: slug ? `/${slug}` : "—" },
                      {
                        label: "Description",
                        value: description
                          ? `${description.length} chars`
                          : "—",
                      },
                      {
                        label: "Image",
                        value: imageFile ? "✓ Ready" : "—",
                        green: !!imageFile,
                      },
                      {
                        label: "Products",
                        value:
                          selectedProducts.length > 0
                            ? String(selectedProducts.length)
                            : "—",
                      },
                    ].map(({ label, value, green }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-400">{label}</span>
                        <span
                          className={`font-semibold truncate max-w-[140px] text-right ${
                            green ? "text-emerald-600" : "text-slate-700"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Creating…
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Create Collection
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center mt-3">
                    Collection will be visible in your storefront
                  </p>
                </div>
              </div>

              {/* SELECTED PRODUCTS PREVIEW */}
              {selectedProducts.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Selected ({selectedProducts.length})
                  </p>
                  <div className="space-y-1.5">
                    {products
                      .filter((p) =>
                        selectedProducts.includes(String(p._id))
                      )
                      .slice(0, 5)
                      .map((p) => (
                        <div
                          key={p._id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-100 shrink-0">
                            {p.images && p.images[0] ? (
                              <img
                                src={p.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100" />
                            )}
                          </div>
                          <span className="text-slate-600 font-medium truncate">
                            {p.title}
                          </span>
                        </div>
                      ))}
                    {selectedProducts.length > 5 && (
                      <p className="text-[11px] text-slate-400">
                        +{selectedProducts.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollection;