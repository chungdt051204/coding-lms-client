import { axiosClient } from "./axiosClient";
export const questionService = {
  getQuestionsByTest: async ({ testId }) => {
    const response = await axiosClient.get(`/test/${testId}/questions`);
    return response;
  },
  deleteQuestion: async ({ questionId }) => {
    const response = await axiosClient.delete(
      `/instructor/question/${questionId}`
    );
    return response;
  },
};
