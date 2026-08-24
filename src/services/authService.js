import { axiosClient } from "./axiosClient";
export const authService = {
  Register: async ({ data }) => {
    const result = await axiosClient.post("/auth/register", data);
    console.log(result);
    return result;
  },
  Login: async ({ data }) => {
    const result = await axiosClient.post("/auth/login", data);
    console.log(result);
    return result;
  },
  Logout: async () => {
    const response = await axiosClient.post("/auth/logout");
    return response;
  },
};
