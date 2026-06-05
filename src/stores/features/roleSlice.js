import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
  },
});
export const { setRoles } = roleSlice.actions;
