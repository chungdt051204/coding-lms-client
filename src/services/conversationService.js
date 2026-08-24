import { axiosClient } from "./axiosClient";

export const conversationService = {
  getConversationByParticipantsAndCourse: async ({
    instructorId,
    courseId,
  }) => {
    const response = await axiosClient.get(
      `/user/conversations?instructorId=${instructorId}&courseId=${courseId}`
    );
    return response;
  },
  getConversationsByInstructor: async () => {
    const response = await axiosClient.get("/instructor/conversations");
    return response;
  },
  getConversationById: async ({ conversationId }) => {
    const response = await axiosClient.get(
      `/instructor/conversation/${conversationId}`
    );
    return response;
  },
};
