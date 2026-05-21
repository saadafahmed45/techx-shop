"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Upload,
  X,
  Search,
  Package,
  ImageIcon,
  Check,
  Layers3,
  Sparkles,
  Loader2,
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
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==========================================
  // AUTO GENERATE SLUG FROM NAME
  // ==========================================
  useEffect(() => {
    if (!slugEdited) {
      setSlug(generateSlug(name));
    }
  }, [name, slugEdited]);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================
  const handleImageUpload = (file) => {
    if (!file) return;

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);
  };

  // ==========================================
  // SELECT PRODUCTS
  // ==========================================
  const toggleProduct = (productId) => {
    const id = String(productId);

    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((existing) => existing !== id)
        : [...prev, id]
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !imageFile) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("slug", slug.trim());
      formData.append("description", description.trim());
      formData.append("image", imageFile);

      formData.append("productIds", JSON.stringify(selectedProducts));

      selectedProducts.forEach((id) =>
        formData.append("productIds[]", id)
      );

      const res = await fetch(`${API}/collections`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create collection");
      }


      setName("");
      setSlug("");
      setSlugEdited(false);

      setDescription("");

      removeImage();

      setSelectedProducts([]);
      setSearch("");
      
      Swal.fire({
               icon: "success",
               title:
                 "Collection Created Successfully",
               confirmButtonColor:
                 "#4f46e5",
             });
           } catch (err) {
             Swal.fire({
               icon: "error",
               title:
                 err.message ||
                 "Collection failed to create!",
             })
    } finally {
      setIsSubmitting(false);
    }
    
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-64 bg-gray-200 rounded-xl mb-8 animate-pulse" />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="h-6 bg-gray-100 rounded-lg w-1/3" />
                <div className="h-12 bg-gray-100 rounded-xl" />
                <div className="h-32 bg-gray-100 rounded-xl" />
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-64 bg-gray-100 rounded-xl" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-80 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Layers3 className="w-5 h-5 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Create Collection
            </h1>
          </div>

          <p className="text-sm text-gray-500 ml-13 pl-0.5">
            Organize products into curated groups for your storefront
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">
            {/* DETAILS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-indigo-500" />

                <h2 className="font-semibold text-gray-800">
                  Collection Details
                </h2>
              </div>

              <div className="space-y-4">
                {/* NAME */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Collection Name{" "}
                    <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Summer Essentials 2026"
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* SLUG */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Collection Slug
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlugEdited(true);
                        setSlug(generateSlug(e.target.value));
                      }}
                      placeholder="collection-slug"
                      className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 placeholder:text-gray-400"
                    />

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      /{slug}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Auto generated from collection name
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>

                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what makes this collection special..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none bg-gray-50 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon className="w-4 h-4 text-indigo-500" />

                <h2 className="font-semibold text-gray-800">
                  Cover Image
                </h2>

                <span className="ml-auto text-xs text-gray-400">
                  PNG, JPG up to 10MB
                </span>
              </div>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden ring-1 ring-gray-200">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-72 object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 flex items-center justify-center shadow-md transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                    {imageFile?.name}
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

                    const file = e.dataTransfer.files[0];

                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className={`h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    dragging
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition ${
                      dragging ? "bg-indigo-100" : "bg-gray-100"
                    }`}
                  >
                    <Upload
                      className={`w-7 h-7 transition ${
                        dragging ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                  </div>

                  <p className="font-semibold text-gray-700 text-sm">
                    Drop image here or{" "}
                    <span className="text-indigo-600">browse</span>
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Recommended: 1200 × 600px
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* SUMMARY */}
            <div className="bg-black text-white rounded-3xl p-6">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Images</span>

                  <span>{imageFile ? 1 : 0}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Collection Name</span>

                  <span className="truncate text-right">
                    {name || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Slug</span>

                  <span className="truncate text-right">
                    {slug || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Description</span>

                  <span>{description.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Products</span>

                  <span>{selectedProducts.length}</span>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Collection...
                </>
              ) : (
                <>
                  <Layers3 className="w-4 h-4" />
                  Create Collection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollection;