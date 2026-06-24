"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // ============================
  // CART STATE
  // ============================

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // LOAD cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // SAVE cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((p) => !p);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i._id === product._id);
      if (exist) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const clearCart = () => setCart([]);

  // ============================
  // AUTH STATE
  // ============================

  const [user, setUser] = useState(null);       // logged in user object
  const [authLoading, setAuthLoading] = useState(true); // JWT init loading
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  // Check user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
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
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        // Not logged in or expired token — silent fail
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setAuthLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Email/Password Login
  const handleLogin = async (email, password) => {
    try {
      setAuthLoading(true);
      setAuthError("");
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
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Invalid email or password";
      setAuthError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  // Register
  const handleRegister = async (name, email, password, photoURL) => {
    try {
      setAuthLoading(true);
      setAuthError("");
      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
        photoURL,
      });
      if (response.data?.success) {
        return { success: true };
      }
      return { success: false, error: "Registration failed" };
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setAuthError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await api.post("/api/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Login (Hybrid)
  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");
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
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        if (userData.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        return { success: true };
      }
      return { success: false, error: "Google verification failed" };
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Google login failed. Please try again.";
      setAuthError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  // ============================
  // CONTEXT VALUE
  // ============================

  return (
    <CartContext.Provider
      value={{
        // Cart
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

        // Auth
        user,
        authLoading,
        authError,
        handleLogin,
        handleRegister,
        handleGoogleLogin,
        handleLogout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);