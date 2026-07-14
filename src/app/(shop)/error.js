"use client";

export default function ShopError({ error, reset }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-2xl">!</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
      <p className="text-sm text-gray-400 text-center max-w-md">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
