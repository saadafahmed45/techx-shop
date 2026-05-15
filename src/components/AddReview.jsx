"use client";

import { Rating } from "@smastrom/react-rating";
import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { toast } from "react-toastify";
import "@smastrom/react-rating/style.css";

const API =
  process.env.NEXT_PUBLIC_API_URL;

const AddReview = ({
  productId,
}) => {

     const [customerName, setCustomerName] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");



  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/products/${productId}/rating`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customerName,
            rating,
            comment,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      toast.success(
        "Review Added"
      );

      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >


        
      {/* CUSTOMER NAME */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Your Name
        </label>

        <input
          type="text"
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          className="w-full border rounded-2xl p-4"
        />
      </div>
    {/* RATING */}
<div>
  <label className="block mb-2 text-sm font-medium">
    Rating
  </label>

   <div className="border border-gray-200 rounded-2xl px-4 h-12 flex items-center">
    <Rating
      style={{
        maxWidth: 140,
      }}
      value={rating}
      onChange={setRating}
    />
  </div>
</div>

      {/* COMMENT */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Comment
        </label>

        <textarea
          rows={4}
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          className="w-full border rounded-2xl p-4 resize-none"
        />
      </div>


      <button
        type="submit"
        disabled={loading}
        className="h-12 px-5 bg-black text-white rounded-2xl"
      >
        {loading
          ? "Submitting..."
          : "Submit Review"}
      </button>
    </form>
  );
};

export default AddReview;