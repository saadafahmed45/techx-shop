// app/products/page.jsx
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";

async function getProducts() {
  const res = await fetch("https://api.escuelajs.co/api/v1/products?limit=15", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ProductPage() {
  const products = await getProducts();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <main
        className="min-h-screen"
        style={{ background: "#f7f8fc", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Header ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)" }}
        >
          {/* Decorative dots */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(58,90,255,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-10">
            {/* Breadcrumb */}
                       <Breadcrumb/>
           
            <h1
              className="text-[30px] md:text-[36px] font-extrabold leading-tight text-gray-900 mb-3"
             
            >
              All Products
            </h1>
            <p className="text-[15px] text-gray-500 max-w-md">
              Discover our curated collection — {products.length} items ready for you.
            </p>

            {/* Accent line */}
            <div
              className="mt-6 h-[3px] w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #3a5aff, #7a9fff)" }}
            />
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}