const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white p-4 rounded-xl shadow">
      
      <div className="w-full h-48 bg-gray-200 rounded"></div>

      <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>

    </div>
  );
};

export default SkeletonCard;