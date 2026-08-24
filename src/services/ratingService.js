import { axiosClient } from "./axiosClient";
export const ratingService = {
  createRating: async ({ data }) => {
    const response = await axiosClient.post("/rating", data);
    return response;
  },
  getRatings: async ({ params }) => {
    const response = await axiosClient.get(`/admin/ratings?${params}`);
    return response;
  },
  hideOrShowComment: async ({ ratingId }) => {
    const response = await axiosClient.put(`/admin/rating/${ratingId}`);
    return response;
  },
};
