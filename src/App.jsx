import { Routes, Route, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/instructor/Dashboard";
import { useEffect } from "react";
import { userService } from "./services/userService";
import { setIsLogin } from "./stores/features/authSlice";
import { setMe } from "./stores/features/meSlice";

import InstructorCourses from "./pages/instructor/Courses";
import ProtectedRouteInstructor from "./pages/instructor/ProtectedRoute";
import { roleService } from "./services/roleService";
import { setRoles } from "./stores/features/roleSlice";
import { setCategories } from "./stores/features/categorySlice";
import { categoryService } from "./services/categoryService";
import CourseEditor from "./pages/instructor/CourseEditor";
import InstructorPage from "./pages/instructor/InstructorPage";
import Tests from "./pages/instructor/Tests";
import TestEditor from "./pages/instructor/TestEditor";
import Students from "./pages/instructor/Students";
import Comments from "./pages/instructor/Comments";

import ProtectedRouteAdmin from "./pages/admin/ProtectedRoute";
import AdminPage from "./pages/admin/AdminPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import CourseDetail from "./pages/user/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import { cartService } from "./services/cartService";
import { setCart } from "./stores/features/cartSlice";
import Cart from "./pages/user/Cart";

export const api = "http://localhost:3000";
function App() {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    const getAllRoles = async () => {
      const result = await roleService.getAllRoles();
      console.log(result);
      dispatch(setRoles(result.data));
    };
    getAllRoles();
  }, [dispatch]);
  useEffect(() => {
    const getMe = async () => {
      if (token) {
        localStorage.setItem("token", token);
        setSearchParams((prev) => {
          prev.delete("token");
        });
      }
      try {
        const result = await userService.getMe();
        dispatch(setIsLogin(true));
        dispatch(setMe(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getMe();
  }, [dispatch, setSearchParams, token]);
  useEffect(() => {
    const getAllCategories = async () => {
      const result = await categoryService.getAllCategories();
      console.log(result.data);
      dispatch(setCategories(result.data));
    };
    getAllCategories();
  }, [dispatch]);
  useEffect(() => {
    if (isLogin && me?.role_id?.role == "user") {
      const getMyCart = async () => {
        try {
          const result = await cartService.getMyCart();
          console.log(result.data);
          dispatch(setCart(result.data));
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getMyCart();
    }
  }, [dispatch, isLogin, me]);
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/course/:courseId/lesson/:id" element={<LessonDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<ProtectedRouteInstructor />}>
          <Route path="/instructor" element={<InstructorPage />}>
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<InstructorCourses />} />
            <Route path="course/add" element={<CourseEditor />} />
            <Route path="course/:id/edit" element={<CourseEditor />} />
            <Route path="tests" element={<Tests />} />
            <Route path="test/create" element={<TestEditor />} />
            <Route path="test/:id/edit" element={<TestEditor />} />
            <Route path="students" element={<Students />} />
            <Route path="comments" element={<Comments />} />
          </Route>
        </Route>
        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={1500} position="top-center" />
    </>
  );
}

export default App;
