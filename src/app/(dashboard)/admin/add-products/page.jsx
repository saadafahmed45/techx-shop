"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Upload, X, Search, Check, Loader2, Package,
  Layers3, Plus, ChevronDown, Tag, ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddProducts = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [searchCollection, setSearchCollection] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [fields, setFields] = useState({
    title: "", slug: "", description: "",
    vendor: "", stock: "", price: "", productType: "", tags: "",
  });

  const generateSlug = (text) =>
    text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  useEffect(() => {
    if (!slugEdited)
      setFields((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
  }, [fields.title, slugEdited]);

  useEffect(() => {
    fetch(`${API}/collections`)
      .then((r) => r.json())
      .then((d) => setCollections(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Failed to load collections"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreview((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreview[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCollection = (col) => {
    const exists = selectedCollections.find((c) => c._id === col._id);
    setSelectedCollections((prev) =>
      exists
        ? prev.filter((c) => c._id !== col._id)
        : [...prev, { _id: col._id, name: col.name, slug: col.slug, image: col.image }]
    );
  };

  const filteredCollections = useMemo(() =>
    collections.filter((c) =>
      c.name?.toLowerCase().includes(searchCollection.toLowerCase())
    ), [collections, searchCollection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.title || !fields.price) return toast.error("Please fill required fields");
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      formData.append("status", status);
      formData.append("featured", featured);
      formData.append("collections", JSON.stringify(selectedCollections));
      imageFiles.forEach((f) => formData.append("images", f));

      const res = await fetch(`${API}/products`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      toast.success("Product Added Successfully");
      setFields({ title: "", slug: "", description: "", vendor: "", stock: "", price: "", productType: "", tags: "" });
      setSelectedCollections([]); setImageFiles([]); setImagePreview([]);
      setFeatured(false); setStatus("draft"); setSlugEdited(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  const labelCls = "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10 pb-28">
      <div className="max-w-325 mx-auto">

        {/* HEADER */}
        <div className="mb-7">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Add Product</h1>
          <p className="text-slate-400 text-sm mt-1">Fill in the details to publish a new product</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ── LEFT ── */}
            <div className="lg:col-span-3 space-y-5">

              {/* PRODUCT INFO */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Layers3 size={15} className="text-indigo-500" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Product Info</h2>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className={labelCls}>Product Title <span className="text-rose-400 normal-case">*</span></label>
                    <input type="text" name="title" value={fields.title} onChange={handleChange}
                      placeholder="e.g. Premium Wireless Headphones" className={inputCls} />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className={labelCls}>Slug</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">/</span>
                      <input
                        type="text" value={fields.slug}
                        onChange={(e) => { setSlugEdited(true); setFields((p) => ({ ...p, slug: generateSlug(e.target.value) })); }}
                        placeholder="product-slug"
                        className={`${inputCls} pl-7`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">Auto-generated from title</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea rows={4} name="description" value={fields.description} onChange={handleChange}
                      placeholder="Describe this product…"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Brand / Vendor", name: "vendor", type: "text",   placeholder: "Brand name"  },
                      { label: "Product Type",   name: "productType", type: "text", placeholder: "e.g. Apparel" },
                      { label: "Stock",          name: "stock",  type: "number", placeholder: "0"         },
                      { label: "Price ($)",      name: "price",  type: "number", placeholder: "0.00"       },
                    ].map(({ label, name, type, placeholder }) => (
                      <div key={name}>
                        <label className={labelCls}>{label}</label>
                        <input type={type} name={name} value={fields[name]} onChange={handleChange}
                          placeholder={placeholder} className={inputCls} step={name === "price" ? "0.01" : undefined} />
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className={labelCls}>Tags</label>
                    <div className="relative">
                      <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="text" name="tags" value={fields.tags} onChange={handleChange}
                        placeholder="tag1, tag2, tag3…"
                        className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGES */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <ImageIcon size={15} className="text-indigo-500" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Product Images</h2>
                  <span className="ml-auto text-[11px] text-slate-400 font-medium">PNG, JPG, WEBP</span>
                </div>

                <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                    <Upload size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                    Drop files or <span className="text-indigo-500">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Upload multiple images</p>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5">
                    {imagePreview.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-full h-24 object-cover rounded-xl border border-slate-200" />
                        <button
                          type="button" onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-white shadow border border-slate-200 text-rose-400 hover:text-rose-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={11} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-md">MAIN</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="space-y-5">

              {/* STATUS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Status</h2>
                <div className="space-y-2.5">
                  {["draft", "active"].map((item) => (
                    <button
                      key={item} type="button" onClick={() => setStatus(item)}
                      className={`w-full h-11 rounded-xl border text-sm font-semibold capitalize transition-all ${
                        status === item
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                          : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    type="button" onClick={() => setFeatured(!featured)}
                    className={`w-full h-11 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      featured
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-500"
                    }`}
                  >
                    {featured ? "⭐ Featured" : "Mark as Featured"}
                  </button>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Summary</h2>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Images",      value: imageFiles.length },
                    { label: "Stock",       value: fields.stock || 0 },
                    { label: "Price",       value: fields.price ? `$${Number(fields.price).toFixed(2)}` : "—" },
                    { label: "Collections", value: selectedCollections.length },
                    { label: "Status",      value: status, cls: "capitalize" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-slate-400">{label}</span>
                      <span className={`font-semibold text-white ${cls || ""}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLLECTIONS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Package size={13} className="text-indigo-500" />
                  </div>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Collections</h2>
                </div>

                <div className="relative mb-3">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text" value={searchCollection}
                    onChange={(e) => setSearchCollection(e.target.value)}
                    placeholder="Search…"
                    className="w-full h-9 rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 text-sm text-slate-600 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredCollections.map((col) => {
                    const selected = selectedCollections.some((c) => c._id === col._id);
                    return (
                      <button
                        key={col._id} type="button" onClick={() => toggleCollection(col)}
                        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all text-left ${
                          selected
                            ? "border-indigo-200 bg-indigo-50"
                            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {col.imageUrl
                            ? <img src={col.imageUrl} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={14} /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${selected ? "text-indigo-700" : "text-slate-700"}`}>{col.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">/{col.slug}</p>
                        </div>
                        {selected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                            <Check size={11} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER */}
          <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 flex items-center justify-between z-50">
            <p className="text-sm text-slate-400 hidden sm:block">
              {imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""} · {selectedCollections.length} collection{selectedCollections.length !== 1 ? "s" : ""}
            </p>
            <button
              type="submit" disabled={isSubmitting}
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Plus size={14} /> Publish Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;