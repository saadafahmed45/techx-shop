"use client";

import React, { useState, useEffect } from "react";
import { Upload, Loader2, ImageIcon, Plus } from "lucide-react";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddHeroSlider = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    buttonText: "SHOP NOW",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Please select image");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("badge", formData.badge);
      data.append("buttonText", formData.buttonText);
      data.append("image", image);

      const res = await fetch(`${API}/hero-sliders`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success("Slider added successfully");

      setFormData({
        title: "",
        description: "",
        badge: "",
        buttonText: "SHOP NOW",
      });

      setImage(null);
      setPreview("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] py-12">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Hero Slider
          </h1>
          <p className="text-sm text-gray-500">
            Create homepage banner slider content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-5">

            {/* IMAGE UPLOAD CARD */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Slider Image
              </h2>

              <label className="block">
                <div className="h-72 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50 hover:border-black transition cursor-pointer">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="mx-auto mb-2" />
                      <p className="text-sm">Upload banner image</p>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-5">

              {/* TITLE */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mt-2 h-12 rounded-2xl border border-gray-200 px-4 focus:border-black outline-none"
                />
              </div>

              {/* BADGE */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Badge
                </label>
                <input
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full mt-2 h-12 rounded-2xl border border-gray-200 px-4 focus:border-black outline-none"
                />
              </div>

              {/* BUTTON */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Button Text
                </label>
                <input
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className="w-full mt-2 h-12 rounded-2xl border border-gray-200 px-4 focus:border-black outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full mt-2 rounded-2xl border border-gray-200 px-4 py-3 focus:border-black outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (SUMMARY CARD like product page) */}
          <div className="space-y-5">

            <div className="bg-black text-white rounded-3xl p-6">
              <h3 className="text-sm font-semibold mb-4">
                Slider Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Title</span>
                  <span className="truncate max-w-30">
                    {formData.title || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Badge</span>
                  <span>{formData.badge || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Button</span>
                  <span>{formData.buttonText}</span>
                </div>

                <div className="flex justify-between">
                  <span>Image</span>
                  <span>{image ? "1 file" : "0"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FIXED BOTTOM BUTTON (like product page) */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-end z-50">
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-2xl bg-black text-white font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Publish Slider
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddHeroSlider;