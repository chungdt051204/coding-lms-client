import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: true,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    deleteCartItem: (state, action) => {
      state.items = state.items?.filter(
        (value) => value._id !== action.payload
      );
    },
    deleteCartItemsSelected: (state, action) => {
      state.items = state.items?.filter(
        (value) => !action.payload?.includes(value._id)
      );
    },
  },
});
export const { setCart, addToCart, deleteCartItem, deleteCartItemsSelected } =
  cartSlice.actions;
