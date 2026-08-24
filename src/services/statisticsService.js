import { axiosClient } from "./axiosClient";
export const statisticsService = {
  getStatisticsByInstructor: async () => {
    const response = await axiosClient.get("/instructor/statistics");
    return response;
  },
  getStatisticsByAdmin: async () => {
    const response = await axiosClient.get("/admin/statistics");
    return response;
  },
};
