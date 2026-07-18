"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Edit2, Trash2, X, RefreshCw, Upload,
  Search, Layers3,
  ImageIcon, Loader2, Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  useAdminCollections,
  useAdminProducts,
  useDeleteCollection,
} from "@/lib/admin-hooks";

const ManageCollections = () => {
  const queryClient = useQueryClient();
  const {
    data: collections = [],
    isLoading: collectionsLoading,
    isFetching,
  } = useAdminCollections();
  const { data: products = [] } = useAdminProducts();
  const deleteCollection = useDeleteCollection();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
  };

  const [search, setSearch] = useState("");
  const [editCollection, setEditCollection] = useState(null);

  const filteredCollections = useMemo(() =>
    collections.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    ), [collections, search]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Collection?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCollection.mutateAsync(id);
      Swal.fire({ icon: "success", title: "Deleted", timer: 1400, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Delete Failed" });
    }
  };

  // Count products that belong to this collection
  const getProductCount = (collectionId) =>
    products.filter((p) =>
      Array.isArray(p.collections) &&
      p.collections.some((c) => (c._id || c) === String(collectionId))
    ).length;

  if (collectionsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="mt-3 text-sm text-slate-400">Loading collections…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-7 md:px-10 md:py-9">
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Collections</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {filteredCollections.length} of {collections.length} collections
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium flex items-center gap-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-indigo-500" : ""}`} />
              {isFetching ? "Refreshing…" : "Refresh"}
            </button>
            <Link
              href="/admin/add-collections"
              className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Collection
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-slate-100 rounded-2xl p-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search collections…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Total</p>
            <p className="mt-1.5 text-3xl font-black text-slate-900">{collections.length}</p>
          </div>
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">With Image</p>
            <p className="mt-1.5 text-3xl font-black text-indigo-700">
              {collections.filter((c) => c.imageUrl).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 hidden sm:block">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Products</p>
            <p className="mt-1.5 text-3xl font-black text-slate-900">{products.length}</p>
          </div>
        </div>

        {/* LIST */}
        {filteredCollections.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl py-20 text-center">
            <Layers3 className="w-10 h-10 mx-auto text-slate-200" />
            <p className="mt-3 text-sm font-semibold text-slate-400">No Collections Found</p>
            <Link href="/admin/add-collections" className="mt-4 inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline">
              <Plus className="w-3.5 h-3.5" /> Create your first collection
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_1fr_80px_100px] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
              <div className="w-10" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Collection</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hidden md:block">Description</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Products</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</p>
            </div>

            <div className="divide-y divide-slate-50">
              {filteredCollections.map((collection) => {
                const productCount = getProductCount(collection._id);
                return (
                  <div
                    key={collection._id}
                    className="grid grid-cols-[auto_1fr_1fr_80px_100px] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/50 transition group"
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                      {collection.imageUrl ? (
                        <img src={collection.imageUrl} alt={collection.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Name + slug */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{collection.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">/{collection.slug || collection._id?.slice(-8)}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 hidden md:block">
                      {collection.description || "—"}
                    </p>

                    {/* Product count */}
                    <div className="flex justify-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${productCount > 0 ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                        {productCount}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditCollection(collection)}
                        className="w-8 h-8 rounded-xl border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(collection._id)}
                        className="w-8 h-8 rounded-xl border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editCollection && (
        <EditCollectionModal
          collection={editCollection}
          onClose={() => setEditCollection(null)}
          onUpdated={() => {
            setEditCollection(null);
            // FIX: refetch so the list updates after edit
            refetchCollections();
          }}
        />
      )}
    </div>
  );
};

export default ManageCollections;

// =============================================
// EDIT MODAL
// =============================================
function EditCollectionModal({ collection, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  // FIX: use imageUrl (not image) for existing preview
  const [imagePreview, setImagePreview] = useState(collection.imageUrl || null);

  const [formData, setFormData] = useState({
    name: collection.name || "",
    slug: collection.slug || "",
    description: collection.description || "",
  });

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("slug", formData.slug);
      fd.append("description", formData.description);
      // FIX: field name must match multer upload.single("image") on server
      if (newImageFile) fd.append("image", newImageFile);

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/collections/${collection._id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Update failed");
      }

      Swal.fire({ icon: "success", title: "Updated!", timer: 1400, showConfirmButton: false });
      onUpdated();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full h-11 rounded-xl border border-slate-100 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition mt-1";
  const labelCls = "text-[11px] font-bold uppercase tracking-widest text-slate-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Collection</h2>
            <p className="text-xs text-slate-400 mt-0.5">{collection.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputCls}
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Slug</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">/</span>
              <input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-11 rounded-xl border border-slate-100 pl-7 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition mt-1 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className={labelCls + " mb-2 block"}>Cover Image</label>
            {imagePreview && (
              <div className="mb-2 w-full h-36 rounded-xl overflow-hidden border border-slate-100">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center justify-center h-12 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Upload className="w-4 h-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-10 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
