import { axiosClient } from "./axiosClient";

export const cartItemService = {
  deleteCartItem: async ({ cartItemId }) => {
    const response = await axiosClient.delete(`/cartItem/${cartItemId}`);
    return response;
  },
  deleteCartItemsSelected: async ({ cartItemIds }) => {
    const response = await axiosClient.post(`/cartItems`, cartItemIds);
    return response;
  },
};
