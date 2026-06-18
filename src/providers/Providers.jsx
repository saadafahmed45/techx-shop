"use client";

import { CartProvider } from "@/context/CartContext";
import { ShopDataProvider } from "@/context/ShopDataContext";

export default function Providers({
  children,
}) {
  return (
    <ShopDataProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ShopDataProvider>
  );
}