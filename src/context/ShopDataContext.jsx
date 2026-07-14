"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ShopDataContext = createContext(null);

const CACHE_KEY_PRODUCTS = "shopdata_products";
const CACHE_KEY_COLLECTIONS = "shopdata_collections";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({ data, expiresAt: Date.now() + CACHE_TTL_MS })
    );
  } catch {
    // sessionStorage quota exceeded — silently ignore
  }
};

export const ShopDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false); // false by default — don't block every section

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchData = async (force = false) => {
    // If cache is still valid and not forced, skip the fetch entirely
    const cachedProducts = readCache(CACHE_KEY_PRODUCTS);
    const cachedCollections = readCache(CACHE_KEY_COLLECTIONS);

    if (!force && cachedProducts && cachedCollections) {
      setProducts(cachedProducts);
      setCollections(cachedCollections);
      return;
    }

    try {
      setLoading(true);
      const [productRes, collectionRes] = await Promise.all([
        fetch(`${API}/products?limit=200`, { signal: AbortSignal.timeout(15000) }),
        fetch(`${API}/collections`, { signal: AbortSignal.timeout(15000) }),
      ]);

      if (!productRes.ok) throw new Error(`Products API responded with ${productRes.status}`);
      if (!collectionRes.ok) throw new Error(`Collections API responded with ${collectionRes.status}`);

      const productJson = await productRes.json();
      const collectionData = await collectionRes.json();

      const products = Array.isArray(productJson) ? productJson : (productJson?.data || []);
      const collections = Array.isArray(collectionData) ? collectionData : (collectionData?.data || []);

      setProducts(products);
      setCollections(collections);
      writeCache(CACHE_KEY_PRODUCTS, products);
      writeCache(CACHE_KEY_COLLECTIONS, collections);
    } catch (error) {
      console.error("❌ Failed to fetch shop data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hydration-safe initial load from cache
    const cachedProducts = readCache(CACHE_KEY_PRODUCTS);
    const cachedCollections = readCache(CACHE_KEY_COLLECTIONS);
    if (cachedProducts && cachedCollections) {
      setProducts(cachedProducts);
      setCollections(cachedCollections);
    }
    fetchData();
  }, []);

  return (
    <ShopDataContext.Provider
      value={{
        products,
        collections,
        loading,
        refreshData: () => fetchData(true), // force refresh (e.g. after admin adds a product)
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};

export const useShopData = () => {
  const context = useContext(ShopDataContext);
  if (!context) {
    throw new Error("useShopData must be used within a ShopDataProvider");
  }
  return context;
};
