"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Edit2, Trash2, X, RefreshCw, Upload, Package, Search,
  Layers3, Boxes, Link2, ImageIcon, Check, Plus,
} from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ManageCollections = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCollection, setEditCollection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch(`${API}/collections`);
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, [fetchCollections, fetchProducts]);

  const filteredCollections = useMemo(() => {
    return collections.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [collections, search]);

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`${API}/collections/${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCollections((prev) => prev.filter((c) => c._id !== _id));
      setDeleteConfirm(null);
      toast.success("Collection deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // FIX: proper product toggle with string coercion
  const toggleProductInEdit = (productId) => {
    if (!editCollection) return;
    const ids = (editCollection.productIds || []).map(String);
    const id = String(productId);
    const updated = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
    setEditCollection({ ...editCollection, productIds: updated });
  };

  const isProductSelected = (productId) => {
    return (editCollection?.productIds || []).map(String).includes(String(productId));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCollection) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", editCollection.name);
      formData.append("description", editCollection.description);

      // FIX: Send as JSON array so backend parses correctly regardless of framework
      const ids = (editCollection.productIds || []).map(String);
      formData.append("productIds", JSON.stringify(ids));
      ids.forEach((id) => formData.append("productIds[]", id));

      if (editCollection.imageFile) {
        formData.append("image", editCollection.imageFile);
      }

      const res = await fetch(`${API}/collections/${editCollection._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Collection updated");
      setEditCollection(null);
      fetchCollections();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCollection({ ...editCollection, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // FIX: revoke previous blob URL
    if (editCollection.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(editCollection.imagePreview);
    }
    setEditCollection({
      ...editCollection,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const totalLinkedProducts = collections.reduce(
    (acc, item) => acc + (item.productIds?.length || 0), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-5 mb-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-white animate-pulse shadow-sm" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded-lg animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <Layers3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Collections</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage and organise your product collections</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search collections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-60 transition"
              />
            </div>
            <button
              onClick={() => { setLoading(true); fetchCollections(); fetchProducts(); }}
              className="h-10 px-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-600 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Collections", value: collections.length, icon: Layers3, color: "indigo", bg: "bg-indigo-50", text: "text-indigo-600" },
            { label: "Total Products", value: products.length, icon: Boxes, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600" },
            { label: "Linked Products", value: totalLinkedProducts, icon: Link2, color: "orange", bg: "bg-orange-50", text: "text-orange-600" },
          ].map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                <h2 className="text-3xl font-black text-gray-900 mt-1">{value}</h2>
              </div>
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${text}`} />
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {filteredCollections.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">No Collections Found</h2>
            <p className="text-gray-500 text-sm mt-1">Create your first collection to organise products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCollections.map((collection) => (
              <div
                key={collection._id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={collection.imageUrl || "/placeholder.png"}
                    alt={collection.name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
                      {collection.productIds?.length || 0} products
                    </span>
                  </div>
                  {/* Hover actions */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setEditCollection({
                        ...collection,
                        productIds: (collection.productIds || []).map(String),
                        imagePreview: collection.imageUrl,
                      })}
                      className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-indigo-600 flex items-center justify-center shadow-sm transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(collection._id)}
                      className="w-8 h-8 rounded-lg bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 flex items-center justify-center shadow-sm transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h2 className="font-bold text-gray-900 truncate">{collection.name}</h2>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{collection.description}</p>

                  {/* Product avatar row */}
                  <div className="flex items-center gap-1 mt-4">
                    <div className="flex -space-x-2">
                      {(collection.products || []).slice(0, 4).map((p) => (
                        <img
                          key={p._id}
                          src={p.images?.[0] || "/placeholder.png"}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          alt=""
                        />
                      ))}
                      {(collection.products || []).length === 0 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                          <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {(collection.products || []).length > 4 && (
                      <span className="text-xs text-gray-400 ml-1">+{collection.products.length - 4} more</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setEditCollection({
                        ...collection,
                        productIds: (collection.productIds || []).map(String),
                        imagePreview: collection.imageUrl,
                      })}
                      className="flex-1 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(collection._id)}
                      className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-center text-gray-900">Delete Collection?</h2>
            <p className="text-gray-500 text-sm text-center mt-1">This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="h-11 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-sm text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editCollection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-4">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit Collection</h2>
                <p className="text-sm text-gray-500 mt-0.5">Update collection details and products</p>
              </div>
              <button
                onClick={() => setEditCollection(null)}
                className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid md:grid-col gap-6">
                {/* LEFT */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editCollection.name}
                      onChange={handleEditChange}
                      required
                      className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={editCollection.slug}
                      onChange={handleEditChange}
                      rows={3}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
                    <textarea
                      name="description"
                      value={editCollection.description}
                      onChange={handleEditChange}
                      rows={3}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                    
                  {/* Cover image */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cover Image</label>
                    {editCollection.imagePreview && (
                      <img
                        src={editCollection.imagePreview}
                        alt="preview"
                        className="w-full h-40 object-cover rounded-xl mb-2 ring-1 ring-gray-200"
                      />
                    )}
                    <label className="flex items-center justify-center gap-2 h-10 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">Change image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
 
                
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditCollection(null)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCollections;