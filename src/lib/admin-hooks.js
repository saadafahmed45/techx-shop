import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
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
