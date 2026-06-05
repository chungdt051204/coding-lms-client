import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    createEnrollment: (state, action) => {
      state.items.push(action.payload);
    },
  },
});
export const { setEnrollments, createEnrollment } = enrollmentSlice.actions;
