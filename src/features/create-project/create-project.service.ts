
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export const createProjectApi  = async (body: unknown) => {
    try {
      const response = await axiosClient({
        method: "POST",
        url: `/projects`,
        data: body,
      });
  
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
    }
  };