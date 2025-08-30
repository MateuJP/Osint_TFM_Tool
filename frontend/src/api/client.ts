// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Error solicitando datos";
    if (error.response) {
      if (error.response.data?.detail) {
        message = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map((d: any) => d.msg).join(", ")
          : error.response.data.detail;
      } else if (typeof error.response.data === "string") {
        message = error.response.data;
      } else {
        message = `Error ${error.response.status} : ${error.response.statusText}`
      }
    } else if (error.request) {
      message = "No se ha recibido respuesta del servidor";
    } else {
      message = error.message || "Error desconocido"
    }
    return Promise.reject(new Error(message))
  }
)

export default api;
