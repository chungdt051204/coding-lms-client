import { axiosClient } from "./axiosClient";

export const aiService = {
  sendMessage: async ({ input }) => {
    const response = await axiosClient.post("/chatbot-ai", { input });
    return response;
  },
};
