export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-11 h-11 rounded-full border-4 border-stone-200 border-t-stone-700 animate-spin" />
        <p className="text-stone-400 text-sm font-medium tracking-wide">
          Loading product…
        </p>
      </div>
    </div>
  );
}
