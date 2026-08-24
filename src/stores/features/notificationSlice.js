import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: true,
};
export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    createNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteReadNotification: (state, action) => {
      state.items = state.items.filter((value) => value._id !== action.payload);
    },
  },
});
export const { setNotifications, createNotification, deleteReadNotification } =
  notificationSlice.actions;
