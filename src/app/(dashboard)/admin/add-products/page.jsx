"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  X,
  Upload,
  Tag,
  Package,
  Layers3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const AddProducts = () => {
  const [imageFiles, setImageFiles] =
    useState([]);

  const [imagePreview, setImagePreview] =
    useState([]);

  const [variants, setVariants] =
    useState([
      {
        size: "",
        color: "#6366f1",
        stock: 0,
        price: 0,
      },
    ]);

  const [status, setStatus] =
    useState("draft");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [collections, setCollections] =
    useState([]);

  // ✅ Selected Collections
  const [
    selectedCollections,
    setSelectedCollections,
  ] = useState([]);

  const [fields, setFields] = useState({
    title: "",
    description: "",
    vendor: "",
    sku: "",
    price: "",
    productType: "",
  });

  // =====================================
  // FETCH COLLECTIONS
  // =====================================
  useEffect(() => {
    fetch(`${API}/collections`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(
          Array.isArray(data) ? data : []
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Failed to load collections"
        );
      });
  }, []);

  // =====================================
  // FIELD CHANGE
  // =====================================
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // IMAGE UPLOAD
  // =====================================
  const handleImageUpload = (e) => {
    const files = Array.from(
      e.target.files
    );

    if (
      files.length + imageFiles.length >
      5
    ) {
      toast.warning(
        "Maximum 5 images allowed"
      );
      return;
    }

    setImageFiles((prev) => [
      ...prev,
      ...files,
    ]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreview((prev) => [
      ...prev,
      ...previews,
    ]);
  };

  // =====================================
  // REMOVE IMAGE
  // =====================================
  const removeImage = (index) => {
    if (
      imagePreview[index]?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview[index]
      );
    }

    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreview((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================
  // VARIANTS
  // =====================================
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        color: "#6366f1",
        stock: 0,
        price: 0,
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;

    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const updateVariant = (
    index,
    field,
    value
  ) => {
    const updated = [...variants];

    updated[index][field] =
      field === "stock" ||
      field === "price"
        ? Number(value)
        : value;

    setVariants(updated);
  };

  // =====================================
  // COLLECTION SELECT
  // =====================================
  const toggleCollection = (
    collection
  ) => {
    const exists =
      selectedCollections.find(
        (c) =>
          c._id === String(collection._id)
      );

    if (exists) {
      setSelectedCollections((prev) =>
        prev.filter(
          (c) =>
            c._id !==
            String(collection._id)
        )
      );
    } else {
      setSelectedCollections((prev) => [
        ...prev,
        {
          _id: String(collection._id),
          name: collection.name,
        },
      ]);
    }
  };

  const isCollectionSelected = (
    id
  ) => {
    return selectedCollections.some(
      (c) => c._id === String(id)
    );
  };

  // =====================================
  // RESET FORM
  // =====================================
  const resetForm = () => {
    setFields({
      title: "",
      description: "",
      vendor: "",
      sku: "",
      price: "",
      productType: "",
    });

    imagePreview.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setImageFiles([]);
    setImagePreview([]);

    setVariants([
      {
        size: "",
        color: "#6366f1",
        stock: 0,
        price: 0,
      },
    ]);

    setSelectedCollections([]);
    setStatus("draft");
  };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fields.title) {
      toast.error("Title is required");
      return;
    }

    if (!fields.description) {
      toast.error(
        "Description is required"
      );
      return;
    }

    if (!fields.price) {
      toast.error("Price is required");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error(
        "At least one image required"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // =========================
      // BASIC FIELDS
      // =========================
      formData.append(
        "title",
        fields.title
      );

      formData.append(
        "description",
        fields.description
      );

      formData.append(
        "vendor",
        fields.vendor
      );

      formData.append(
        "sku",
        fields.sku
      );

      formData.append(
        "price",
        fields.price
      );

      formData.append(
        "productType",
        fields.productType
      );

      formData.append(
        "status",
        status
      );

      // =========================
      // VARIANTS
      // =========================
      formData.append(
        "variants",
        JSON.stringify(variants)
      );

      // =========================
      // COLLECTIONS
      // =========================
      formData.append(
        "collections",
        JSON.stringify(
          selectedCollections
        )
      );

      // =========================
      // IMAGES
      // =========================
      imageFiles.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      // =========================
      // API REQUEST
      // =========================
      const res = await fetch(
        `${API}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to save product"
        );
      }

      toast.success(
        "✅ Product created successfully"
      );

      resetForm();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================
  // TOTAL STOCK
  // =====================================
  const totalStock =
    variants.reduce(
      (sum, item) =>
        sum + Number(item.stock || 0),
      0
    );

  return (
    <div className="bg-[#F7F8FC] min-h-screen pb-24">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-7xl mx-auto p-6"
      >
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                Add Product
              </h1>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Create your product
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {status === "active" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}

            {status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-5">
            {/* PRODUCT INFO */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold mb-5 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" />
                Product Information
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={fields.title}
                  onChange={
                    handleFieldChange
                  }
                  placeholder="Product title"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <textarea
                  rows={4}
                  name="description"
                  value={fields.description}
                  onChange={
                    handleFieldChange
                  }
                  placeholder="Description"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="vendor"
                    value={fields.vendor}
                    onChange={
                      handleFieldChange
                    }
                    placeholder="Vendor"
                    className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <input
                    type="text"
                    name="sku"
                    value={fields.sku}
                    onChange={
                      handleFieldChange
                    }
                    placeholder="SKU"
                    className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* IMAGES */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold mb-5 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-500" />
                Images
              </h2>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl h-32 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />

                <p className="text-sm text-gray-500">
                  Upload images
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />
              </label>

              {imagePreview.length >
                0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {imagePreview.map(
                    (img, i) => (
                      <div
                        key={i}
                        className="relative"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-24 object-cover rounded-xl"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(i)
                          }
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* PRICE */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold mb-5">
                Pricing
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  value={fields.price}
                  onChange={
                    handleFieldChange
                  }
                  placeholder="Price"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="text"
                  name="productType"
                  value={
                    fields.productType
                  }
                  onChange={
                    handleFieldChange
                  }
                  placeholder="Product Type"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* VARIANTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold">
                  Variants
                </h2>

                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1 text-sm text-indigo-600 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {variants.map(
                  (variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-3 items-center"
                    >
                      <select
                        value={
                          variant.size
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "size",
                            e.target.value
                          )
                        }
                        className="h-10 border border-gray-200 rounded-xl px-3 text-sm"
                      >
                        <option value="">
                          Size
                        </option>

                        {[
                          "XS",
                          "S",
                          "M",
                          "L",
                          "XL",
                        ].map((s) => (
                          <option
                            key={s}
                            value={s}
                          >
                            {s}
                          </option>
                        ))}
                      </select>

                      <input
                        type="color"
                        value={
                          variant.color
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "color",
                            e.target.value
                          )
                        }
                        className="w-full h-10 border border-gray-200 rounded-xl"
                      />

                      <input
                        type="number"
                        placeholder="Stock"
                        value={
                          variant.stock
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "stock",
                            e.target.value
                          )
                        }
                        className="h-10 border border-gray-200 rounded-xl px-3 text-sm"
                      />

                      <input
                        type="number"
                        placeholder="Price"
                        value={
                          variant.price
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        className="h-10 border border-gray-200 rounded-xl px-3 text-sm"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeVariant(
                            index
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* STATUS */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Status
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setStatus("draft")
                  }
                  className={`p-3 rounded-xl border text-sm font-medium ${
                    status === "draft"
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200"
                  }`}
                >
                  Draft
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStatus("active")
                  }
                  className={`p-3 rounded-xl border text-sm font-medium ${
                    status === "active"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200"
                  }`}
                >
                  Active
                </button>
              </div>
            </div>

            {/* COLLECTIONS */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                <Layers3 className="w-4 h-4" />
                Collections
              </h3>

              {collections.length ===
              0 ? (
                <p className="text-sm text-gray-400">
                  No collections found
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {collections.map(
                    (collection) => (
                      <label
                        key={
                          collection._id
                        }
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${
                          isCollectionSelected(
                            collection._id
                          )
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isCollectionSelected(
                            collection._id
                          )}
                          onChange={() =>
                            toggleCollection(
                              collection
                            )
                          }
                          className="w-4 h-4"
                        />

                        {collection.imageUrl && (
                          <img
                            src={
                              collection.imageUrl
                            }
                            alt={
                              collection.name
                            }
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}

                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {
                              collection.name
                            }
                          </p>
                        </div>
                      </label>
                    )
                  )}
                </div>
              )}

              {/* SELECTED */}
              {selectedCollections.length >
                0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-indigo-600 font-semibold mb-2">
                    Selected Collections
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedCollections.map(
                      (item) => (
                        <span
                          key={item._id}
                          className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {item.name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SUMMARY */}
            <div className="bg-gray-900 rounded-2xl p-5 text-white">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">
                Summary
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    Images
                  </span>

                  <span>
                    {
                      imageFiles.length
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Variants
                  </span>

                  <span>
                    {variants.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Stock
                  </span>

                  <span>
                    {totalStock}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Collections
                  </span>

                  <span>
                    {
                      selectedCollections.length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex items-center justify-end gap-3 z-50">
          <button
            type="button"
            onClick={() =>
              setStatus("draft")
            }
            className="h-11 px-6 rounded-xl border border-gray-300 text-sm font-medium"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() =>
              setStatus("active")
            }
            className="h-11 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Publish Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;