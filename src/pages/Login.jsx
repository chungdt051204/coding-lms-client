import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoBookOutline } from "react-icons/io5";
import { authService } from "../services/authService";
import { setIsLogin } from "../stores/features/authSlice";
import { setMe } from "../stores/features/meSlice";
import { validateForm } from "../../helper/validateForm";
import { toast } from "react-toastify";
import { api } from "../App";
import logo_google from "../assets/logo-google.png";
import { socket } from "../../socket";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ errorEmail: "", errorPassword: "" });
  const [errorLogin, setErrorLogin] = useState("");
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
      const result = await authService.Login({ data: formData });
      sessionStorage.setItem("token", result.token);
      dispatch(setIsLogin(true));
      dispatch(setMe(result.data));
      console.log(result.data.role_id.role);
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
      console.log(message);
    }
  };
  return (
    <>
      <div className="flex h-[100vh] flex-col bg-auth">
        <div className="flex flex-col w-[50%] p-8 mt-8 mx-auto bg-surface-white rounded-[16px]">
          <div className="flex flex-col justify-between items-center w-[40%] h-[160px] m-auto">
            <div className="flex flex-col justify-center items-center w-[70px] h-[70px] bg-auth rounded-[16px]">
              <IoBookOutline className="text-display-md text-surface-white" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-headline-md text-surface-nav font-medium">
                Đăng nhập
              </p>
              <p className="text-title-sm text-nav-muted">
                Đăng nhập để tiếp tục học tập
              </p>
            </div>
          </div>
          <form
            className=" flex flex-col justify-between h-[220px] mt-[15px]"
            onSubmit={handleLogin}
          >
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
            <span className="text-body-md font-medium text-red-500">
              {error?.errorEmail}
            </span>
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
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                setError((prev) => ({ ...prev, errorPassword: "" }));
              }}
              type="password"
              autoComplete="new-password"
            />
            <span className="text-body-md font-medium text-red-500">
              {error?.errorPassword}
              {errorLogin}
            </span>
            <input
              className="p-2 border-1 rounded-[8px] mt-[15px] text-title-lg font-medium text-surface-white bg-surface-nav hover:cursor-pointer hover:text-surface-bg"
              type="submit"
              value="Đăng nhập"
            />
          </form>
          <button
            onClick={() => (window.location.href = `${api}/auth/google`)}
            className="p-2 border-1 border-surface-bg rounded-[8px] mt-[15px] text-title-lg font-medium text-surface-nav bg-surface-white hover:cursor-pointer hover:text-nav-muted"
          >
            <div className="flex items-center w-[50%] mx-auto">
              <img src={logo_google} width={30} height={30} alt="" />
              <p className="ms-2">Đăng nhập bằng Google</p>
            </div>
          </button>
          <div className="flex mt-[10px] mx-auto">
            <p className="text-body-lg text-nav-muted ms-2">
              Chưa có tài khoản?
            </p>
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
