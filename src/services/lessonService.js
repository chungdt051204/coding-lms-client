import { axiosClient } from "./axiosClient";

export const lessonService = {
  getLessonsByCourse: async ({ courseId }) => {
    const response = await axiosClient.get(`/lessons/${courseId}`);
    return response;
  },
  getLessonById: async ({ lessonId, courseId }) => {
    const response = await axiosClient.get(
      `/course/${courseId}/lesson/${lessonId}`
    );
    return response;
  },
  deleteLesson: async ({ lessonId }) => {
    const response = await axiosClient.delete(`/instructor/lesson/${lessonId}`);
    return response;
  },
};
