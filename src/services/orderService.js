import { axiosClient } from "./axiosClient";
export const orderService = {
  checkout: async ({ formData }) => {
    const response = await axiosClient.post("/checkout", { formData });
    return response;
  },
  processPayment: async ({ orderId }) => {
    const response = await axiosClient.post("/process-payment", { orderId });
    return response;
  },
  getOrders: async ({ params }) => {
    const response = await axiosClient.get(`/admin/orders?${params}`);
    return response;
  },
  getOrdersByUser: async ({ params }) => {
    const response = await axiosClient.get(`/user/orders?${params}`);
    return response;
  },
  getOrderbyId: async ({ orderId }) => {
    const response = await axiosClient.get(`/order/${orderId}`);
    return response;
  },
};
