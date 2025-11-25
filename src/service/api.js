import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change this if backend URL differs
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
