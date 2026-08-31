import ProductCatalogClient from "./ProductCatalogClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export const metadata = {
  title: "All Products & Tech Gadgets | TechX Shop Bangladesh",
  description:
    "Explore TechX Shop's complete catalog of premium electronics, mechanical keyboards, gaming mice, audio gear, PC components, and accessories. Best prices and official warranty in Bangladesh.",
  keywords: [
    "TechX shop all products",
    "buy electronics bangladesh",
    "gaming gear bd",
    "mechanical keyboards dhaka",
    "pc components online",
    "smart gadgets bangladesh",
  ],
  alternates: {
    canonical: "/product",
  },
  openGraph: {
    title: "All Products & Tech Gadgets | TechX Shop",
    description:
      "Browse and filter hundreds of tech gadgets, PC hardware, audio devices, and gaming accessories with fast delivery across Bangladesh.",
    url: `${SITE_URL}/product`,
    type: "website",
  },
};

export default function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "TechX Shop Product Catalog",
    description:
      "All tech products, electronics, gaming hardware, and gadgets available at TechX Shop Bangladesh.",
    url: `${SITE_URL}/product`,
    breadcrumb: {
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
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductCatalogClient />
    </>
  );
}