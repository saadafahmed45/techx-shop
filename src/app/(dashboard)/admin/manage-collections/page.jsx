"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Upload,
  Search,
  Layers3,
  Boxes,
  Link2,
  ImageIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import Swal from "sweetalert2";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const ManageCollections = () => {
  const [collections, setCollections] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [editCollection, setEditCollection] =
    useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =====================================
  // FETCH
  // =====================================

  const fetchCollections =
    useCallback(async () => {
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
      } catch (err) {
        console.log(err);

        Swal.fire({
          icon: "error",
          title:
            "Failed to fetch collections",
        });
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchProducts =
    useCallback(async () => {
      try {
        const res = await fetch(
          `${API}/products`
        );

        const data =
          await res.json();

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.log(err);
      }
    }, []);

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, [
    fetchCollections,
    fetchProducts,
  ]);

  // =====================================
  // FILTER
  // =====================================

  const filteredCollections =
    useMemo(() => {
      return collections.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [collections, search]);

  // =====================================
  // DELETE
  // =====================================

  const handleDelete =
    async (id) => {
      const result =
        await Swal.fire({
          title:
            "Delete Collection?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:
            "#ef4444",
          cancelButtonColor:
            "#d1d5db",
          confirmButtonText:
            "Delete",
        });

      if (!result.isConfirmed)
        return;

      try {
        const res = await fetch(
          `${API}/collections/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok)
          throw new Error();

        setCollections((prev) =>
          prev.filter(
            (c) => c._id !== id
          )
        );

        Swal.fire({
          icon: "success",
          title:
            "Deleted Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title:
            "Delete Failed",
        });
      }
    };

  // =====================================
  // EDIT CHANGE
  // =====================================

  const handleEditChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setEditCollection(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setEditCollection(
      (prev) => ({
        ...prev,
        imageFile: file,
        imagePreview:
          URL.createObjectURL(
            file
          ),
      })
    );
  };

  // =====================================
  // UPDATE
  // =====================================

  const handleEditSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setIsSubmitting(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          editCollection.name
        );

        formData.append(
          "slug",
          editCollection.slug
        );

        formData.append(
          "description",
          editCollection.description
        );

        formData.append(
          "productIds",
          JSON.stringify(
            editCollection.productIds ||
              []
          )
        );

        if (
          editCollection.imageFile
        ) {
          formData.append(
            "image",
            editCollection.imageFile
          );
        }

        const res =
          await fetch(
            `${API}/collections/${editCollection._id}`,
            {
              method: "PUT",
              body: formData,
            }
          );

        const data =
          await res.json();

        if (!res.ok)
          throw new Error(
            data.message
          );

        setCollections((prev) =>
          prev.map((item) =>
            item._id ===
            data._id
              ? data
              : item
          )
        );

        Swal.fire({
          icon: "success",
          title:
            "Collection Updated",
          text: "Changes saved successfully",
          confirmButtonColor:
            "#4f46e5",
        });

        setEditCollection(
          null
        );
      } catch (err) {
        Swal.fire({
          icon: "error",
          title:
            err.message ||
            "Update Failed",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-7">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Layers3 className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Collections
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage ecommerce collections
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="h-11 w-64 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => {
                setLoading(
                  true
                );

                fetchCollections();
              }}
              className="h-11 px-5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Collections
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-2">
                  {
                    collections.length
                  }
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Layers3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Products
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-2">
                  {
                    products.length
                  }
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Boxes className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Linked Products
                </p>

                <h2 className="text-3xl font-black text-gray-900 mt-2">
                  {collections.reduce(
                    (
                      acc,
                      item
                    ) =>
                      acc +
                      (item
                        .productIds
                        ?.length ||
                        0),
                    0
                  )}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* TABLE HEAD */}

          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
            <div className="col-span-1">
              #
            </div>

            <div className="col-span-4">
              Collection
            </div>

            <div className="col-span-2">
              Products
            </div>

            <div className="col-span-2">
              Slug
            </div>

            <div className="col-span-1">
              Status
            </div>

            <div className="col-span-2 text-right">
              Actions
            </div>
          </div>

          {/* ROWS */}

          {filteredCollections.map(
            (
              collection,
              index
            ) => (
              <div
                key={
                  collection._id
                }
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50/70 transition"
              >

                {/* NUMBER */}

                <div className="lg:col-span-1 flex items-center text-sm text-gray-500 font-medium">
                  {index + 1}
                </div>

                {/* COLLECTION */}

                <div className="lg:col-span-4 flex items-center gap-4">
                  {collection.imageUrl ? (
                    <img
                      src={
                        collection.imageUrl
                      }
                      alt={
                        collection.name
                      }
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 truncate">
                      {
                        collection.name
                      }
                    </h2>

                    <p className="text-sm text-gray-400 truncate">
                      {
                        collection.description
                      }
                    </p>
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className="lg:col-span-2 flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    <Boxes className="w-3.5 h-3.5" />
                    {collection
                      .productIds
                      ?.length ||
                      0}{" "}
                    Products
                  </span>
                </div>

                {/* SLUG */}

                <div className="lg:col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    /
                    {
                      collection.slug
                    }
                  </span>
                </div>

                {/* STATUS */}

                <div className="lg:col-span-1 flex items-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>

                {/* ACTIONS */}

                <div className="lg:col-span-2 flex items-center justify-end gap-2">

                  <button
                    onClick={() =>
                      setEditCollection(
                        {
                          ...collection,
                          imagePreview:
                            collection.imageUrl,
                        }
                      )
                    }
                    className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        collection._id
                      )
                    }
                    className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}

          {/* EMPTY */}

          {filteredCollections.length ===
            0 && (
            <div className="py-20 text-center">
              <Layers3 className="w-14 h-14 text-gray-300 mx-auto mb-4" />

              <h2 className="text-xl font-bold text-gray-800">
                No Collections Found
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Try another search
              </p>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}

      {editCollection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Collection
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update collection details
                </p>
              </div>

              <button
                onClick={() =>
                  setEditCollection(
                    null
                  )
                }
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleEditSubmit
              }
              className="p-6 space-y-5"
            >

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Collection Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    editCollection.name
                  }
                  onChange={
                    handleEditChange
                  }
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={
                    editCollection.slug
                  }
                  onChange={
                    handleEditChange
                  }
                  className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </label>

                <textarea
                  rows={4}
                  name="description"
                  value={
                    editCollection.description
                  }
                  onChange={
                    handleEditChange
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cover Image
                </label>

                {editCollection.imagePreview && (
                  <img
                    src={
                      editCollection.imagePreview
                    }
                    alt=""
                    className="w-full h-52 rounded-2xl object-cover border border-gray-100 mb-3"
                  />
                )}

                <label className="h-11 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 flex items-center justify-center gap-2 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-gray-400" />

                  <span className="text-sm font-medium text-gray-600">
                    Upload Image
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />
                </label>
              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">

                <button
                  type="button"
                  onClick={() =>
                    setEditCollection(
                      null
                    )
                  }
                  className="h-11 px-5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 transition disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}

                  {isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCollections;