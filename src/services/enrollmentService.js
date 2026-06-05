import { axiosClient } from "./axiosClient";
export const enrollmentService = {
  createEnrollment: async ({ courseId }) => {
    const response = await axiosClient.post("/enrollment", { courseId });
    return response;
  },
  getEnrollmentsByUser: async () => {
    const response = await axiosClient.get("/user/enrollments");
    return response;
  },
  getAllEnrollments: async () => {
    const response = await axiosClient.get("/enrollments");
    return response;
  },
};
