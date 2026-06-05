import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
  },
});
export const { setCategories } = categorySlice.actions;
