"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, X, Upload, Tag, Package, Layers3, CheckCircle2, AlertCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddProducts = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [variants, setVariants] = useState([{ size: "", color: "#6366f1", stock: 0, price: 0 }]);
  const [status, setStatus] = useState("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  // FIX: Track form field values in state for controlled reset
  const [fields, setFields] = useState({
    title: "", description: "", vendor: "", sku: "", price: "", productType: "",
  });

  useEffect(() => {
    fetch(`${API}/collections`)
      .then((res) => res.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Collections fetch error:", err));
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.warning("Maximum 5 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreview((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    // FIX: revoke object URL to prevent memory leak
    if (imagePreview[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview[index]);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "#6366f1", stock: 0, price: 0 }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === "stock" || field === "price" ? Number(value) : value;
    setVariants(updated);
  };

  // FIX: always coerce to string — MongoDB _id can be an object
  const toggleCollection = (id) => {
    const strId = String(id);
    setSelectedCollections((prev) =>
      prev.includes(strId) ? prev.filter((c) => c !== strId) : [...prev, strId]
    );
  };

  const isCollectionSelected = (id) => selectedCollections.includes(String(id));

  const resetForm = () => {
    setFields({ title: "", description: "", vendor: "", sku: "", price: "", productType: "" });
    // FIX: revoke all object URLs
    imagePreview.forEach((url) => { if (url.startsWith("blob:")) URL.revokeObjectURL(url); });
    setImageFiles([]);
    setImagePreview([]);
    setVariants([{ size: "", color: "#6366f1", stock: 0, price: 0 }]);
    setSelectedCollections([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", fields.title);
    formData.append("description", fields.description);
    formData.append("price", fields.price);
    formData.append("productType", fields.productType);
    formData.append("vendor", fields.vendor || "");
    formData.append("sku", fields.sku || "");
    formData.append("status", status);
    formData.append("variants", JSON.stringify(variants));
    // FIX: Send as JSON array AND repeated fields to support any backend parser
    formData.append("collectionIds", JSON.stringify(selectedCollections));
    selectedCollections.forEach((id) => formData.append("collectionIds[]", id));
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch(`${API}/products`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      toast.success("Product saved successfully!");
      resetForm();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  return (
    <div className="bg-[#F7F8FC] min-h-screen pb-24">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6" encType="multipart/form-data">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-13 pl-0.5">Fill in the details to create a new product listing</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}>
              {status === "active" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {status === "active" ? "Active" : "Draft"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* ── LEFT ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Product Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-5">
                <Tag className="w-4 h-4 text-indigo-500" />
                Product Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="title"
                    value={fields.title}
                    onChange={handleFieldChange}
                    placeholder="e.g. Classic Linen Shirt"
                    required
                    className="w-full h-11 border border-gray-200 bg-gray-50 px-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={fields.description}
                    onChange={handleFieldChange}
                    placeholder="Describe the product, materials, fit, etc."
                    rows={4}
                    required
                    className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none placeholder:text-gray-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vendor / Brand</label>
                    <input
                      name="vendor"
                      value={fields.vendor}
                      onChange={handleFieldChange}
                      placeholder="e.g. Nike, Zara"
                      className="w-full h-11 border border-gray-200 bg-gray-50 px-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SKU</label>
                    <input
                      name="sku"
                      value={fields.sku}
                      onChange={handleFieldChange}
                      placeholder="e.g. LS-001-WHT"
                      className="w-full h-11 border border-gray-200 bg-gray-50 px-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-5">
                <Upload className="w-4 h-4 text-indigo-500" />
                Product Images
                <span className="ml-auto text-xs text-gray-400 font-normal">{imageFiles.length}/5 uploaded</span>
              </h2>

              {imageFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition mb-4">
                  <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                  <span className="text-sm font-medium text-gray-600">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10MB · Max 5 images</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {imagePreview.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={img} className="w-full h-full object-cover rounded-xl" alt={`preview-${i}`} />
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing & Category */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-5">Pricing & Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Base Price <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                    <input
                      type="number"
                      name="price"
                      value={fields.price}
                      onChange={handleFieldChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full h-11 border border-gray-200 bg-gray-50 pl-8 pr-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Type</label>
                  <input
                    name="productType"
                    value={fields.productType}
                    onChange={handleFieldChange}
                    placeholder="e.g. Shirt, Pants, Dress"
                    className="w-full h-11 border border-gray-200 bg-gray-50 px-4 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-800">Variants</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                  Total stock: {totalStock} units
                </span>
              </div>

              <div className="space-y-2.5">
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-[1fr_auto_1fr_1fr_auto] gap-2.5 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <select
                      className="h-9 border border-gray-200 px-3 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={variant.size}
                      onChange={(e) => updateVariant(index, "size", e.target.value)}
                    >
                      <option value="">Size</option>
                      {["XS","S","M","L","XL","XXL"].map(s => <option key={s}>{s}</option>)}
                    </select>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">Color</span>
                      <div className="relative">
                        <input
                          type="color"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, "color", e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        min="0"
                        onChange={(e) => updateVariant(index, "stock", e.target.value)}
                        className="w-full h-9 border border-gray-200 px-3 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        min="0"
                        step="0.01"
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        className="w-full h-9 border border-gray-200 pl-5 pr-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      disabled={variants.length === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 mt-4 text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add variant
              </button>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Status */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Visibility</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: "draft", label: "Draft", desc: "Hidden", color: "amber" },
                  { val: "active", label: "Active", desc: "Live", color: "green" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setStatus(opt.val)}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      status === opt.val
                        ? opt.color === "green"
                          ? "border-green-500 bg-green-50"
                          : "border-amber-400 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${
                      status === opt.val
                        ? opt.color === "green" ? "text-green-700" : "text-amber-700"
                        : "text-gray-700"
                    }`}>{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers3 className="w-3.5 h-3.5" />
                Collections
              </h3>
              {collections.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-gray-400">No collections yet.</p>
                  <p className="text-xs text-gray-400">Create one first.</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {collections.map((c) => (
                    <label
                      key={String(c._id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                        isCollectionSelected(c._id) ? "bg-indigo-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isCollectionSelected(c._id)}
                        onChange={() => toggleCollection(c._id)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {c.imageUrl && (
                          <img src={c.imageUrl} className="w-7 h-7 rounded-lg object-cover shrink-0" alt={c.name} />
                        )}
                        <span className="text-sm text-gray-700 truncate font-medium">{c.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedCollections.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-indigo-600 font-semibold mb-1.5">
                    {selectedCollections.length} collection{selectedCollections.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCollections.map((id) => {
                      // FIX: string comparison for _id lookup
                      const col = collections.find((c) => String(c._id) === String(id));
                      return col ? (
                        <span key={id} className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                          {col.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-900 rounded-2xl p-4 text-white">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Summary</p>
              <div className="space-y-2">
                {[
                  { label: "Images", value: `${imageFiles.length}/5` },
                  { label: "Variants", value: variants.length },
                  { label: "Total Stock", value: `${totalStock} units` },
                  { label: "Collections", value: selectedCollections.length },
                  { label: "Status", value: status === "active" ? "🟢 Active" : "🟡 Draft" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-xs font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STICKY SAVE BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl p-4 flex items-center justify-between z-50">
          <p className="text-sm text-gray-500">
            {fields.title ? (
              <span className="font-medium text-gray-700">"{fields.title}"</span>
            ) : (
              "Untitled product"
            )}
            {" · "}{imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""} · {variants.length} variant{variants.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setStatus("draft"); }}
              className="h-10 px-5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setStatus("active")}
              className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white px-7 rounded-xl text-sm font-semibold transition shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Publish Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;