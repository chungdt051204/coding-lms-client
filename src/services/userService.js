import { axiosClient } from "./axiosClient";

export const userService = {
  getMe: async () => {
    const result = await axiosClient.get("/me");
    console.log(result);
    return result;
  },
};
