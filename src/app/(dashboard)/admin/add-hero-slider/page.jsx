"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Loader2,
  ImageIcon,
  Plus,
  Layers3,
  Tag,
  AlignLeft,
  Type,
  MousePointerClick,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// =========================================
// BADGE OPTIONS
// =========================================

const BADGE_OPTIONS = [
  "New Arrival",
  "Best Seller",
  "Limited Edition",
  "Hot Deal",
  "Exclusive",
  "Trending",
  "Sale",
];

const AddHeroSlider = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [status, setStatus] = useState("active");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    buttonText: "SHOP NOW",
  });

  // =========================================
  // HANDLERS
  // =========================================

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview("");
  };

  const toggleBadge = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Please select an image");
    if (!formData.title) return toast.error("Please enter a title");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("badge", formData.badge);
      data.append("buttonText", formData.buttonText);
      data.append("badges", JSON.stringify(selectedBadges));
      data.append("status", status);
      data.append("image", image);

      const res = await fetch(`${API}/hero-sliders`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Slider added successfully");

      // RESET
      setFormData({
        title: "",
        description: "",
        badge: "",
        buttonText: "SHOP NOW",
      });
      setImage(null);
      setPreview("");
      setSelectedBadges([]);
      setStatus("active");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // STYLES
  // =========================================

  const inputCls =
    "w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

  const labelCls =
    "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-10 pb-28">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-7">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Add Hero Slider
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create a new homepage banner slide
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ==================== LEFT ==================== */}
            <div className="lg:col-span-3 space-y-5">

              {/* IMAGE UPLOAD CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <ImageIcon size={15} className="text-indigo-500" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Slider Image</h2>
                  <span className="ml-auto text-[11px] text-slate-400 font-medium">
                    PNG, JPG, WEBP
                  </span>
                </div>

                {!preview ? (
                  <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                      <Upload size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                      Drop file or <span className="text-indigo-500">browse</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Upload banner image (recommended: 1920×600)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 h-56">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="w-10 h-10 rounded-xl bg-white text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-50 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-indigo-500 text-white px-2 py-1 rounded-md">
                      BANNER
                    </span>
                  </div>
                )}
              </div>

              {/* SLIDER INFO CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Layers3 size={15} className="text-indigo-500" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Slider Info</h2>
                </div>

                <div className="space-y-4">

                  {/* TITLE */}
                  <div>
                    <label className={labelCls}>
                      Title <span className="text-rose-400 normal-case">*</span>
                    </label>
                    <div className="relative">
                      <Type size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Summer Collection 2025"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  {/* BADGE (manual text) */}
                  <div>
                    <label className={labelCls}>Badge Text</label>
                    <div className="relative">
                      <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="badge"
                        value={formData.badge}
                        onChange={handleChange}
                        placeholder="e.g. New Arrival"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  {/* BUTTON TEXT */}
                  <div>
                    <label className={labelCls}>Button Text</label>
                    <div className="relative">
                      <MousePointerClick size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleChange}
                        placeholder="SHOP NOW"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Short promotional text for the slider…"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                    />
                  </div>

                  {/* BADGE TAGS (quick select) */}
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
                            className={`h-10 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                              selected
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            <Sparkles size={14} />
                            {badge}
                          </button>
                        );
                      })}
                    </div>

                    {selectedBadges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedBadges.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== RIGHT ==================== */}
            <div className="space-y-5">

              {/* STATUS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Status
                </h2>
                <div className="space-y-2.5">
                  {["active", "draft"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStatus(item)}
                      className={`w-full h-11 rounded-xl border text-sm font-semibold capitalize transition-all ${
                        status === item
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                          : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUMMARY */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Summary
                </h2>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Title", value: formData.title || "—", cls: "truncate max-w-[120px] text-right" },
                    { label: "Badge", value: formData.badge || "—" },
                    { label: "Button", value: formData.buttonText || "—" },
                    { label: "Quick Tags", value: selectedBadges.length },
                    { label: "Image", value: image ? "1 file" : "None" },
                    { label: "Status", value: status, cls: "capitalize" },
                  ].map(({ label, value, cls }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-slate-400">{label}</span>
                      <span className={`font-semibold text-white ${cls || ""}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIPS CARD */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
                  Tips
                </h2>
                <ul className="space-y-2 text-xs text-indigo-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-indigo-400">•</span>
                    Recommended image size: <strong>1920×600px</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-indigo-400">•</span>
                    Keep title under <strong>60 characters</strong> for best display
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-indigo-400">•</span>
                    Use a short, punchy <strong>button text</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FIXED FOOTER */}
          <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm border-t border-slate-200 p-4 flex items-center justify-between z-50">
            <p className="text-sm text-slate-400 hidden sm:block">
              {image ? "1 image selected" : "No image selected"}
              {" · "}
              {selectedBadges.length} badge tag{selectedBadges.length !== 1 ? "s" : ""}
            </p>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Publish Slider
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHeroSlider;