"use client";

import { CartProvider } from "@/context/CartContext";
import { ShopDataProvider } from "@/context/ShopDataContext";
import QueryProvider from "./QueryProvider";

export default function Providers({ children }) {
  return (
    <QueryProvider>
      <ShopDataProvider>
        <CartProvider>{children}</CartProvider>
      </ShopDataProvider>
    </QueryProvider>
  );
}
