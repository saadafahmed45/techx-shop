import Providers from "@/providers/Providers";
import "./globals.css";
import WelcomePopup from "@/components/WelcomePopup";


export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
                  <WelcomePopup />

          {children}
        </Providers>
      </body>
    </html>
  );
}