import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    "Cache-Control": "no-cache",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const bowheadAuthToken = localStorage.getItem("bowhead-auth-token");
      if (bowheadAuthToken) {
        const parsedToken = JSON.parse(bowheadAuthToken);
        const accessToken = parsedToken?.access_token;

        if (accessToken) {
          config.headers!["Authorization"] = `Bearer ${accessToken}`;
        }
      }
    } catch (error) {
      console.error("Error parsing auth token:", error);
    }

    config.headers!["Cache-Control"] = "no-cache";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
