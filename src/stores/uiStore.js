import { create } from "zustand";

const useUIStore = create((set) => ({
  searchQuery: "",
  mobileFilterOpen: false,
  mobileNavOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMobileFilterOpen: (mobileFilterOpen) => set({ mobileFilterOpen }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));

export { useUIStore };
export default useUIStore;
