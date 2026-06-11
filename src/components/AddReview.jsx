"use client";

import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ============================
// STAR PICKER
// ============================

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

// ============================
// MAIN COMPONENT
// ============================

const AddReview = ({ productId }) => {
  const { user } = useCart();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Not logged in ──────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-2xl">
          🔒
        </div>
        <div>
          <p className="font-semibold text-stone-900">Login to write a review</p>
          <p className="text-sm text-stone-400 mt-1">
            Share your experience with other shoppers
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="h-11 px-8 bg-stone-900 hover:bg-stone-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  // ── Submit ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/products/${productId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: user.name,  // logged in user এর name
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Review submitted — thank you!");
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Logged in ───────────────────────────────────
  return (
    <div>
      <h3 className="text-base font-bold text-stone-900 mb-5">
        Share Your Experience
      </h3>

      {/* USER BADGE */}
      <div className="flex items-center gap-3 mb-5 p-3 bg-stone-50 border border-stone-200 rounded-xl">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-indigo-100 shrink-0">
          {user.photo ? (
            <Image src={user.photo} alt={user.name} fill className="object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-sm">
              {user.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">{user.name}</p>
          <p className="text-xs text-stone-400">Reviewing as this account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* RATING */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Rating
          </label>
          <div className="h-11 border border-stone-200 rounded-xl px-3 flex items-center bg-white">
            <StarPicker value={rating} onChange={setRating} />
          </div>
        </div>

        {/* COMMENT */}
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