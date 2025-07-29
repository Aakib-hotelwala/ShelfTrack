import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/products",
});

export const fetchProducts = (params = {}) => API.get("/", { params });

export const getProductById = (id) => API.get(`/${id}`);

export const createProduct = (formData) =>
  API.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, formData) =>
  API.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changeProductStatus = (id, status) =>
  API.patch(`/${id}/status`, { status });

export const deleteProduct = (id) => API.delete(`/${id}`);
