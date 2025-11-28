import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({
  baseURL: "https://adminpanelbackend-eight.vercel.app/api",
});

// ✅ Automatically add token to headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
