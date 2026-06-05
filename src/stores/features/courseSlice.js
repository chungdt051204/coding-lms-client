import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    updateCourse: (state, action) => {
      const index = state.items.findIndex(
        (value) => value.course._id == action.payload.course._id
      );
      state.items[index] = action.payload;
    },
  },
});
export const { setCourses, updateCourse, deleteCourse } = courseSlice.actions;
