import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/announcementBar";
import ClientOnlyWidgets from "@/components/ClientOnlyWidgets";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TechX Shop | Best Electronics, PC Gear & Gadgets in Bangladesh",
    template: "%s | TechX Shop",
  },
  description:
    "TechX Shop is Bangladesh's premier online electronics and tech store. Discover the latest gaming gear, mechanical keyboards, headphones, PC components, laptops, smartwatches, and premium gadgets with nationwide fast delivery and authentic warranty.",
  applicationName: "TechX Shop",
  authors: [{ name: "TechX Shop", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    // Primary Brand Keywords
    "TechX Shop",
    "TechX",
    "Tech X Shop",
    "TechX Store",
    "TechX Bangladesh",
    "techx-shop",
    "techx shop bd",
    // Core Category Keywords
    "Electronics Bangladesh",
    "Tech Shop in Bangladesh",
    "Online Electronics Store BD",
    "Buy Gadgets Online BD",
    "Gaming Accessories Bangladesh",
    "Mechanical Keyboards BD",
    "Gaming Mouse and Headsets",
    "PC Components Dhaka",
    "Laptops and Accessories",
    "Smartwatches Bangladesh",
    "Wireless Earbuds BD",
    "Bluetooth Speakers",
    "Computer Shop Bangladesh",
    "Authentic Tech Store BD",
    "Cash on Delivery Electronics BD",
  ],
  creator: "TechX Shop",
  publisher: "TechX Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "./",
    languages: {
      "en-US": "/en",
      "bn-BD": "/bn",
    },
  },
  openGraph: {
    title: "TechX Shop | Best Electronics, PC Gear & Gadgets in Bangladesh",
    description:
      "Shop authentic electronics, gaming gear, headphones, smartwatches, PC accessories, and premium gadgets at TechX Shop. Fast nationwide delivery & official warranty.",
    url: SITE_URL,
    siteName: "TechX Shop",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/techx-banner.jpg",
        width: 1200,
        height: 630,
        alt: "TechX Shop - Best Electronics & Gadgets in Bangladesh",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechX Shop | Best Electronics & Gadgets in Bangladesh",
    description:
      "Discover authentic electronics, gaming accessories, smartwatches, headphones, and PC gear with fast delivery at TechX Shop.",
    images: ["/techx-banner.jpg"],
    creator: "@TechXShop",
    site: "@TechXShop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function ShopLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "TechX Shop",
        description: "Best Electronics, PC Components & Gadgets in Bangladesh",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "TechX Shop",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/apple-touch-icon.png`,
          width: 180,
          height: 180,
        },
        sameAs: [
          "https://facebook.com/techxshop",
          "https://instagram.com/techxshop",
          "https://twitter.com/techxshop",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          areaServed: "BD",
          availableLanguage: ["English", "Bengali"],
        },
      },
      {
        "@type": "OnlineStore",
        "@id": `${SITE_URL}/#store`,
        name: "TechX Shop",
        url: SITE_URL,
        image: `${SITE_URL}/techx-banner.jpg`,
        description:
          "TechX Shop is a trusted online retailer offering authentic computer accessories, smart devices, audio gear, and gaming peripherals in Bangladesh.",
        priceRange: "$$",
        currenciesAccepted: "BDT, USD",
        paymentAccepted: "Cash on Delivery, bKash, Nagad, Credit Card, Debit Card",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BD",
        },
      },
    ],
  };

  return (
    <div
      className={`${inter.variable} min-h-full flex flex-col`}
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AnnouncementBar />
      <Navbar />
      <ClientOnlyWidgets />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
