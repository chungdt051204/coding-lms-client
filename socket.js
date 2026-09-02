import { api } from "./src/services/axiosClient";
import { io } from "socket.io-client";
export const socket = io(api, {
  withCredentials: true,
});
