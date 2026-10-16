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
  ArrowUpDown,
  SlidersHorizontal,
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
    order: slider.order !== undefined ? slider.order : 1,
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
      data.append("order", form.order !== undefined && form.order !== "" ? form.order : 0);
      data.append("badges", JSON.stringify(selectedBadges));
      data.append("status", status);
      if (imageFile) data.append("image", imageFile);

      const res = await fetch(`${API}/hero-sliders/${slider._id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
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
            <p className="text-xs text-slate-400 mt-0.5">Update slider details & display options</p>
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

            {/* BADGE, BUTTON, ORDER */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div>
                <label className={labelCls}>Slider Order</label>
                <div className="relative">
                  <ArrowUpDown size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min="0"
                    placeholder="1"
                    className={`${inputCls} pl-9`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Order on home page (e.g. 1, 2, 3)</span>
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
// GLOBAL SLIDER SETTINGS MODAL
// ==========================================

const SliderSettingsModal = ({ onClose, sliders, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    imageSize: "cover",
    sliderHeight: "medium",
    textSize: "medium",
    autoplaySpeed: 5500,
  });
  const [orderedSlides, setOrderedSlides] = useState(() =>
    [...sliders].sort(
      (a, b) => (Number(a.order) || 999) - (Number(b.order) || 999)
    )
  );

  // Fetch current global settings on mount (localStorage first, then API)
  useEffect(() => {
    try {
      const local = localStorage.getItem("techx_global_slider_settings");
      if (local) {
        const parsed = JSON.parse(local);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}

    fetch(`${API}/hero-sliders/settings`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && !data.message) {
          setSettings({
            imageSize: data.imageSize || "cover",
            sliderHeight: data.sliderHeight || "medium",
            textSize: data.textSize || "medium",
            autoplaySpeed: Number(data.autoplaySpeed) || 5500,
          });
        }
      })
      .catch(() => {});
  }, []);

  const moveSlide = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedSlides.length) return;

    const list = [...orderedSlides];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Renumber orders sequentially 1, 2, 3...
    const updated = list.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    setOrderedSlides(updated);
  };

  const handleOrderChange = (id, newOrder) => {
    const val = parseInt(newOrder, 10);
    setOrderedSlides((prev) =>
      prev.map((s) => (s._id === id ? { ...s, order: isNaN(val) ? 0 : val } : s))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const reorderItems = orderedSlides.map((s, idx) => ({
        id: s._id,
        order: s.order !== undefined && s.order !== "" ? Number(s.order) : idx + 1,
      }));

      // 1. Save locally to localStorage so it works immediately in all environments
      try {
        localStorage.setItem("techx_global_slider_settings", JSON.stringify(settings));
        sessionStorage.setItem("techx_global_slider_settings", JSON.stringify(settings));
        localStorage.setItem("techx_slider_order_sequence", JSON.stringify(reorderItems));
      } catch (err) {}

      // 2. Broadcast update to any active components (storefront HeroSlider, etc.)
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("techx_slider_settings_updated", {
            detail: { settings, orderedSlides },
          })
        );
      }

      // 3. Attempt background sync with API (will persist to DB if server route is present)
      try {
        await fetch(`${API}/hero-sliders/settings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
          credentials: "include",
        });
      } catch (err) {}

      try {
        if (reorderItems.length > 0) {
          await fetch(`${API}/hero-sliders/reorder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: reorderItems }),
            credentials: "include",
          });
        }
      } catch (err) {}

      toast.success("Slider settings saved successfully");
      onSaved(orderedSlides);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Global Slider Settings</h2>
              <p className="text-xs text-slate-400">Configure sizing, typography scale, and slide order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* IMAGE FIT MODE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <label className={labelCls}>Image Fit / Scaling Mode</label>
            <p className="text-xs text-slate-400 mb-3">Controls how slide images fit within the hero viewport</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "cover",
                  label: "Cover (Fill)",
                  desc: "Fills full slider with zoom effect (Recommended)",
                },
                {
                  id: "contain",
                  label: "Contain (Full Image)",
                  desc: "Shows entire banner uncropped with ambient backdrop",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, imageSize: item.id }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.imageSize === item.id
                      ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      settings.imageSize === item.id
                        ? "text-indigo-700"
                        : "text-slate-800"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SLIDER BANNER HEIGHT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <label className={labelCls}>Slider Banner Height</label>
            <p className="text-xs text-slate-400 mb-3">Vertical height of the hero carousel across all slides</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "compact", label: "Compact", desc: "~420px height" },
                { id: "medium", label: "Standard", desc: "~550px (Default)" },
                { id: "tall", label: "Tall", desc: "~700px height" },
                { id: "fullscreen", label: "Fullscreen", desc: "~90vh view" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, sliderHeight: item.id }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.sliderHeight === item.id
                      ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      settings.sliderHeight === item.id
                        ? "text-indigo-700"
                        : "text-slate-800"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* TEXT SIZE (TYPOGRAPHY) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <label className={labelCls}>Text Size (Typography Scale)</label>
            <p className="text-xs text-slate-400 mb-3">Overall scale of slide titles, descriptions, and badges</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "small", label: "Small", desc: "Compact & Minimal text" },
                { id: "medium", label: "Medium", desc: "Standard / Balanced (Default)" },
                { id: "large", label: "Large", desc: "Bold & High-Impact text" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, textSize: item.id }))
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.textSize === item.id
                      ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      settings.textSize === item.id
                        ? "text-indigo-700"
                        : "text-slate-800"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AUTOPLAY SPEED */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <label className={labelCls}>Autoplay Interval</label>
            <p className="text-xs text-slate-400 mb-3">Duration each slide stays on screen before rotating</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 4000, label: "Fast (4s)", desc: "Quick rotation" },
                { val: 5500, label: "Standard (5.5s)", desc: "Balanced pacing" },
                { val: 7500, label: "Relaxed (7.5s)", desc: "Longer reading time" },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, autoplaySpeed: item.val }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    settings.autoplaySpeed === item.val
                      ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      settings.autoplaySpeed === item.val
                        ? "text-indigo-700"
                        : "text-slate-800"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SLIDER ORDER MANAGER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className={labelCls}>Slide Sequence & Display Order</label>
                <p className="text-xs text-slate-400">
                  Arrange slider sequence. Lower order numbers show up first on the homepage.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {orderedSlides.length} Slide{orderedSlides.length !== 1 ? "s" : ""}
              </span>
            </div>

            {orderedSlides.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No sliders created yet.</p>
            ) : (
              <div className="space-y-2 mt-3 max-h-60 overflow-y-auto pr-1">
                {orderedSlides.map((s, idx) => (
                  <div
                    key={s._id || idx}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>

                    <div className="w-12 h-9 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                      {s.image ? (
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <ImageIcon size={14} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {s.title || "Untitled Slide"}
                      </h4>
                      {s.badge && (
                        <span className="text-[10px] text-indigo-600 font-semibold truncate block">
                          {s.badge}
                        </span>
                      )}
                    </div>

                    {/* Order numeric input */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-slate-400 font-medium">Order:</span>
                      <input
                        type="number"
                        min="0"
                        value={s.order !== undefined ? s.order : idx + 1}
                        onChange={(e) => handleOrderChange(s._id, e.target.value)}
                        className="w-12 h-7 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400"
                      />
                    </div>

                    {/* Move Up / Down Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSlide(idx, "up")}
                        title="Move Up"
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors cursor-pointer text-xs"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderedSlides.length - 1}
                        onClick={() => moveSlide(idx, "down")}
                        title="Move Down"
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors cursor-pointer text-xs"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving Settings…
                </>
              ) : (
                <>
                  <Check size={14} /> Save Slider Settings
                </>
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ==========================================
  // FETCH
  // ==========================================

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/hero-sliders`, {
        credentials: "include",
      });
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

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("settings") === "true") {
        setShowSettingsModal(true);
      }
    }
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
      const res = await fetch(`${API}/hero-sliders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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
        credentials: "include",
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
  // QUICK ORDER UPDATE
  // ==========================================

  const handleOrderUpdate = async (slider, newOrder) => {
    try {
      const parsed = parseInt(newOrder, 10);
      const safeOrder = isNaN(parsed) ? 0 : parsed;
      const data = new FormData();
      data.append("order", safeOrder);
      const res = await fetch(`${API}/hero-sliders/${slider._id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setSliders((prev) => {
        const updated = prev.map((s) =>
          s._id === slider._id ? { ...s, order: safeOrder } : s
        );
        return [...updated].sort(
          (a, b) => (Number(a.order) || 999) - (Number(b.order) || 999)
        );
      });
      toast.success(`Order updated to #${safeOrder}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==========================================
  // FILTER & SORT
  // ==========================================

  const filtered = sliders
    .filter((s) => {
      const matchSearch =
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.badge?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === "all" || s.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

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
              Manage your homepage banner slides, display order, text size, and image fitting
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="h-10 px-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 text-sm font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <SlidersHorizontal size={15} className="text-indigo-500" />
              Slider Settings
            </button>
            <Link
              href="/admin/add-hero-slider"
              className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all w-fit cursor-pointer"
            >
              <Plus size={15} />
              Add New Slider
            </Link>
          </div>
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
                onUpdateOrder={handleOrderUpdate}
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
            setSliders((prev) => {
              const next = prev.map((s) => (s._id === updated._id ? updated : s));
              return [...next].sort(
                (a, b) => (Number(a.order) || 999) - (Number(b.order) || 999)
              );
            });
            setEditingSlider(null);
          }}
        />
      )}

      {/* GLOBAL SLIDER SETTINGS MODAL */}
      {showSettingsModal && (
        <SliderSettingsModal
          sliders={sliders}
          onClose={() => setShowSettingsModal(false)}
          onSaved={(updatedList) => {
            setSliders(updatedList);
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// SLIDER CARD
// ==========================================

const SliderCard = ({
  slider,
  onEdit,
  onDelete,
  onToggleStatus,
  onUpdateOrder,
  isDeleting,
}) => {
  const isActive = slider.status === "active";
  const [orderInput, setOrderInput] = useState(
    slider.order !== undefined ? slider.order : 1
  );

  useEffect(() => {
    setOrderInput(slider.order !== undefined ? slider.order : 1);
  }, [slider.order]);

  const handleOrderBlur = () => {
    const val = parseInt(orderInput, 10);
    if (!isNaN(val) && val !== slider.order) {
      onUpdateOrder(slider, val);
    }
  };

  const handleOrderKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between">

      {/* TOP SECTION */}
      <div>
        {/* IMAGE */}
        <div className="relative h-44 bg-slate-950 overflow-hidden">
          {slider.image ? (
            <img
              src={slider.image}
              alt={slider.title}
              className={`w-full h-full ${
                slider.imageSize === "contain"
                  ? "object-contain object-center"
                  : "object-cover object-center"
              } group-hover:scale-105 transition-transform duration-500`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={32} className="text-slate-300" />
            </div>
          )}

          {/* STATUS & ORDER BADGES */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-400 text-white"
              }`}
            >
              {isActive ? "ACTIVE" : "DRAFT"}
            </span>

            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-black/75 text-white backdrop-blur-md border border-white/20">
              #{slider.order !== undefined ? slider.order : 1}
            </span>
          </div>

          {/* BADGE TAG */}
          {slider.badge && (
            <div className="absolute top-3 right-3 z-10">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500 text-white shadow-xs">
                {slider.badge}
              </span>
            </div>
          )}

          {/* HOVER OVERLAY */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
            <button
              onClick={onEdit}
              className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="w-9 h-9 rounded-xl bg-white text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
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

          {/* BUTTON CTA */}
          {slider.buttonText && (
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-400">
              <MousePointerClick size={12} className="text-slate-400" />
              <span>CTA: <strong className="text-slate-700 font-semibold">{slider.buttonText}</strong></span>
            </div>
          )}

          {/* QUICK BADGES */}
          {Array.isArray(slider.badges) && slider.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
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
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
        {/* QUICK ORDER CONTROLLER */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Change display order (lower = first)">
          <ArrowUpDown size={12} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-400">Order:</span>
          <input
            type="number"
            min="0"
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            onBlur={handleOrderBlur}
            onKeyDown={handleOrderKeyDown}
            className="w-12 h-7 text-center font-bold text-slate-800 bg-white border border-slate-200 hover:border-indigo-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg text-xs transition-all outline-none shadow-2xs"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1.5">
          {/* TOGGLE STATUS */}
          <button
            onClick={onToggleStatus}
            title={isActive ? "Set to Draft" : "Set to Active"}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
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
            title="Edit slider settings"
            className="w-8 h-8 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-all cursor-pointer"
          >
            <Pencil size={13} />
          </button>

          {/* DELETE */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            title="Delete slider"
            className="w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer"
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
  );
};

export default ManageHeroSliders;