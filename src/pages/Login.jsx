import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";
import { authService } from "../services/authService";
import { setIsLogin } from "../stores/features/authSlice";
import { setMe } from "../stores/features/meSlice";
import { validateForm } from "../../helper/validateForm";
import { toast } from "react-toastify";
import { api } from "../services/axiosClient";
import { IoBookOutline } from "react-icons/io5";
import logo_google from "../assets/logo-google.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ errorEmail: "", errorPassword: "" });
  const [errorLogin, setErrorLogin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email: formData.email, password: formData.password };
    if (
      !validateForm.validateUserForm({
        formData: data,
        setError,
      })
    )
      return;
    try {
      setIsLoading(true);
      const result = await authService.Login({ data: formData });
      sessionStorage.setItem("token", result.token);
      dispatch(setIsLogin(true));
      dispatch(setMe(result.data));
      toast.success(result?.message || "Đăng nhập thành công");
      socket.emit("join-user", result?.data?._id);
      setTimeout(() => {
        if (result.data.role_id.role === "instructor") {
          navigate("/instructor/dashboard");
        } else if (result.data.role_id.role === "admin")
          navigate("/admin/dashboard");
        else navigate("/");
      }, 1000);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      if (status === 404)
        setError((prev) => ({ ...prev, errorEmail: message }));
      if (status === 401)
        setError((prev) => ({ ...prev, errorPassword: message }));
      if (status === 403) setErrorLogin(message);
      if (status === 429)
        setErrorLogin("Quá nhiều lần thử! Vui lòng thử lại sau 15 phút!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center px-4 sm:px-6 lg:px-0 bg-auth py-6">
        <div className="flex flex-col w-full sm:w-[85%] md:w-[70%] lg:w-[50%] p-5 sm:p-8 my-auto mx-auto bg-surface-white rounded-[16px]">
          {/* Header Section */}
          <div className="flex flex-col justify-between items-center w-full sm:w-[60%] lg:w-[40%] min-h-[140px] lg:h-[160px] m-auto gap-3">
            <div className="flex flex-col justify-center items-center w-[60px] h-[60px] lg:w-[70px] lg:h-[70px] bg-auth rounded-[16px]">
              <IoBookOutline className="text-display-md text-surface-white" />
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="text-title-lg sm:text-headline-sm lg:text-headline-md text-surface-nav font-medium">
                Đăng nhập
              </p>
              <p className="text-body-md sm:text-title-sm text-nav-muted">
                Đăng nhập để tiếp tục học tập
              </p>
            </div>
          </div>
          {/* Form Section */}
          <form
            className="flex flex-col gap-y-4 lg:justify-between mt-[15px]"
            onSubmit={handleLogin}
          >
            <div className="flex flex-col gap-y-2">
              <label
                className="text-body-lg font-medium text-surface-nav"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="bg-surface-bg p-2 rounded-[8px]"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  setError((prev) => ({ ...prev, errorEmail: "" }));
                }}
                type="text"
                placeholder="your@gmail.com"
                autoComplete="off"
              />
              {error?.errorEmail && (
                <span className="text-body-md font-medium text-red-500 min-h-[20px]">
                  {error?.errorEmail}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <label
                className="text-body-lg font-medium text-surface-nav"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <input
                className="bg-surface-bg p-2 rounded-[8px] outline-nav-muted"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  setError((prev) => ({ ...prev, errorPassword: "" }));
                }}
                type="password"
                autoComplete="new-password"
              />
              {error?.errorPassword && (
                <span className="text-body-md font-medium text-red-500 min-h-[20px]">
                  {error?.errorPassword}
                </span>
              )}
              {errorLogin && (
                <span className="text-body-md font-medium text-red-500 min-h-[20px]">
                  {errorLogin}
                </span>
              )}
            </div>
            <input
              disabled={isLoading}
              className="p-2 border rounded-[8px] mt-[15px] text-title-sm md:text-title-lg font-medium text-surface-white bg-surface-nav hover:cursor-pointer hover:text-surface-bg"
              type="submit"
              value={isLoading ? "Đang xử lý..." : "Đăng nhập"}
            />
          </form>
          {/* Google Button */}
          <button
            onClick={() => (window.location.href = `${api}/auth/google`)}
            className="p-2 border border-surface-bg rounded-[8px] mt-[15px] text-body-lg sm:text-title-lg font-medium text-surface-nav bg-surface-white hover:cursor-pointer hover:text-nav-muted"
          >
            <div className="flex items-center justify-center w-full sm:w-[70%] lg:w-[50%] mx-auto">
              <img src={logo_google} width={30} height={30} alt="Google logo" />
              <p className="ms-2 whitespace-nowrap">Đăng nhập bằng Google</p>
            </div>
          </button>
          {/* Footer Link */}
          <div className="flex justify-center mt-[10px] mx-auto">
            <p className="text-body-lg text-nav-muted">Chưa có tài khoản?</p>
            <Link
              className="text-body-lg font-medium text-brand-blue ms-2 hover:underline"
              to="/register"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
