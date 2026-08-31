import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

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
  if (!product) {
    return {
      title: "Product Not Found | TechX Shop",
      description: "The requested tech product could not be found at TechX Shop.",
      robots: { index: false, follow: false },
    };
  }

  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `Buy authentic ${product.title} at best price in Bangladesh from TechX Shop. Fast delivery & official warranty.`;

  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : `${SITE_URL}/techx-banner.jpg`;

  return {
    title: `${product.title} - Price in Bangladesh | TechX Shop`,
    description: cleanDescription,
    keywords: [
      product.title,
      product.category?.name,
      product.vendor,
      "TechX Shop",
      "price in bd",
      "buy online bangladesh",
      "authentic tech gear",
    ].filter(Boolean),
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title: `${product.title} | TechX Shop`,
      description: cleanDescription,
      url: `${SITE_URL}/product/${id}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | TechX Shop`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images : [`${SITE_URL}/techx-banner.jpg`],
    description: product.description
      ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 300)
      : `Buy ${product.title} at TechX Shop`,
    sku: product._id,
    mpn: product._id,
    brand: {
      "@type": "Brand",
      name: product.vendor || product.brand || "TechX",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${id}`,
      priceCurrency: "BDT",
      price: product.price || 0,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        (product.stock ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "TechX Shop",
      },
    },
    ...(product.rating?.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.average || 5,
        reviewCount: product.rating.count || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_URL}/product`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${SITE_URL}/product/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
