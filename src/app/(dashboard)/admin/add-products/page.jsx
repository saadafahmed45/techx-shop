"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Upload,
  X,
  Search,
  Check,
  Loader2,
  Package,
  Layers3,
  Plus,
} from "lucide-react";

import { toast } from "react-toastify";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const AddProducts = () => {
  // =========================================
  // STATES
  // =========================================
  const [collections, setCollections] =
    useState([]);

  const [
    selectedCollections,
    setSelectedCollections,
  ] = useState([]);

  const [searchCollection, setSearchCollection] =
    useState("");

  const [imageFiles, setImageFiles] =
    useState([]);

  const [imagePreview, setImagePreview] =
    useState([]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] =
    useState("draft");

  const [featured, setFeatured] =
    useState(false);

  const [fields, setFields] =
    useState({
      title: "",
      slug: "",
      description: "",
      vendor: "",
      stock: "",
      price: "",
      productType: "",
      tags: "",
    });

  const [slugEdited, setSlugEdited] =
    useState(false);

  // =========================================
  // GENERATE SLUG
  // =========================================
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

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
    const fetchCollections =
      async () => {
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
        } catch (error) {
          toast.error(
            "Failed to load collections"
          );
        }
      };

    fetchCollections();
  }, []);

  // =========================================
  // HANDLE CHANGE
  // =========================================
  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // IMAGE UPLOAD
  // =========================================
  const handleImageUpload = (e) => {
    const files = Array.from(
      e.target.files
    );

    setImageFiles((prev) => [
      ...prev,
      ...files,
    ]);

    const previews = files.map(
      (file) =>
        URL.createObjectURL(file)
    );

    setImagePreview((prev) => [
      ...prev,
      ...previews,
    ]);
  };

  // =========================================
  // REMOVE IMAGE
  // =========================================
  const removeImage = (index) => {
    URL.revokeObjectURL(
      imagePreview[index]
    );

    setImageFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    setImagePreview((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // =========================================
  // TOGGLE COLLECTION
  // FULL OBJECT SAVE
  // =========================================
  const toggleCollection = (
    collection
  ) => {
    const exists =
      selectedCollections.find(
        (item) =>
          item._id ===
          collection._id
      );

    if (exists) {
      setSelectedCollections(
        (prev) =>
          prev.filter(
            (item) =>
              item._id !==
              collection._id
          )
      );
    } else {
      setSelectedCollections(
        (prev) => [
          ...prev,
          {
            _id: collection._id,
            name: collection.name,
            slug: collection.slug,
            image: collection.image,
          },
        ]
      );
    }
  };

  // =========================================
  // FILTER COLLECTIONS
  // =========================================
  const filteredCollections =
    useMemo(() => {
      return collections.filter(
        (collection) =>
          collection.name
            ?.toLowerCase()
            .includes(
              searchCollection.toLowerCase()
            )
      );
    }, [collections, searchCollection]);

  // =========================================
  // SUBMIT
  // =========================================
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !fields.title ||
      !fields.price
    ) {
      toast.error(
        "Please fill required fields"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formData =
        new FormData();

      // =====================================
      // BASIC
      // =====================================
      formData.append(
        "title",
        fields.title
      );

      formData.append(
        "slug",
        fields.slug
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

      formData.append(
        "featured",
        featured
      );

      formData.append(
        "stock",
        fields.stock
      );

      formData.append(
        "tags",
        fields.tags
      );

      // =====================================
      // COLLECTION OBJECTS
      // =====================================
      formData.append(
        "collections",
        JSON.stringify(
          selectedCollections
        )
      );

      // =====================================
      // IMAGES
      // =====================================
      imageFiles.forEach(
        (file) => {
          formData.append(
            "images",
            file
          );
        }
      );

      const res = await fetch(
        `${API}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to create product"
        );
      }

      toast.success(
        "Product Added Successfully"
      );

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
      setImageFiles([]);
      setImagePreview([]);
      setFeatured(false);
      setStatus("draft");
      setSlugEdited(false);
    } catch (error) {
      toast.error(
        error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-5">
            {/* PRODUCT INFO */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Layers3 className="w-5 h-5 text-black" />

                <h2 className="text-lg font-semibold">
                  Product Info
                </h2>
              </div>

              <div className="space-y-5">
                {/* TITLE */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      fields.title
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                  />
                </div>

                {/* SLUG */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Slug
                  </label>

                  <input
                    type="text"
                    value={
                      fields.slug
                    }
                    onChange={(e) => {
                      setSlugEdited(
                        true
                      );

                      setFields(
                        (
                          prev
                        ) => ({
                          ...prev,
                          slug: generateSlug(
                            e.target
                              .value
                          ),
                        })
                      );
                    }}
                    className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    name="description"
                    value={
                      fields.description
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black resize-none"
                  />
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="vendor"
                      value={
                        fields.vendor
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Product Type
                    </label>

                    <input
                      type="text"
                      name="productType"
                      value={
                        fields.productType
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={
                        fields.stock
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={
                        fields.price
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* TAGS */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tags
                  </label>

                  <input
                    type="text"
                    name="tags"
                    value={
                      fields.tags
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full h-12 rounded-2xl border border-gray-200 px-4 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* IMAGES */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-6">
                Images
              </h2>

              <label className="h-44 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-black transition">
                <Upload className="w-7 h-7 text-gray-400 mb-3" />

                <p className="text-sm text-gray-500">
                  Upload Images
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
                  {imagePreview.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-24 object-cover rounded-2xl"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
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
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* STATUS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-5">
                Status
              </h2>

              <div className="space-y-3">
                {["draft", "active"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setStatus(
                          item
                        )
                      }
                      className={`w-full h-12 rounded-2xl border text-sm font-medium capitalize ${
                        status ===
                        item
                          ? "bg-black text-white border-black"
                          : "border-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setFeatured(
                      !featured
                    )
                  }
                  className={`w-full h-12 rounded-2xl border text-sm font-medium ${
                    featured
                      ? "bg-black text-white border-black"
                      : "border-gray-200"
                  }`}
                >
                  Featured
                </button>
              </div>
            </div>

            {/* COLLECTIONS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-5 h-5" />

                <h2 className="text-lg font-semibold">
                  Collections
                </h2>
              </div>

              {/* SEARCH */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  value={
                    searchCollection
                  }
                  onChange={(e) =>
                    setSearchCollection(
                      e.target.value
                    )
                  }
                  placeholder="Search collections..."
                  className="w-full h-11 rounded-2xl border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-black"
                />
              </div>

              {/* COLLECTION LIST */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCollections.map(
                  (collection) => {
                    const selected =
                      selectedCollections.some(
                        (
                          item
                        ) =>
                          item._id ===
                          collection._id
                      );

                    return (
                      <button
                        key={
                          collection._id
                        }
                        type="button"
                        onClick={() =>
                          toggleCollection(
                            collection
                          )
                        }
                        className={`w-full flex items-center gap-3 border rounded-2xl p-3 transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={
                              collection.imageUrl
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">
                            {
                              collection.name
                            }
                          </p>

                          <p className="text-xs opacity-70">
                            /
                            {
                              collection.slug
                            }
                          </p>
                        </div>

                        {selected && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="bg-black text-white rounded-3xl p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>
                    Images
                  </span>

                  <span>
                    {
                      imageFiles.length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    Stock
                  </span>

                  <span>
                    {
                      fields.stock ||
                      0
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    Collections
                  </span>

                  <span>
                    {
                      selectedCollections.length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    Status
                  </span>

                  <span className="capitalize">
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-end z-50">
          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="h-11 px-5 rounded-2xl bg-black text-white font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Publish Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;