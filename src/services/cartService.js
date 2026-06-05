import { axiosClient } from "./axiosClient";
export const cartService = {
  addToCart: async ({ courseId }) => {
    const response = await axiosClient.post("/cart", { courseId });
    return response;
  },
  getMyCart: async () => {
    const response = await axiosClient.get("/cart");
    return response;
  },
};
