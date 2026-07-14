export default function ProductListingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f8fc" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading products…</p>
      </div>
    </div>
  );
}
