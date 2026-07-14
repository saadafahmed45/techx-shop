import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  isCartOpen: false,

  hydrate: () => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) set({ cart: JSON.parse(stored) });
    } catch {}
  },

  persist: () => {
    try {
      localStorage.setItem("cart", JSON.stringify(get().cart));
    } catch {}
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  addToCart: (product) => {
    set((state) => {
      const exist = state.cart.find((i) => i._id === product._id);
      const next = exist
        ? state.cart.map((i) =>
            i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.cart, { ...product, quantity: 1 }];
      return { cart: next, isCartOpen: true };
    });
    get().persist();
  },

  increaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
    get().persist();
  },

  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      ),
    }));
    get().persist();
  },

  removeItem: (id) => {
    set((state) => ({
      cart: state.cart.filter((i) => i._id !== id),
    }));
    get().persist();
  },

  clearCart: () => {
    set({ cart: [] });
    get().persist();
  },
}));

export { useCartStore };
export default useCartStore;
