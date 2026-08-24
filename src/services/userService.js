import { axiosClient } from "./axiosClient";

export const userService = {
  getMe: async () => {
    const response = await axiosClient.get("/me");
    return response;
  },
  getInstructors: async ({ params }) => {
    const response = await axiosClient.get(`/admin/instructors?${params}`);
    return response;
  },
  getUsers: async ({ params }) => {
    const response = await axiosClient.get(`/admin/users?${params}`);
    return response;
  },
  getInstructorById: async ({ instructorId }) => {
    const response = await axiosClient.get(`/admin/instructor/${instructorId}`);
    return response;
  },
  getUserById: async ({ userId }) => {
    const response = await axiosClient.get(`/admin/user/${userId}`);
    return response;
  },
  getStudentsByInstructor: async ({ params }) => {
    const response = await axiosClient.get(`/instructor/students?${params}`);
    return response;
  },
  getStudentById: async ({ studentId, params }) => {
    const response = await axiosClient.get(
      `/instructor/student/${studentId}?${params}`
    );
    return response;
  },
  updateAvatar: async ({ avatar }) => {
    const response = await axiosClient.put("/me/avatar", avatar, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  sendRequestVerification: async ({ images }) => {
    const response = await axiosClient.put(
      "/instructor/verification/send",
      images,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },
  cancelRequestVerification: async () => {
    const response = await axiosClient.put("/instructor/verification/cancel");
    return response;
  },
  approvedOrRejectedInstructor: async ({ instructorId, status, message }) => {
    const response = await axiosClient.put(
      `/admin/instructor/${instructorId}?status=${status}`,
      message
    );
    return response;
  },
  updateProfile: async ({ data }) => {
    const response = await axiosClient.put("/me/profile", data);
    return response;
  },
  changePassword: async ({ password }) => {
    const response = await axiosClient.put("me/password", password);
    return response;
  },
  updateStatusUser: async ({ userId }) => {
    const response = await axiosClient.put(`/admin/user/${userId}/status`);
    return response;
  },
  updateInstructorInfo: async ({ instructorId, formData }) => {
    const response = await axiosClient.put(
      `/admin/instructor/${instructorId}/info`,
      { formData }
    );
    return response;
  },
};
