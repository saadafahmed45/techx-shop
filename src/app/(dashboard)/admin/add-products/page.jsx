"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Upload,
  X,
  Search,
  Check,
  Loader2,
  Package,
  Layers3,
  Plus,
  Tag,
  ImageIcon,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Hash,
  GripVertical,
  ArrowLeft,
  Send,
  FileText,
  Eye,
} from "lucide-react";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

// =========================================
// FEATURE OPTIONS
// =========================================

const FEATURE_OPTIONS = [
  "Featured",
  "Best Seller",
  "New Arrivals",
  "Popular Sales",
  "Limited Edition",
  "Top Selling Products",
  "Trending Now",
];

// =========================================
// DRAGGABLE IMAGE LIST
// =========================================

const DraggableImageList = ({ previews, onReorder, onRemove }) => {
  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (i) => {
    dragIndex.current = i;
  };
  const handleDragOver = (e, i) => {
    e.preventDefault();
    setDragOver(i);
  };
  const handleDrop = (i) => {
    const from = dragIndex.current;
    if (from === null || from === i) {
      setDragOver(null);
      return;
    }
    onReorder(from, i);
    dragIndex.current = null;
    setDragOver(null);
  };
  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOver(null);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {previews.map((src, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={() => handleDrop(i)}
          onDragEnd={handleDragEnd}
          className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
            dragOver === i
              ? "border-indigo-400 scale-105 shadow-lg shadow-indigo-100"
              : "border-slate-200"
          }`}
        >
          <img
            src={src}
            alt={`image-${i + 1}`}
            className="w-full h-24 object-cover"
            draggable={false}
          />

          {/* Drag handle */}
          <div className="absolute top-1.5 left-1.5 bg-black/50 rounded-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={12} className="text-white" />
          </div>

          {/* Serial number badge */}
          <div className="absolute top-1.5 right-7 bg-black/50 text-white text-[9px] font-bold rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            #{i + 1}
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X size={10} />
          </button>

          {/* MAIN / serial label */}
          {i === 0 ? (
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-md">
              MAIN
            </span>
          ) : (
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/40 text-white px-1.5 py-0.5 rounded-md">
              #{i + 1}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const AddProducts = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [searchCollection, setSearchCollection] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  // Stock toggle — show stock field only when user opts in
  const [showStock, setShowStock] = useState(false);
  const [fields, setFields] = useState({
    title: "",
    slug: "",
    description: "",
    vendor: "",
    stock: "",
    price: "",
    productType: "",
    tags: "",
  });

  // =========================================
  // SLUG GENERATOR
  // =========================================

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // =========================================
  // AUTO SLUG
  // =========================================

  useEffect(() => {
    if (!slugEdited) {
      setFields((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [fields.title, slugEdited]);

  // =========================================
  // FETCH COLLECTIONS
  // =========================================

  useEffect(() => {
    fetch(`${API}/collections?limit=200`)
      .then((r) => r.json())
      .then((d) => {
        // API returns { data: [...], pagination: {...} } — extract the array
        const list = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []);
        setCollections(list);
      })
      .catch(() => toast.error("Failed to load collections"));
  }, []);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  // =========================================
  // IMAGE UPLOAD
  // =========================================

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreview((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  // =========================================
  // REMOVE IMAGE
  // =========================================

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreview[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================
  // TOGGLE COLLECTION
  // =========================================

  const toggleCollection = (col) => {
    const exists = selectedCollections.find((c) => c._id === col._id);
    setSelectedCollections((prev) =>
      exists
        ? prev.filter((c) => c._id !== col._id)
        : [
            ...prev,
            {
              _id: col._id,
              name: col.name,
              slug: col.slug,
              imageUrl: col.imageUrl || "",
            },
          ]
    );
  };

  // =========================================
  // TOGGLE FEATURE
  // =========================================

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    );
  };

  // =========================================
  // FILTER COLLECTIONS
  // =========================================

  const filteredCollections = useMemo(
    () =>
      collections.filter((c) =>
        c.name?.toLowerCase().includes(searchCollection.toLowerCase())
      ),
    [collections, searchCollection]
  );

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fields.title || !fields.price) {
      return toast.error("Please fill required fields");
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));

      formData.append("status", status);
      formData.append("featured", JSON.stringify(selectedFeatures)); // ✅ FIX: key is "featured", value is JSON array

      formData.append("collections", JSON.stringify(selectedCollections));

      imageFiles.forEach((f) => formData.append("images", f));

      const res = await fetch(`${API}/products`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      // RESET
      setFields({
        title: "",
        slug: "",
        description: "",
        vendor: "",
        stock: "",
        price: "",
        productType: "",
        tags: "",
      });

      setSelectedCollections([]);
      setSelectedFeatures([]);
      setImageFiles([]);
      setImagePreview([]);
      setFeatured(false);
      setStatus("draft");
      setSlugEdited(false);
      setShowStock(false);

      Swal.fire({
        icon: "success",
        title: "Product Added Successfully",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message || "Product failed to add!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================
  // STYLES
  // =========================================

  const inputCls =
    "w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-7 md:px-10 md:py-9">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin/manage-products"
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all shrink-0"
          >
            <ArrowLeft size={16} />
          </a>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Product</h1>
            <p className="text-slate-400 text-xs mt-0.5">Fill in the details below to publish a new product</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

            {/* LEFT */}
            <div className="space-y-4">

              {/* PRODUCT INFO */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Layers3 size={14} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-700">Product Info</h2>
                </div>

                <div className="space-y-4">

                  {/* TITLE */}
                  <div>
                    <label className={labelCls}>
                      Product Title{" "}
                      <span className="text-rose-400 normal-case">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={fields.title}
                      onChange={handleChange}
                      placeholder="e.g. Premium Wireless Headphones"
                      className={inputCls}
                    />
                  </div>

                  {/* SLUG */}
                  <div>
                    <label className={labelCls}>Slug</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
                        /
                      </span>
                      <input
                        type="text"
                        value={fields.slug}
                        onChange={(e) => {
                          setSlugEdited(true);
                          setFields((p) => ({
                            ...p,
                            slug: generateSlug(e.target.value),
                          }));
                        }}
                        placeholder="product-slug"
                        className={`${inputCls} pl-7`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Auto-generated from title
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={4}
                      name="description"
                      value={fields.description}
                      onChange={handleChange}
                      placeholder="Describe this product…"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                    />
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Brand / Vendor", name: "vendor", type: "text", placeholder: "Brand name" },
                      { label: "Product Type", name: "productType", type: "text", placeholder: "e.g. Apparel" },
                      { label: "Price ($)", name: "price", type: "number", placeholder: "0.00" },
                    ].map(({ label, name, type, placeholder }) => (
                      <div key={name}>
                        <label className={labelCls}>{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={fields[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className={inputCls}
                          step={name === "price" ? "0.01" : undefined}
                        />
                      </div>
                    ))}
                  </div>

                  {/* STOCK TOGGLE */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls + " mb-0"}>Stock Management</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowStock((prev) => !prev);
                          if (showStock) setFields((p) => ({ ...p, stock: "" }));
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          showStock
                            ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                            : "bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500"
                        }`}
                      >
                        {showStock ? (
                          <ToggleRight size={16} className="text-indigo-500" />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                        {showStock ? "Enabled" : "Track Stock"}
                      </button>
                    </div>
                    {showStock && (
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Hash size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="number"
                            name="stock"
                            value={fields.stock}
                            onChange={handleChange}
                            placeholder="Enter quantity…"
                            min="0"
                            className={`${inputCls} pl-9`}
                          />
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">units in stock</span>
                      </div>
                    )}
                  </div>

                  {/* TAGS */}
                  <div>
                    <label className={labelCls}>Tags</label>
                    <div className="relative">
                      <Tag
                        size={13}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        name="tags"
                        value={fields.tags}
                        onChange={handleChange}
                        placeholder="tag1, tag2, tag3…"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  {/* PRODUCT FEATURES */}
                  <div>
                    <label className={labelCls}>Product Features</label>
                    <div className="flex flex-wrap gap-2">
                      {FEATURE_OPTIONS.map((feature) => {
                        const selected = selectedFeatures.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => toggleFeature(feature)}
                            className={`h-10 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                              selected
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            <Sparkles size={14} />
                            {feature}
                          </button>
                        );
                      })}
                    </div>

                    {selectedFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedFeatures.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* IMAGES */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon size={14} className="text-indigo-500" />
                  <h2 className="text-sm font-semibold text-slate-700">Product Images</h2>
                  <span className="ml-auto text-[11px] text-slate-400">PNG · JPG · WEBP</span>
                </div>

                <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                    <Upload
                      size={20}
                      className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                    Drop files or <span className="text-indigo-500">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Upload multiple images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {imagePreview.length > 0 && (
                  <>
                    <p className="text-[11px] text-slate-400 mt-4 mb-2 font-medium">
                      Drag to reorder · First image is the main product image
                    </p>
                    <DraggableImageList
                      previews={imagePreview}
                      onReorder={(from, to) => {
                        const reorder = (arr) => {
                          const next = [...arr];
                          const [moved] = next.splice(from, 1);
                          next.splice(to, 0, moved);
                          return next;
                        };
                        setImageFiles((prev) => reorder(prev));
                        setImagePreview((prev) => reorder(prev));
                      }}
                      onRemove={removeImage}
                    />
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-4">

              {/* PUBLISH CARD */}
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                {/* Card top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Publish</p>

                  {/* Status toggle */}
                  <div className="flex items-center gap-2 mb-4 p-1 bg-slate-50 rounded-xl border border-slate-100">
                    {[{ id: "draft", label: "Draft", icon: FileText }, { id: "active", label: "Active", icon: Eye }].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setStatus(id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold transition-all ${
                          status === id
                            ? "bg-white shadow-sm border border-slate-200 text-slate-800"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <Icon size={12} />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Live stats */}
                  <div className="space-y-2 mb-5">
                    {[
                      { label: "Images", value: imageFiles.length || "—" },
                      { label: "Price", value: fields.price ? `$${Number(fields.price).toFixed(2)}` : "—" },
                      { label: "Stock", value: showStock ? (fields.stock || "0") : "Not tracked" },
                      { label: "Collections", value: selectedCollections.length || "—" },
                      { label: "Features", value: selectedFeatures.length || "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{label}</span>
                        <span className="font-semibold text-slate-700">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Publish button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    ) : (
                      <><Send size={13} /> {status === "active" ? "Publish Product" : "Save as Draft"}</>
                    )}
                  </button>

                  {/* Hint */}
                  <p className="text-[11px] text-slate-400 text-center mt-3">
                    {status === "active"
                      ? "Product will go live immediately"
                      : "Save now, publish later"}
                  </p>
                </div>
              </div>

              {/* COLLECTIONS */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={13} className="text-indigo-500" />
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Collections</h2>
                </div>

                <div className="relative mb-3">
                  <Search
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchCollection}
                    onChange={(e) => setSearchCollection(e.target.value)}
                    placeholder="Search…"
                    className="w-full h-9 rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 text-sm text-slate-600 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredCollections.map((col) => {
                    const selected = selectedCollections.some(
                      (c) => c._id === col._id
                    );
                    return (
                      <button
                        key={col._id}
                        type="button"
                        onClick={() => toggleCollection(col)}
                        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all text-left ${
                          selected
                            ? "border-indigo-200 bg-indigo-50"
                            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {col.imageUrl ? (
                            <img
                              src={col.imageUrl}
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
                              selected ? "text-indigo-700" : "text-slate-700"
                            }`}
                          >
                            {col.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            /{col.slug}
                          </p>
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
        </form>
      </div>
    </div>
  );
};

export default AddProducts;