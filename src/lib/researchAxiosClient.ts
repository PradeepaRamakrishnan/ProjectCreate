import axios from "axios";

const researchAxiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_RESEARCH_BACKEND}/api`,
  headers: {
    "Cache-Control": "no-cache",
    "x-api-key": `${import.meta.env.VITE_RESEARCH_BACKEND_API_KEY}`,
  },
});

export default researchAxiosClient;
