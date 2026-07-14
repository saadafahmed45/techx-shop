import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getProduct(id) {
  try {
    const res = await fetch(`${API}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found | TechX Shop" };

  return {
    title: `${product.title} | TechX Shop`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${product.title} at TechX Shop. Best price in Bangladesh.`,
    openGraph: {
      title: `${product.title} | TechX Shop`,
      description: product.description?.slice(0, 160),
      images: Array.isArray(product.images) ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
