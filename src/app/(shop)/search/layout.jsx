const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export const metadata = {
  title: "Search Products & Tech Gadgets | TechX Shop",
  description:
    "Find your favorite electronics, PC components, mechanical keyboards, gaming mice, and smart gadgets with instant search at TechX Shop Bangladesh.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Search Products & Tech Gadgets | TechX Shop",
    description: "Search across all tech gear, gadgets, and PC components at TechX Shop Bangladesh.",
    url: `${SITE_URL}/search`,
    type: "website",
  },
};

export default function SearchLayout({ children }) {
  return children;
}
