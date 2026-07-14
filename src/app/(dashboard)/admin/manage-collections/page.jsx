"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";

import {
  Edit2, Trash2, X, RefreshCw, Upload,
  Search, Layers3, Boxes, Link2,
  ImageIcon, Loader2, CheckCircle2,
} from "lucide-react";

import Swal from "sweetalert2";
import { useAdminCollections, useAdminProducts, useDeleteCollection } from "@/lib/admin-hooks";

const ManageCollections = () => {
  const { data: collections = [], isLoading: collectionsLoading, refetch: refetchCollections } = useAdminCollections();
  const { data: products = [] } = useAdminProducts();
  const deleteCollection = useDeleteCollection();

  const [search, setSearch] = useState("");
  const [editCollection, setEditCollection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCollections = useMemo(() => {
    return collections.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [collections, search]);

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
      Swal.fire({ icon: "success", title: "Deleted Successfully", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Delete Failed" });
    }
  };

  const getProductCount = (collectionId) => {
    return products.filter((p) =>
      p.collections?.some((c) => c._id === collectionId)
    ).length;
  };

  if (collectionsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm text-slate-400">Loading Collections...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Collections</h1>
            <p className="text-sm text-slate-400 mt-1">{collections.length} total collections</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => refetchCollections()}
              className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-sm font-medium flex items-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search collections..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => {
            const productCount = getProductCount(collection._id);
            return (
              <div key={collection._id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition group">

                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 relative">
                  {collection.image ? (
                    <img src={collection.image} alt={collection.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => setEditCollection(collection)}
                      className="w-9 h-9 rounded-xl bg-white/90 shadow border border-slate-200 flex items-center justify-center hover:bg-white transition">
                      <Edit2 className="w-4 h-4 text-indigo-600" />
                    </button>
                    <button onClick={() => handleDelete(collection._id)}
                      className="w-9 h-9 rounded-xl bg-white/90 shadow border border-slate-200 flex items-center justify-center hover:bg-white transition">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 truncate">{collection.name}</h2>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{collection.description || "No description"}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Boxes className="w-3.5 h-3.5" />
                    {productCount} product{productCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" />
                    {collection._id?.slice(-6)}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredCollections.length === 0 && (
            <div className="col-span-full bg-white border border-slate-200 rounded-3xl py-20 text-center">
              <Layers3 className="w-12 h-12 mx-auto text-slate-300" />
              <p className="mt-4 font-semibold text-slate-400">No Collections Found</p>
            </div>
          )}
        </div>
      </div>

      {editCollection && (
        <EditCollectionModal
          collection={editCollection}
          onClose={() => setEditCollection(null)}
          onUpdated={() => setEditCollection(null)}
        />
      )}
    </div>
  );
};

export default ManageCollections;

function EditCollectionModal({ collection, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(collection.image || null);

  const [formData, setFormData] = useState({
    name: collection.name || "",
    description: collection.description || "",
    status: collection.status || "active",
  });

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("status", formData.status);
      if (image) fd.append("image", image);

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/collections/${collection._id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) throw new Error("Update failed");
      Swal.fire({ icon: "success", title: "Updated Successfully", timer: 1500, showConfirmButton: false });
      onUpdated();
    } catch {
      Swal.fire({ icon: "error", title: "Update Failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Edit Collection</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" required />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 mt-1">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Image</label>
            {imagePreview && (
              <div className="mb-3 w-full h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center justify-center h-20 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <Upload className="w-5 h-5" />
                <span className="text-xs font-medium">{imagePreview ? "Change Image" : "Upload Image"}</span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="h-12 px-6 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
