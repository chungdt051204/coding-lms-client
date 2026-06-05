import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const testSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setTests: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    deleteTest: (state, action) => {
      state.items = state.items.filter(
        (value) => value.test._id != action.payload
      );
    },
    updateTest: (state, action) => {
      const index = state.items.findIndex(
        (value) => value.test._id == action.payload.test._id
      );
      state.items[index] = action.payload;
    },
  },
});
export const { setTests, deleteTest, updateTest } = testSlice.actions;
