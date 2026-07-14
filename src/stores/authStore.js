import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  authLoading: true,
  authError: "",

  checkSession: async () => {
    try {
      const response = await api.get("/api/auth/me");
      if (response.data?.success && response.data?.user) {
        const userData = {
          uid: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          photo: response.data.user.photoURL,
          role: response.data.user.role,
          status: response.data.user.status,
        };
        set({ user: userData, authLoading: false });
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        set({ user: null, authLoading: false });
        localStorage.removeItem("user");
      }
    } catch {
      set({ user: null, authLoading: false });
      localStorage.removeItem("user");
    }
  },

  setUser: (userData) => {
    set({ user: userData });
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  },

  setAuthLoading: (authLoading) => set({ authLoading }),
  setAuthError: (authError) => set({ authError }),

  handleLogin: async (email, password) => {
    try {
      set({ authLoading: true, authError: "" });
      const response = await api.post("/api/auth/login", { email, password });
      if (response.data?.success && response.data?.user) {
        const userData = {
          uid: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          photo: response.data.user.photoURL,
          role: response.data.user.role,
          status: response.data.user.status,
        };
        set({ user: userData, authLoading: false });
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, role: userData.role };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Invalid email or password";
      set({ authError: errMsg, authLoading: false });
      return { success: false, error: errMsg };
    }
  },

  handleRegister: async (name, email, password, photoURL) => {
    try {
      set({ authLoading: true, authError: "" });
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        photoURL,
      });
      if (response.data?.success) {
        set({ authLoading: false });
        return { success: true };
      }
      return { success: false, error: "Registration failed" };
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      set({ authError: errMsg, authLoading: false });
      return { success: false, error: errMsg };
    }
  },

  handleLogout: async () => {
    try {
      set({ authLoading: true });
      await api.post("/api/auth/logout");
      set({ user: null, authLoading: false });
      localStorage.removeItem("user");
    } catch {
      set({ authLoading: false });
    }
  },

  handleGoogleLogin: async () => {
    try {
      set({ authLoading: true, authError: "" });
      const { signInWithPopup } = await import("firebase/auth");
      const { auth, googleProvider } = await import("@/lib/firebase");
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const response = await api.post("/api/auth/google-login", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });

      if (response.data?.success && response.data?.user) {
        const userData = {
          uid: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          photo: response.data.user.photoURL,
          role: response.data.user.role,
          status: response.data.user.status,
        };
        set({ user: userData, authLoading: false });
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, role: userData.role };
      }
      return { success: false, error: "Google verification failed" };
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Google login failed. Please try again.";
      set({ authError: errMsg, authLoading: false });
      return { success: false, error: errMsg };
    }
  },
}));

export { useAuthStore };
export default useAuthStore;
