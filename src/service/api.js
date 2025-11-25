import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({
  baseURL: "https://adminpanelbackend-eight.vercel.app/api",
});

// ✅ Automatically add token to headers if available
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
