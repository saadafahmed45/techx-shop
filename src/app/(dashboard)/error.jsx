"use client";

export default function DashboardError({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-xl font-bold text-gray-900">Dashboard Error</h2>
      <p className="text-sm text-gray-400 text-center max-w-md">
        {error?.message || "Something went wrong loading the dashboard."}
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
