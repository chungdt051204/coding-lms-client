import { useNavigate, NavLink } from "react-router-dom";
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
import { FaShoppingCart } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { IoSearch } from "react-icons/io5";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const currentRole = me?.role_id?.role || "user";
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
      isLogin && {
        item: <FaShoppingCart />,
        title: "Giỏ hàng",
        route: "/cart",
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
    ],
  };
  const handleLogout = () => {
    authService.Logout({ dispatch, navigate, setIsLogin, setMe });
  };
  return (
    <>
      <nav className="flex justify-evenly items-center py-3 px-16 shadow-lg">
        <div className="flex items-center w-[10%]">
          <IoBookOutline className="w-[50px] h-[50px] p-2 bg-auth rounded-[8px]  text-surface-white" />
          <p className="bg-auth bg-clip-text text-display-sm text-transparent ms-2">
            LMS
          </p>
        </div>
        {currentRole === "user" && (
          <div className="flex gap-x-2 items-center w-[32%] py-2 px-4 bg-surface-bg rounded-[8px]">
            <IoSearch className="text-headline-sm text-nav-muted font-medium" />
            <SearchBar />
          </div>
        )}
        <ul className="flex gap-x-8">
          {navbarItem[currentRole]?.map((value, index) => {
            return (
              <li key={index}>
                <NavLink
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
        <div>
          {isLogin && me ? (
            <div className="flex items-center">
              <img
                src={me.avatar}
                alt=""
                width={50}
                height={50}
                referrerPolicy="no-referrer"
              />
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
