import { useEffect, useState } from "react";
import { useNavigate, NavLink, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../services/authService";
import { setIsLogin } from "../stores/features/authSlice";
import { setMe } from "../stores/features/meSlice";
import { courseService } from "../services/courseService";
import { socket } from "../../socket";
import { createNotification } from "../stores/features/notificationSlice";
import { toast } from "react-toastify";
import { setEnrollments } from "../stores/features/enrollmentSlice";
import { format } from "../../helper/format";
import { IoBookOutline } from "react-icons/io5";
import { IoBarChartOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { BiComment } from "react-icons/bi";
import { LuUserRound } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { LuInbox } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import Conversations from "./Conversations";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
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
      <nav className="fixed top-0 left-0 right-0 w-full bg-surface-white py-3 px-4 sm:px-8 lg:px-16 shadow-lg z-50">
        <div className="flex justify-between lg:justify-evenly items-center w-full">
          {/* LOGO */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              if (currentRole === "admin") navigate("/admin/dashboard");
              else if (currentRole == "instructor")
                navigate("/instructor/dashboard");
              else navigate("/");
            }}
          >
            <IoBookOutline className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] p-2 bg-auth rounded-[8px] text-surface-white" />
            <p className="bg-auth bg-clip-text text-headline-sm lg:text-display-sm text-transparent ms-2 font-bold">
              LMS
            </p>
          </div>
          {/* SEARCH BAR */}
          {currentRole === "user" && (
            <div className="relative w-[43%] lg:w-[32%] md:w-[60%]">
              <div className="flex gap-x-2 items-center py-1.5 sm:py-2 px-3 sm:px-4 bg-surface-bg rounded-[8px]">
                <IoSearch
                  onClick={() => {
                    if (searchValue.trim()) {
                      navigate(
                        `/courses?search=${encodeURIComponent(searchValue)}`
                      );
                    }
                  }}
                  className="text-title-lg sm:text-headline-sm text-nav-muted font-medium cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={searchValue}
                  className="w-full outline-0 bg-transparent text-body-md truncate"
                  placeholder="Tìm khóa học, danh mục, giảng viên..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              {searchValue && (
                <div className="fixed inset-x-4 top-[65px] sm:absolute sm:inset-x-auto sm:top-[45px] lg:top-[50px] sm:left-0 w-auto sm:w-[500px] lg:w-[600px] max-w-[calc(100vw-32px)] sm:max-w-none shadow-xl z-50 rounded-[16px] overflow-hidden">
                  <div className="flex justify-between items-center text-body-sm sm:text-title-sm text-nav-muted px-4 sm:px-5 py-2.5 sm:py-3 bg-surface-bg rounded-t-[16px]">
                    <p className="font-medium tracking-wide">KHÓA HỌC GỢI Ý</p>
                    <span>
                      {suggestedCourses?.arrayCourse?.length || 0} kết quả
                    </span>
                  </div>
                  {suggestedCourses?.arrayCourse?.length > 0 ? (
                    <div
                      className={`flex flex-col py-3 sm:py-6 bg-surface-white max-h-[60vh] sm:max-h-none ${
                        suggestedCourses?.arrayCourse?.length >= 4 &&
                        "sm:h-[400px]"
                      } overflow-y-auto`}
                    >
                      {suggestedCourses?.arrayCourse?.map((value) => (
                        <div
                          className="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-b-surface-bg transition-colors duration-200 hover:bg-blue-50 cursor-pointer"
                          key={value?.course?._id}
                          onClick={() => {
                            navigate(`/course/${value?.course?._id}`);
                            setSearchValue("");
                          }}
                        >
                          <div className="flex gap-x-3 sm:gap-x-4 items-center min-w-0 pr-2">
                            <img
                              className="w-[50px] h-[55px] sm:w-[70px] sm:h-[80px] object-contain rounded shrink-0"
                              src={value?.course?.image_url}
                              alt=""
                            />
                            <div className="flex flex-col gap-y-0.5 sm:gap-y-1 min-w-0">
                              <p className="text-body-md sm:text-title-lg text-surface-nav font-medium truncate transition-colors duration-200 hover:text-brand-blue">
                                {value?.course?.course_name}
                              </p>
                              <div className="flex flex-col gap-y-1 lg:flex-row lg:gap-x-2 text-body-sm sm:text-title-sm font-medium">
                                <p className="text-nav-muted max-w-[120px] sm:max-w-none">
                                  {value?.course?.user_id?.full_name}
                                </p>
                                <p className="text-brand-blue max-w-[120px] sm:max-w-none">
                                  {value?.course?.category_id?.category_name}
                                </p>
                              </div>
                              <div className="flex gap-x-4 sm:gap-x-6">
                                <div className="flex gap-x-1 items-center text-body-xs sm:text-body-sm">
                                  <FaStar className="text-yellow-300 shrink-0" />
                                  <p className="text-surface-nav">
                                    {value?.course?.rating_star > 0
                                      ? value?.course?.rating_star
                                      : "0.0"}
                                  </p>
                                </div>
                                <p className="text-nav-muted text-body-xs sm:text-body-sm">
                                  {value?.numberEnrollment} học viên
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-body-md sm:text-title-lg text-brand-blue font-bold whitespace-nowrap shrink-0">
                            {format.formatPrice({
                              price: value?.course?.price,
                            })}{" "}
                            đ
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-y-1 bg-surface-white py-4 rounded-b-[16px]">
                      <LuInbox className="text-headline-md sm:text-display-md text-gray-300" />
                      <p className="text-body-sm sm:text-title-sm text-nav-muted">
                        Không tìm thấy khóa học
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* NAV LINKS (Desktop) */}
          <ul className="hidden lg:flex gap-x-8">
            {navbarItem[currentRole]?.map((value, index) => (
              <li key={index}>
                <NavLink
                  onClick={() => {
                    if (
                      currentRole === "instructor" &&
                      me?.verified_status !== "VERIFIED"
                    ) {
                      toast.warning(
                        "Tài khoản của bạn chưa được xác thực, không thể truy cập vào các trang quản lý!"
                      );
                      return;
                    }
                  }}
                  to={value.route}
                  className={({ isActive }) =>
                    `flex items-center gap-x-1 text-title-lg transition-colors duration-200 ${
                      isActive
                        ? "text-brand-blue font-medium"
                        : "text-nav-muted hover:text-brand-blue"
                    }`
                  }
                >
                  {value.item}
                  {value.title}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* ICONS & ACTIONS */}
          <div className="flex items-center gap-x-3 lg:gap-x-6 md:gap-x-6">
            {isLogin && currentRole === "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <IoCartOutline className="text-headline-md text-surface-nav" />
                {myCart?.items?.length > 0 && (
                  <div className="absolute -top-1 -right-2 bg-brand-blue min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center">
                    <p className="text-title-sm text-surface-white font-medium leading-none">
                      {myCart?.items?.length}
                    </p>
                  </div>
                )}
              </div>
            )}
            {isLogin && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/notifications")}
              >
                <IoMdNotificationsOutline className="text-headline-md" />
                {notifications?.filter((value) => !value.is_read)?.length >
                  0 && (
                  <div className="absolute -top-1 -right-2 bg-red-500 min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center">
                    <p className="text-title-sm text-surface-white font-medium leading-none">
                      {notifications?.filter((value) => !value.is_read)?.length}
                    </p>
                  </div>
                )}
              </div>
            )}
            {currentRole === "instructor" &&
              me?.verified_status === "VERIFIED" && (
                <div className="sm:block">
                  <Conversations me={me} />
                </div>
              )}
            {isLogin && me ? (
              <div
                onClick={() => setClicked((prev) => !prev)}
                className="relative hidden lg:flex gap-x-3 items-center text-title-lg text-surface-nav cursor-pointer"
              >
                <img
                  className="w-[40px] h-[40px] rounded-full object-cover"
                  src={me.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                {clicked ? <FaAngleUp /> : <FaAngleDown />}
                {clicked && (
                  <div className="absolute right-0 top-14 flex flex-col gap-y-2 p-4 w-[180px] bg-surface-white rounded-[8px] shadow-lg text-title-sm text-nav-muted z-50">
                    <p
                      onClick={() => navigate("/my-profile")}
                      className="hover:text-brand-blue cursor-pointer"
                    >
                      Tài khoản của tôi
                    </p>
                    {currentRole === "user" && (
                      <>
                        <p
                          onClick={() => navigate("/my-courses")}
                          className="hover:text-brand-blue cursor-pointer"
                        >
                          Khóa học của tôi
                        </p>
                        <p
                          onClick={() => navigate("/my-orders")}
                          className="hover:text-brand-blue cursor-pointer"
                        >
                          Đơn hàng của tôi
                        </p>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="mt-2 px-3 py-1.5 bg-surface-nav rounded-[8px] text-surface-white hover:text-surface-bg transition-transform"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="hidden lg:block px-4 py-2 bg-surface-nav rounded-[8px] text-surface-white transition-transform duration-300 hover:scale-105"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            )}
            {/* HAMBURGER TOGGLE BUTTON (Tablet, Mobile) */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden text-headline-md text-surface-nav p-1 rounded-md focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>
        {/* DROPDOWN MENU (Tablet, Mobile)  */}
        {mobileMenuOpen && (
          <div className="lg:hidden flex flex-col gap-y-4 pt-4 pb-6 mt-3 border-t border-surface-bg">
            <ul className="flex flex-col gap-y-3">
              {navbarItem[currentRole]?.map((value, index) => (
                <li key={index}>
                  <NavLink
                    to={value.route}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-x-2 py-1 text-title-md ${
                        isActive
                          ? "text-brand-blue font-bold"
                          : "text-surface-nav"
                      }`
                    }
                  >
                    {value.item}
                    {value.title}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="border-t border-surface-bg pt-3">
              {isLogin && me ? (
                <div className="flex flex-col gap-y-3">
                  <div className="flex items-center gap-x-3">
                    <img
                      className="w-[40px] h-[40px] rounded-full object-cover"
                      src={me.avatar}
                      alt=""
                    />
                    <div>
                      <p className="font-medium text-surface-nav">
                        {me.full_name || "Tài khoản"}
                      </p>
                      <p className="text-body-sm text-nav-muted">{me.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 pl-2 text-title-sm text-nav-muted">
                    <p
                      onClick={() => {
                        navigate("/my-profile");
                        setMobileMenuOpen(false);
                      }}
                      className="cursor-pointer hover:text-brand-blue"
                    >
                      Tài khoản của tôi
                    </p>
                    {currentRole === "user" && (
                      <>
                        <p
                          onClick={() => {
                            navigate("/my-courses");
                            setMobileMenuOpen(false);
                          }}
                          className="cursor-pointer hover:text-brand-blue"
                        >
                          Khóa học của tôi
                        </p>
                        <p
                          onClick={() => {
                            navigate("/my-orders");
                            setMobileMenuOpen(false);
                          }}
                          className="cursor-pointer hover:text-brand-blue"
                        >
                          Đơn hàng của tôi
                        </p>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-2 py-2 bg-surface-nav rounded-[8px] text-surface-white text-center font-medium"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full py-2.5 bg-surface-nav rounded-[8px] text-surface-white font-medium"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
export default Navbar;
