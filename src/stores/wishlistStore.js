import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  items: [],
  
  hydrate: () => {
    try {
      const stored = localStorage.getItem("techx_wishlist");
      if (stored) {
        set({ items: JSON.parse(stored) });
      }
    } catch {}
  },

  toggleWishlist: (product) => {
    if (!product) return;
    const current = get().items;
    const exists = current.some((item) => item._id === product._id);
    let updated;
    if (exists) {
      updated = current.filter((item) => item._id !== product._id);
    } else {
      updated = [...current, product];
    }
    set({ items: updated });
    try {
      localStorage.setItem("techx_wishlist", JSON.stringify(updated));
    } catch {}
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item._id === productId);
  },

  removeItem: (productId) => {
    const updated = get().items.filter((item) => item._id !== productId);
    set({ items: updated });
    try {
      localStorage.setItem("techx_wishlist", JSON.stringify(updated));
    } catch {}
  },

  clearWishlist: () => {
    set({ items: [] });
    try {
      localStorage.removeItem("techx_wishlist");
    } catch {}
  },
}));
