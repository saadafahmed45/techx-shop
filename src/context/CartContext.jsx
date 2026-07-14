"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.authLoading);
  const authError = useAuthStore((s) => s.authError);
  const checkSession = useAuthStore((s) => s.checkSession);

  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    useCartStore.getState().hydrate?.();
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart,
        isCartOpen, openCart, closeCart, toggleCart,
        user, authLoading, authError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
