import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "TechX Shop | Best Electronics & Gadgets in Bangladesh",
    template: "%s | TechX Shop",
  },

  description:
    "Shop the latest electronics, gaming accessories, headphones, speakers, PC components, laptops, and gadgets at TechX Shop. Fast delivery across Bangladesh.",
 icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "TechX Shop",
    "Electronics Bangladesh",
    "Gaming Accessories",
    "PC Components",
    "Headphones",
    "Speakers",
    "Computer Shop",
    "Tech Gadgets",
    "Laptop Accessories",
    "Online Electronics Store",
    "Bangladesh Tech Store",
  ],

  authors: [
    {
      name: "TechX Shop",
    },
  ],

  creator: "TechX Shop",
  publisher: "TechX Shop",

  metadataBase: new URL("https://techx-shop.vercel.app"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "TechX Shop | Best Electronics & Gadgets in Bangladesh",
    description:
      "Explore premium electronics, PC components, gaming accessories, speakers, headphones, and more at TechX Shop.",
    url: "https://techx-shop.vercel.app",
    siteName: "TechX Shop",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/techx-banner.jpg",
        width: 1200,
        height: 630,
        alt: "TechX Shop",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TechX Shop | Best Electronics & Gadgets in Bangladesh",
    description:
      "Shop the latest electronics, gaming accessories, headphones, speakers, and PC components.",
    images: ["/techx-banner.jpg"],
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "OnlineStore",
                  name: "TechX Shop",
                  url: "https://techx-shop.vercel.app",
                  description:
                    "Online electronics and gadget store in Bangladesh.",
                }),
              }}
            />
        <Navbar/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
