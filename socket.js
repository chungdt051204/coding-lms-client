import { io } from "socket.io-client";
export const socket = io("https://lms-server-2xk1.onrender.com", {
  withCredentials: true,
});
