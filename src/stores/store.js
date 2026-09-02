import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/authSlice";
import { meSlice } from "./features/meSlice";
import { roleSlice } from "./features/roleSlice";
import { categorySlice } from "./features/categorySlice";
import { courseSlice } from "./features/courseSlice";
import { enrollmentSlice } from "./features/enrollmentSlice";
import { cartSlice } from "./features/cartSlice";
import { notificationSlice } from "./features/notificationSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    roles: roleSlice.reducer,
    me: meSlice.reducer,
    categories: categorySlice.reducer,
    courses: courseSlice.reducer,
    enrollments: enrollmentSlice.reducer,
    cart: cartSlice.reducer,
    notifications: notificationSlice.reducer,
  },
});
