import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null,
  isLoading: true,
};
export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    setMe: (state, action) => {
      state.item = action.payload;
      state.isLoading = false;
    },
  },
});
export const { setMe } = meSlice.actions;
