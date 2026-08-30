export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <div className="aspect-square bg-neutral-100 rounded-2xl animate-pulse" />
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 rounded-xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-5">
            <div className="h-4 w-28 bg-neutral-100 rounded animate-pulse" />
            <div className="h-10 w-4/5 bg-neutral-100 rounded animate-pulse" />
            <div className="h-4 w-40 bg-neutral-100 rounded animate-pulse" />
            <div className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
            <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
            <div className="flex gap-3 pt-4">
              <div className="flex-1 h-11 bg-neutral-100 rounded-lg animate-pulse" />
              <div className="flex-1 h-11 bg-neutral-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
