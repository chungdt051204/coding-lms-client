import { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { userService } from "./services/userService";
import { setIsLogin } from "./stores/features/authSlice";
import { setMe } from "./stores/features/meSlice";
import { roleService } from "./services/roleService";
import { setRoles } from "./stores/features/roleSlice";
import { setCategories } from "./stores/features/categorySlice";
import { categoryService } from "./services/categoryService";
import { cartService } from "./services/cartService";
import { setCart } from "./stores/features/cartSlice";
import { notificationService } from "./services/notificationService";
import { setNotifications } from "./stores/features/notificationSlice";
import { socket } from "../socket";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorCourses from "./pages/instructor/Courses";
import ProtectedRouteInstructor from "./pages/instructor/ProtectedRoute";
import CourseEditor from "./pages/instructor/CourseEditor";
import InstructorPage from "./pages/instructor/InstructorPage";
import Tests from "./pages/instructor/Tests";
import TestEditor from "./pages/instructor/TestEditor";
import Students from "./pages/instructor/Students";
import ProtectedRouteAdmin from "./pages/admin/ProtectedRoute";
import AdminPage from "./pages/admin/AdminPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Cart from "./pages/user/Cart";
import Notifications from "./pages/Notifications";
import MyCourses from "./pages/user/MyCourses";
import TestDetail from "./pages/TestDetail";
import TestResult from "./pages/TestResult";
import MyOrders from "./pages/user/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import Instructors from "./pages/admin/Instructors";
import Users from "./pages/admin/Users";
import InstructorDetail from "./pages/admin/InstructorDetail";
import UserDetail from "./pages/admin/UserDetail";
import MyProfile from "./pages/MyProfile";
import Courses from "./pages/Courses";
import Comments from "./pages/admin/Comments";
import Orders from "./pages/admin/Orders";
import StudentDetail from "./pages/instructor/StudentDetail";

function App() {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const { item: me } = useSelector((state) => state.me);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    socket.on("change-status", () => {
      setRefresh((prev) => prev + 1);
      navigate("/login");
    });
  }, [navigate]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Đã kết nối");
    });
    socket.on("force-logout", () => {
      setRefresh((prev) => prev + 1);
    });
    socket.on("course-review", () => {
      setRefresh((prev) => prev + 1);
    });
    socket.on("course-review-result", () => {
      setRefresh((prev) => prev + 1);
    });
    socket.on("account-review", () => {
      setRefresh((prev) => prev + 1);
    });
    socket.on("account-review-result", () => {
      setRefresh((prev) => prev + 1);
    });
  }, []);
  useEffect(() => {
    const getAllRoles = async () => {
      const result = await roleService.getAllRoles();
      dispatch(setRoles(result.data));
    };
    getAllRoles();
  }, [dispatch]);
  useEffect(() => {
    const getMe = async () => {
      if (token) {
        sessionStorage.setItem("token", token);
        setSearchParams((prev) => {
          prev.delete("token");
        });
      }
      const currentToken = sessionStorage.getItem("token");
      if (!currentToken) return;
      try {
        const result = await userService.getMe();
        dispatch(setIsLogin(true));
        dispatch(setMe(result.data));
      } catch (error) {
        const status = error?.status;
        const message = error?.data?.message;
        console.log(status, message);
        if (status === 401) {
          sessionStorage.removeItem("token");
          toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
        }
      }
    };
    getMe();
  }, [dispatch, setSearchParams, token, navigate, refresh]);
  useEffect(() => {
    const getAllCategories = async () => {
      const result = await categoryService.getAllCategories();
      dispatch(setCategories(result.data));
    };
    getAllCategories();
  }, [dispatch]);
  useEffect(() => {
    if (isLogin) {
      if (me?.role_id?.role == "user") {
        const getMyCart = async () => {
          try {
            const result = await cartService.getMyCart();
            dispatch(setCart(result.data));
          } catch (error) {
            const status = error.status;
            const message = error.data.message;
            console.log(status, message);
          }
        };
        getMyCart();
      }
      const getNotifications = async () => {
        try {
          const result = await notificationService.getNotifications();
          console.log(result.data);
          dispatch(setNotifications(result.data));
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getNotifications();
    }
  }, [dispatch, isLogin, me, navigate]);
  useEffect(() => {
    if (me?.role_id?.role === "admin") socket.emit("join-admin", me?._id);
    if (me?.role_id?.role === "instructor")
      socket.emit("join-instructor", me?._id);
  }, [me]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/course/:courseId/lesson/:id" element={<LessonDetail />} />
        <Route path="/course/:courseId/test/:id" element={<TestDetail />} />
        <Route
          path="/course/:courseId/test/:testId/result/:id"
          element={<TestResult />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:id" element={<OrderDetail />} />

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
            <Route path="student/:id" element={<StudentDetail />} />
            <Route path="comments" element={<Comments />} />
          </Route>
        </Route>

        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="instructor/:id" element={<InstructorDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="user/:id" element={<UserDetail />} />
            <Route path="comments" element={<Comments />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer autoClose={1500} position="top-center" />
    </>
  );
}

export default App;
