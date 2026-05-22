"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // LOAD
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // OPEN / CLOSE
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((p) => !p);

  // ADD
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i._id === product._id);

      if (exist) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true); // 🔥 auto open drawer
    console.log("Added to cart:", cart);
  };

  // INCREASE
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // DECREASE
 const decreaseQuantity = (id) => {
  setCart((prev) =>
    prev.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item
    )
  );
};
  // REMOVE
  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);