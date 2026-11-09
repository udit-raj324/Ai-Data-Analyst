import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8000" : "");

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 120000,
});

export async function uploadDataset(file, onUploadProgress) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/uploadfile/", formData, {
    onUploadProgress,
  });
  return response.data;
}

export function getChartUrl(filename) {
  return `${apiBaseUrl.replace(/\/$/, "")}/charts/${encodeURIComponent(filename)}`;
}
