import Providers from "@/providers/Providers";
import "./globals.css";
import ClientPopups from "@/components/ClientPopups";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f0f",
};

export const metadata = {
  manifest: "/manifest.json",
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <Providers>
          <ClientPopups />
          {children}
        </Providers>
      </body>
    </html>
  );
}