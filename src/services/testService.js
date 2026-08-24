import { axiosClient } from "./axiosClient";
export const testService = {
  getTestsByInstructor: async ({ params }) => {
    const response = await axiosClient.get(`/instructor/tests?${params}`);
    return response;
  },
  getTestById: async ({ testId }) => {
    const response = await axiosClient.get(`/test/${testId}`);
    return response;
  },
  getTestByCourse: async ({ courseId }) => {
    const response = await axiosClient.get(`/course/${courseId}/test`);
    return response;
  },
  createTest: async ({ formData }) => {
    const response = await axiosClient.post("/instructor/test/create", {
      formData,
    });
    return response;
  },
  deleteTest: async ({ testId }) => {
    const response = await axiosClient.delete(`/instructor/test/${testId}`);
    return response;
  },
  updateTest: async ({ testId, formData }) => {
    const response = await axiosClient.put(`/instructor/test/${testId}`, {
      formData,
    });
    return response;
  },
  activeTest: async ({ testId }) => {
    const response = await axiosClient.put(`/instructor/test/${testId}/status`);
    return response;
  },
};
