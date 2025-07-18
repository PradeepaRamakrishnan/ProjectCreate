import axios from "axios";

const pythonAxiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_PYTHON_BACKEND_URL}/api/v1`,
  headers: {
    "Cache-Control": "no-cache",
    "x-api-key": import.meta.env.VITE_APP_PYTHON_BACKEND_API_KEY,
  },
});

export default pythonAxiosClient;
