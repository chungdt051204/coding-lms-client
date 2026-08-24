import { useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../services/authService";
import { setIsLogin } from "../stores/features/authSlice";
import { setMe } from "../stores/features/meSlice";
import { IoBookOutline } from "react-icons/io5";
import { IoBarChartOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { BiComment } from "react-icons/bi";
import { LuUserRound } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { LuInbox } from "react-icons/lu";
import { courseService } from "../services/courseService";
import { FaStar } from "react-icons/fa";
import { format } from "../../helper/format";
import Conversations from "./Conversations";
import { socket } from "../../socket";
import { createNotification } from "../stores/features/notificationSlice";
import { toast } from "react-toastify";
import { setEnrollments } from "../stores/features/enrollmentSlice";

export const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const currentRole = me?.role_id?.role || "user";
  const [searchValue, setSearchValue] = useState("");
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const myCart = useSelector((state) => state.cart);
  const notifications = useSelector((state) => state.notifications.items);
  const navbarItem = {
    user: [
      {
        item: <AiOutlineHome />,
        title: "Trang chủ",
        route: "/",
      },
      {
        item: <IoBookOutline />,
        title: "Khóa học",
        route: "/courses",
      },
    ],
    instructor: [
      {
        item: <IoBarChartOutline />,
        title: "Dashboard",
        route: "/instructor/dashboard",
      },
      {
        item: <IoBookOutline />,
        title: "Khóa học",
        route: "/instructor/courses",
      },
      {
        item: <IoDocumentTextOutline />,
        title: "Bài kiểm tra",
        route: "/instructor/tests",
      },
      { item: <RxPeople />, title: "Học viên", route: "/instructor/students" },
    ],
    admin: [
      {
        item: <IoBarChartOutline />,
        title: "Dashboard",
        route: "/admin/dashboard",
      },
      {
        item: <IoBookOutline />,
        title: "Khóa học",
        route: "/admin/courses",
      },
      {
        item: <LuUserRound />,
        title: "Giảng viên",
        route: "/admin/instructors",
      },
      { item: <RxPeople />, title: "Người dùng", route: "/admin/users" },
      {
        item: <BiComment />,
        title: "Bình luận",
        route: "/admin/comments",
      },
      {
        item: <LuInbox />,
        title: "Đơn hàng",
        route: "/admin/orders",
      },
    ],
  };
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (me && currentRole == "user") {
      socket.emit("join-user", me?._id);
      socket.on("new-notification", (data) => {
        dispatch(createNotification(data));
      });
    }
  }, [currentRole, me, dispatch]);
  useEffect(() => {
    const getApprovedCourses = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        if (searchValue.trim()) params.append("search", searchValue);
        const result = await courseService.getApprovedCourses({
          params: params.toString(),
        });
        console.log(result.data);
        setSuggestedCourses(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    };
    getApprovedCourses();
  }, [searchValue, searchParams]);
  const handleLogout = async () => {
    try {
      const result = await authService.Logout();
      sessionStorage.removeItem("token");
      dispatch(setIsLogin(false));
      dispatch(setMe(null));
      dispatch(setEnrollments([]));
      toast.success(result?.message || "Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      const status = error.status;
      const message = error.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <nav className="fixed flex justify-evenly items-center w-full bg-surface-white py-3 px-16 shadow-lg z-1000">
        <div className="flex items-center w-[10%]">
          <IoBookOutline className="w-[50px] h-[50px] p-2 bg-auth rounded-[8px]  text-surface-white" />
          <p className="bg-auth bg-clip-text text-display-sm text-transparent ms-2">
            LMS
          </p>
        </div>
        {currentRole === "user" && (
          <div className="relative w-[32%] ">
            <div className="flex gap-x-2 items-center py-2 px-4 bg-surface-bg rounded-[8px]">
              <IoSearch
                onClick={() =>
                  navigate(`/courses?search=${encodeURIComponent(searchValue)}`)
                }
                className="text-headline-sm text-nav-muted font-medium"
              />
              <input
                type="text"
                value={searchValue}
                className="w-full outline-0"
                placeholder="Nhập tên khóa học, danh mục, giảng viên"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            {searchValue && (
              <div className="absolute top-[50px] w-[600px]">
                <div className="flex justify-between text-title-sm text-nav-muted px-5 py-3 bg-surface-bg rounded-t-[16px]">
                  <p className="font-medium">KHÓA HỌC GỢI Ý</p>
                  {suggestedCourses?.arrayCourse?.length} kết quả
                </div>
                {suggestedCourses?.arrayCourse?.length > 0 ? (
                  <div
                    className={`flex flex-col py-6 rounded-b-[16px] bg-surface-white ${
                      suggestedCourses?.arrayCourse?.length >= 4 && "h-[400px]"
                    }  overflow-y-auto`}
                  >
                    {suggestedCourses?.arrayCourse?.map((value) => {
                      return (
                        <div
                          className="flex justify-between px-5 py-2 border-b border-b-surface-bg transition-transform duration-300 hover:bg-blue-50 hover:cursor-pointer"
                          key={value?.course?._id}
                          onClick={() =>
                            navigate(`/course/${value?.course?._id}`)
                          }
                        >
                          <div className="flex gap-x-4">
                            <img
                              className="w-[70px] h-[80px] object-contain"
                              src={value?.course?.image_url}
                              alt=""
                            />
                            <div className="flex flex-col gap-y-1">
                              <p className="text-title-lg text-surface-nav font-medium transition-transform duration-300 hover:text-brand-blue">
                                {value?.course?.course_name}
                              </p>
                              <div className="flex gap-x-2 text-title-sm font-medium">
                                <p className="text-nav-muted">
                                  {value?.course?.user_id?.full_name}
                                </p>
                                <p className="text-brand-blue">
                                  {value?.course?.category_id?.category_name}
                                </p>
                              </div>
                              <div className="flex gap-x-6">
                                <div className="flex gap-x-1 items-center text-body-sm">
                                  <FaStar className="text-yellow-300" />
                                  <p className="text-surface-nav">
                                    {value?.course?.rating_star > 0
                                      ? value?.course?.rating_star
                                      : "0.0"}
                                  </p>
                                </div>
                                <p className="text-nav-muted">
                                  {value?.numberEnrollment} học viên
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-title-lg text-brand-blue font-bold">
                            {format.formatPrice({
                              price: value?.course?.price,
                            })}
                            đ
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-y-1 bg-surface-white py-3 rounded-b-[16px]">
                    <LuInbox className="text-display-md text-gray-300" />
                    <p className="text-title-sm text-nav-muted">
                      Không tìm thấy khóa học
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <ul className="flex gap-x-8">
          {navbarItem[currentRole]?.map((value, index) => {
            return (
              <li key={index}>
                <NavLink
                  onClick={() => {
                    if (
                      currentRole == "instructor" &&
                      me?.verified_status !== "VERIFIED"
                    ) {
                      toast.warning(
                        "Tài khoản của bạn chưa được xác thực, không thể truy cập vào các trang quản lý!"
                      );
                      return;
                    }
                  }}
                  to={value.route}
                  className={({ isActive }) => {
                    return `flex items-center gap-x-1 text-title-lg transition-colors duration-200 ${
                      isActive
                        ? "text-brand-blue font-medium"
                        : "text-nav-muted hover:text-brand-blue"
                    }`;
                  }}
                >
                  {value.item}
                  {value.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-x-6 items-center">
          {isLogin && currentRole == "user" && (
            <div className="relative">
              <IoCartOutline
                className="text-headline-md text-surface-nav"
                onClick={() => navigate("/cart")}
              />
              {myCart?.items?.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-brand-blue w-[22px] h-[22px] rounded-[1000px]">
                  <p className="text-title-sm text-surface-white font-medium text-center">
                    {myCart?.items?.length}
                  </p>
                </div>
              )}
            </div>
          )}
          {isLogin && (
            <div className="relative">
              <IoMdNotificationsOutline
                className="text-headline-md"
                onClick={() => navigate("/notifications")}
              />
              {notifications?.filter((value) => !value.is_read)?.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-red-500 w-[22px] h-[22px] rounded-[1000px]">
                  <p className="text-title-sm text-surface-white font-medium text-center">
                    {notifications?.filter((value) => !value.is_read)?.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {currentRole == "instructor" && me?.verified_status === "VERIFIED" && (
          <Conversations me={me} />
        )}
        <div>
          {isLogin && me ? (
            <div
              onClick={() => setClicked((prev) => !prev)}
              className="relative flex gap-x-3 items-center text-title-lg text-surface-nav"
            >
              <img
                className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                src={me.avatar}
                alt=""
                referrerPolicy="no-referrer"
              />
              {clicked ? <FaAngleUp /> : <FaAngleDown />}
              {clicked && (
                <div className="absolute flex flex-col gap-y-2 top-16 p-4 w-[160px] bg-surface-white rounded-[6px] shadow-md text-title-sm text-nav-muted">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="transition-transform duration-300 hover:cursor-pointer hover:text-brand-blue hover:underline"
                  >
                    Tài khoản của tôi
                  </p>
                  {currentRole == "user" && (
                    <div className="flex flex-col gap-y-2">
                      <p
                        onClick={() => navigate("/my-courses")}
                        className="transition-transform duration-300 hover:cursor-pointer hover:text-brand-blue hover:underline"
                      >
                        Khóa học của tôi
                      </p>
                      <p
                        onClick={() => navigate("/my-orders")}
                        className="transition-transform duration-300 hover:cursor-pointer hover:text-brand-blue hover:underline"
                      >
                        Đơn hàng của tôi
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 bg-surface-nav rounded-[8px] text-surface-white transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg hover:scale-105"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-2 py-2 bg-surface-nav rounded-[8px] text-surface-white transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg hover:scale-105"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
