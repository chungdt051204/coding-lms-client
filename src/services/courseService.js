import { axiosClient } from "./axiosClient";
export const courseService = {
  addCourse: async ({ data }) => {
    const response = await axiosClient.post("/course", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  getApprovedCourses: async ({ params }) => {
    const response = await axiosClient.get(`/courses?${params}`);
    return response;
  },
  getCoursesByInstructor: async ({ params }) => {
    const response = await axiosClient.get(`/instructor/courses?${params}`);
    return response;
  },
  getCoursesByAdmin: async ({ params }) => {
    const response = await axiosClient.get(`/admin/courses?${params}`);
    return response;
  },
  getCourseById: async ({ courseId }) => {
    const response = await axiosClient.get(`/course/${courseId}`);
    return response;
  },
  updateCourse: async ({ courseId, data }) => {
    const response = await axiosClient.put(`/course/${courseId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  deleteCourse: async ({ courseId }) => {
    const response = await axiosClient.delete(`/course/${courseId}`);
    return response;
  },
  submitOrUnSubmitCourse: async ({ courseId, status }) => {
    const response = await axiosClient.put(
      `/instructor/course/${courseId}/status?status=${status}`
    );
    console.log(response.data);
    return response;
  },
  deleteOrRestoreCourse: async ({ courseId, action }) => {
    const response = await axiosClient.put(
      `/instructor/course/${courseId}/action?action=${action}`
    );
    return response;
  },
  approveOrRejectCourse: async ({ courseId, status, data }) => {
    const response = await axiosClient.put(
      `/admin/course/${courseId}/status?status=${status}`,
      data
    );
    return response;
  },
};
