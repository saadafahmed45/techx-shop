import api from "@/lib/api";

export const getUsers = async (params = {}) => {
  const response = await api.get("/api/users", { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/api/users", data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/api/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
};

export const changeUserStatus = async (id, status) => {
  const response = await api.patch(`/api/users/${id}/status`, { status });
  return response.data;
};
