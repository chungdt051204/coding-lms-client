import { axiosClient } from "./axiosClient";

export const testResultService = {
  getTestResultById: async ({ testResultId }) => {
    const response = await axiosClient.get(`/test-result/${testResultId}`);
    return response;
  },
  getTestResultsByTest: async ({ testId }) => {
    const response = await axiosClient.get(`/test/${testId}/test-result`);
    return response;
  },
  createTestResult: async ({ data }) => {
    const result = await axiosClient.post("/test-result", { data });
    return result;
  },
};
