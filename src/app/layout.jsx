    import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}