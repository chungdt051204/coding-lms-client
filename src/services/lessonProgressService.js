import { axiosClient } from "./axiosClient";
export const lessonProgressService = {
  getLessonProgressesByUser: async () => {
    const response = await axiosClient.get("/lessonProgresses");
    return response;
  },
  createLessonProgress: async ({ lessonId }) => {
    const response = await axiosClient.post(`/lessonProgress`, { lessonId });
    return response;
  },
  updateLessonProgress: async ({ lessonId, currentTime }) => {
    const response = await axiosClient.put(`/lessonProgress/${lessonId}`, {
      currentTime,
    });
    return response;
  },
};
