"use client";

import { CartProvider } from "@/context/CartContext";
import { ShopDataProvider } from "@/context/ShopDataContext";
import QueryProvider from "./QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  return (
    <QueryProvider>
      <ShopDataProvider>
        <CartProvider>
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </CartProvider>
      </ShopDataProvider>
    </QueryProvider>
  );
}
