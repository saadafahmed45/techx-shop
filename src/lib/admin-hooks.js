import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...options,
  });
  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

function extractList(data) {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => fetchJSON(`${API}/products?limit=200`),
    select: extractList,
    staleTime: 60_000,
  });
}

export function useAdminCollections() {
  return useQuery({
    queryKey: ["admin", "collections"],
    queryFn: () => fetchJSON(`${API}/collections?limit=200`),
    select: extractList,
    staleTime: 60_000,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => fetchJSON(`${API}/orders?limit=200`),
    select: extractList,
    staleTime: 60_000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchJSON(`${API}/api/users?limit=1000`, { credentials: "include" }),
    select: (data) => (data?.success && Array.isArray(data.data) ? data.data : []),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${API}/products/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${API}/collections/${id}`, { method: "DELETE" }),
    // Optimistic update — remove instantly before server responds
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "collections"] });
      const previous = queryClient.getQueryData(["admin", "collections"]);
      queryClient.setQueryData(["admin", "collections"], (old) => {
        if (!old) return old;
        // Handle both raw array and paginated {data:[]} shapes
        if (Array.isArray(old)) return old.filter((c) => c._id !== id);
        if (Array.isArray(old?.data))
          return { ...old, data: old.data.filter((c) => c._id !== id) };
        return old;
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      // Roll back on error
      if (context?.previous)
        queryClient.setQueryData(["admin", "collections"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "collections"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) =>
      fetchJSON(`${API}/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "orders"] });
      const previousOrders = queryClient.getQueryData(["admin", "orders"]);
      queryClient.setQueryData(["admin", "orders"], (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map((order) =>
            order._id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
          );
        }
        if (Array.isArray(old?.data)) {
          return {
            ...old,
            data: old.data.map((order) =>
              order._id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
            ),
          };
        }
        return old;
      });
      return { previousOrders };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["admin", "orders"], context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${API}/orders/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

// ─── STEADFAST COURIER INTEGRATION HOOKS ────────────────────

export function useAdminParcels(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page);
  if (params.limit) queryParams.set("limit", params.limit);
  if (params.search) queryParams.set("search", params.search);
  if (params.deliveryStatus && params.deliveryStatus !== "All")
    queryParams.set("deliveryStatus", params.deliveryStatus);
  if (params.bookingState && params.bookingState !== "All")
    queryParams.set("bookingState", params.bookingState);
  if (params.startDate) queryParams.set("startDate", params.startDate);
  if (params.endDate) queryParams.set("endDate", params.endDate);

  const queryStr = queryParams.toString();

  return useQuery({
    queryKey: ["admin", "parcels", queryStr],
    queryFn: () =>
      fetchJSON(`${API}/api/steadfast/parcels${queryStr ? `?${queryStr}` : ""}`),
    staleTime: 30_000,
  });
}

export function useSteadfastBalance() {
  return useQuery({
    queryKey: ["admin", "steadfast-balance"],
    queryFn: () => fetchJSON(`${API}/api/steadfast/balance`),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useBookSteadfastOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      fetchJSON(`${API}/api/steadfast/orders/${id}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload || {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "parcels"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "steadfast-balance"] });
    },
  });
}

export function useRefreshCourierStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${API}/api/steadfast/orders/${id}/status`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "parcels"] });
    },
  });
}
