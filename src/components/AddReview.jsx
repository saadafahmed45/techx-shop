"use client";

import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${s} star`}
        >
          <AiFillStar
            className={`text-2xl transition-colors ${
              s <= (hovered || value) ? "text-amber-400" : "text-stone-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const AddReview = ({ productId }) => {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/products/${productId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Review submitted — thank you!");
      setCustomerName("");
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-base font-bold text-stone-900 mb-5">Share Your Experience</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Your Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Sarah M."
              className="h-11 border border-stone-200 rounded-xl px-4 text-sm text-stone-900 placeholder:text-stone-300 outline-none focus:border-stone-500 transition-colors bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Rating
            </label>
            <div className="h-11 border border-stone-200 rounded-xl px-3 flex items-center bg-white">
              <StarPicker value={rating} onChange={setRating} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Comment
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others what you think…"
            className="border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 outline-none focus:border-stone-500 transition-colors resize-none bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-11 px-8 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddReview;