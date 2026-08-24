import { axiosClient } from "./axiosClient";
export const messageService = {
  postMessage: async ({ data }) => {
    const response = await axiosClient.post("/message", data);
    return response;
  },
  readAllMesssagesByConversation: async ({ conversationId }) => {
    const response = await axiosClient.put(
      `/conversation/${conversationId}/messages`
    );
    return response;
  },
};
