"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Loader2,
  ImageIcon,
  X,
  Check,
  Upload,
  LayoutDashboard,
  Eye,
  EyeOff,
  Sparkles,
  MousePointerClick,
  Type,
  Tag,
  AlignLeft,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const BADGE_OPTIONS = [
  "New Arrival",
  "Best Seller",
  "Limited Edition",
  "Hot Deal",
  "Exclusive",
  "Trending",
  "Sale",
];

// ==========================================
// EDIT MODAL
// ==========================================

const EditModal = ({ slider, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(slider.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState(
    Array.isArray(slider.badges) ? slider.badges : []
  );
  const [status, setStatus] = useState(slider.status || "draft");
  const [form, setForm] = useState({
    title: slider.title || "",
    description: slider.description || "",
    badge: slider.badge || "",
    buttonText: slider.buttonText || "SHOP NOW",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const toggleBadge = (badge) =>
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("badge", form.badge);
      data.append("buttonText", form.buttonText);
      data.append("badges", JSON.stringify(selectedBadges));
      data.append("status", status);
      if (imageFile) data.append("image", imageFile);

      const res = await fetch(`${API}/hero-sliders/${slider._id}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success("Slider updated successfully");
      onSaved(result.data);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-black text-slate-900">Edit Slider</h2>
            <p className="text-xs text-slate-400 mt-0.5">Update slider details</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* IMAGE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <ImageIcon size={13} className="text-indigo-500" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Slider Image
              </span>
            </div>

            <label className="block cursor-pointer">
              <div className="relative h-44 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors group">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 text-sm font-semibold text-slate-700">
                        <Upload size={14} />
                        Change Image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <Upload size={20} className="mb-2" />
                    <p className="text-sm font-semibold">Upload banner image</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {/* FIELDS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

            {/* TITLE */}
            <div>
              <label className={labelCls}>Title <span className="text-rose-400 normal-case">*</span></label>
              <div className="relative">
                <Type size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input name="title" value={form.title} onChange={handleChange} placeholder="Slider title" className={`${inputCls} pl-9`} />
              </div>
            </div>

            {/* BADGE + BUTTON */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Badge Text</label>
                <div className="relative">
                  <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. New Arrival" className={`${inputCls} pl-9`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Button Text</label>
                <div className="relative">
                  <MousePointerClick size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input name="buttonText" value={form.buttonText} onChange={handleChange} placeholder="SHOP NOW" className={`${inputCls} pl-9`} />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short promo text…"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              />
            </div>

            {/* QUICK BADGES */}
            <div>
              <label className={labelCls}>Quick Badge Tags</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((badge) => {
                  const selected = selectedBadges.includes(badge);
                  return (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`h-9 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        selected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      <Sparkles size={12} />
                      {badge}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className={labelCls}>Status</label>
            <div className="flex gap-3">
              {["active", "draft"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 h-11 rounded-xl border text-sm font-semibold capitalize transition-all ${
                    status === s
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                      : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Saving…</>
              ) : (
                <><Check size={14} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================

const ManageHeroSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingSlider, setEditingSlider] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH
  // ==========================================

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/hero-sliders`);
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Slider?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API}/hero-sliders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSliders((prev) => prev.filter((s) => s._id !== id));
      toast.success("Slider deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // QUICK STATUS TOGGLE
  // ==========================================

  const handleStatusToggle = async (slider) => {
    const newStatus = slider.status === "active" ? "draft" : "active";
    try {
      const data = new FormData();
      data.append("status", newStatus);
      const res = await fetch(`${API}/hero-sliders/${slider._id}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setSliders((prev) =>
        prev.map((s) =>
          s._id === slider._id ? { ...s, status: newStatus } : s
        )
      );
      toast.success(`Slider set to ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filtered = sliders.filter((s) => {
    const matchSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.badge?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = sliders.filter((s) => s.status === "active").length;
  const draftCount = sliders.filter((s) => s.status === "draft").length;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Hero Sliders
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your homepage banner slides
            </p>
          </div>
          <Link
            href="/admin/add-hero-slider"
            className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all w-fit"
          >
            <Plus size={15} />
            Add New Slider
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total", value: sliders.length, color: "bg-slate-900 text-white" },
            { label: "Active", value: activeCount, color: "bg-emerald-500 text-white" },
            { label: "Draft", value: draftCount, color: "bg-amber-400 text-white" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${color} rounded-2xl p-4 text-center shadow-sm`}>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs font-semibold opacity-80 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3 shadow-sm">

          {/* SEARCH */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or badge…"
              className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex gap-2">
            {["all", "active", "draft"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`h-10 px-4 rounded-xl border text-sm font-semibold capitalize transition-all ${
                  filterStatus === s
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-indigo-500" />
              <p className="text-sm text-slate-400 font-medium">Loading sliders…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <LayoutDashboard size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No sliders found</h3>
            <p className="text-sm text-slate-400 mt-1 mb-5">
              {search ? "Try a different search term" : "Create your first hero slider"}
            </p>
            <Link
              href="/admin/add-hero-slider"
              className="h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200"
            >
              <Plus size={14} />
              Add Slider
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((slider) => (
              <SliderCard
                key={slider._id}
                slider={slider}
                onEdit={() => setEditingSlider(slider)}
                onDelete={() => handleDelete(slider._id)}
                onToggleStatus={() => handleStatusToggle(slider)}
                isDeleting={deletingId === slider._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingSlider && (
        <EditModal
          slider={editingSlider}
          onClose={() => setEditingSlider(null)}
          onSaved={(updated) => {
            setSliders((prev) =>
              prev.map((s) => (s._id === updated._id ? updated : s))
            );
            setEditingSlider(null);
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// SLIDER CARD
// ==========================================

const SliderCard = ({ slider, onEdit, onDelete, onToggleStatus, isDeleting }) => {
  const isActive = slider.status === "active";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">

      {/* IMAGE */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {slider.image ? (
          <img
            src={slider.image}
            alt={slider.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={32} className="text-slate-300" />
          </div>
        )}

        {/* STATUS BADGE */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
              isActive
                ? "bg-emerald-500 text-white"
                : "bg-amber-400 text-white"
            }`}
          >
            {isActive ? "ACTIVE" : "DRAFT"}
          </span>
        </div>

        {/* BADGE TAG */}
        {slider.badge && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500 text-white">
              {slider.badge}
            </span>
          </div>
        )}

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-50 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="w-9 h-9 rounded-xl bg-white text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 truncate text-sm">
          {slider.title || "Untitled Slider"}
        </h3>

        {slider.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {slider.description}
          </p>
        )}

        {/* QUICK BADGES */}
        {Array.isArray(slider.badges) && slider.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {slider.badges.slice(0, 3).map((b) => (
              <span
                key={b}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100"
              >
                {b}
              </span>
            ))}
            {slider.badges.length > 3 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                +{slider.badges.length - 3}
              </span>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">

          {/* BUTTON TEXT */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <MousePointerClick size={12} />
            <span className="text-xs font-medium truncate max-w-25">
              {slider.buttonText || "SHOP NOW"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {/* TOGGLE STATUS */}
            <button
              onClick={onToggleStatus}
              title={isActive ? "Set to Draft" : "Set to Active"}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100"
              }`}
            >
              {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>

            {/* EDIT */}
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-all"
            >
              <Pencil size={13} />
            </button>

            {/* DELETE */}
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHeroSliders;