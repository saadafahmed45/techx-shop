export default function ProductLoading() {
  return (
    <div className="bg-[#fafafc] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-neutral-200/70 rounded animate-pulse" />
          <div className="h-4 w-4 bg-neutral-200/50 rounded animate-pulse" />
          <div className="h-4 w-16 bg-neutral-200/70 rounded animate-pulse" />
          <div className="h-4 w-4 bg-neutral-200/50 rounded animate-pulse" />
          <div className="h-4 w-36 bg-neutral-200/70 rounded animate-pulse" />
        </div>

        {/* 2-Column Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-3xl bg-neutral-200/60 animate-pulse border border-neutral-200/80" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-18 h-18 rounded-2xl bg-neutral-200/60 animate-pulse border border-neutral-200"
                />
              ))}
            </div>
          </div>

          {/* Right: Info skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-28 bg-neutral-200/70 rounded-lg animate-pulse" />
                <div className="h-6 w-20 bg-neutral-200/50 rounded-lg animate-pulse" />
                <div className="h-6 w-24 bg-neutral-200/60 rounded-lg animate-pulse ml-auto" />
              </div>
              <div className="h-9 w-4/5 bg-neutral-200/80 rounded-xl animate-pulse" />
              <div className="h-5 w-44 bg-neutral-200/50 rounded animate-pulse" />
            </div>

            {/* Price Box Skeleton */}
            <div className="h-24 bg-white rounded-2xl border border-neutral-200/80 animate-pulse p-4" />

            {/* Description Card Skeleton */}
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 space-y-2">
              <div className="h-4 w-28 bg-neutral-200/60 rounded animate-pulse" />
              <div className="h-3 w-full bg-neutral-200/50 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-neutral-200/50 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-neutral-200/50 rounded animate-pulse" />
            </div>

            {/* Actions Skeleton */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-28 h-12 bg-white rounded-xl border border-neutral-200 animate-pulse" />
                <div className="flex-1 h-12 bg-blue-600/30 rounded-xl animate-pulse" />
              </div>
              <div className="h-12 bg-neutral-900/20 rounded-xl animate-pulse" />
            </div>

            {/* 4 Cards Skeleton */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white border border-neutral-200/80 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
