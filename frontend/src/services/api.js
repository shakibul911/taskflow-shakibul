import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper to extract clean error message from backend responses
export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (Array.isArray(data.errors) && data.errors.length > 0) return data.errors[0];
  }
  return error.message || "An unexpected error occurred. Please try again.";
};

export const api = {
  // Fetch tasks with optional status filter and sorting
  getTasks: async (params = {}) => {
    const response = await apiClient.get("/tasks", { params });
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (id, updateData) => {
    const response = await apiClient.put(`/tasks/${id}`, updateData);
    return response.data;
  },

  // Toggle status between pending and completed
  toggleTask: async (id) => {
    const response = await apiClient.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Delete task by id
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;

