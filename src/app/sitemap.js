export const revalidate = 3600; // revalidate at most every hour

const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export default async function sitemap() {
  const currentDate = new Date().toISOString();

  // Static routes
  const routes = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/product`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/track-order`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Product routes from backend API
  let productEntries = [];
  try {
    const res = await fetch(`${API}/products`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];

      productEntries = products.map((product) => ({
        url: `${SITE_URL}/product/${product._id}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt).toISOString() : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  return [...routes, ...productEntries];
}
