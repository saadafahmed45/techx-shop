export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1312141660965533";

/**
 * Standard PageView event
 */
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

/**
 * Custom / Generic Event
 */
export const event = (name, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

/**
 * ViewContent: Triggered when viewing a product detail page
 */
export const trackViewContent = (product) => {
  if (!product) return;
  event("ViewContent", {
    content_name: product.title || product.name || "Product",
    content_category:
      product.category?.name || product.category || "Electronics",
    content_ids: [product._id || product.id || String(product.slug || "")],
    content_type: "product",
    value: Number(product.price) || 0,
    currency: "BDT",
  });
};

/**
 * AddToCart: Triggered when an item is added to the cart
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  event("AddToCart", {
    content_name: product.title || product.name || "Product",
    content_category:
      product.category?.name || product.category || "Electronics",
    content_ids: [product._id || product.id || String(product.slug || "")],
    content_type: "product",
    value: (Number(product.price) || 0) * (Number(quantity) || 1),
    currency: "BDT",
  });
};

/**
 * InitiateCheckout: Triggered when entering checkout flow
 */
export const trackInitiateCheckout = ({
  value = 0,
  numItems = 0,
  contentIds = [],
} = {}) => {
  event("InitiateCheckout", {
    content_ids: contentIds,
    content_type: "product",
    num_items: Number(numItems) || 1,
    value: Number(value) || 0,
    currency: "BDT",
  });
};

/**
 * Purchase: Triggered upon successful order completion
 */
export const trackPurchase = ({
  orderId,
  value = 0,
  numItems = 0,
  currency = "BDT",
} = {}) => {
  event("Purchase", {
    content_type: "product",
    currency: currency,
    value: Number(value) || 0,
    num_items: Number(numItems) || 1,
    order_id: String(orderId || ""),
  });
};

/**
 * Search: Triggered when a search is performed
 */
export const trackSearch = (searchQuery) => {
  if (!searchQuery) return;
  event("Search", {
    search_string: searchQuery,
  });
};
