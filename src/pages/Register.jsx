import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authService } from "../services/authService";
import { validateForm } from "../../helper/validateForm";
import { toast } from "react-toastify";
import { IoBookOutline } from "react-icons/io5";

const Register = () => {
  const navigate = useNavigate();
  const roles = useSelector((state) => state.roles.items);
  const rolesDisplay = roles?.filter((item) => item.role !== "admin") || [];
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState({
    errorFullName: "",
    errorEmail: "",
    errorPassword: "",
  });
  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };
    if (
      !validateForm.validateUserForm({
        formData: data,
        setError,
      })
    ) {
      return;
    }
    try {
      const result = await authService.Register({ data: formData });
      toast.success(result?.message || "Đăng ký tài khoản thành công");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      if (status === 409)
        setError((prev) => ({ ...prev, errorEmail: message }));
      console.log(status, message);
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
                Tạo tài khoản
              </p>
              <p className="text-body-md sm:text-title-md lg:text-title-lg text-nav-muted">
                Đăng ký để bắt đầu học tập
              </p>
            </div>
          </div>
          {/* Form Section */}
          <form
            className="flex flex-col gap-y-4 lg:justify-between h-auto lg:h-[450px] mt-[15px]"
            onSubmit={handleRegister}
          >
            <div className="flex flex-col gap-y-2">
              <label
                className="text-body-lg font-medium text-surface-nav"
                htmlFor="fullName"
              >
                Họ và tên
              </label>
              <input
                className="bg-surface-bg p-2 rounded-[8px]"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }));
                  setError((prev) => ({ ...prev, errorFullName: "" }));
                }}
                type="text"
                placeholder="Nguyễn Văn A"
                autoComplete="off"
              />
              {error?.errorFullName && (
                <span className="text-body-md font-medium text-red-500 min-h-[20px]">
                  {error?.errorFullName}
                </span>
              )}
            </div>
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
            </div>
            <div className="flex flex-col gap-y-2">
              <label
                className="text-body-lg font-medium text-surface-nav"
                htmlFor="role"
              >
                Bạn muốn đăng ký với vai trò
              </label>
              <div className="flex flex-col justify-between gap-2 lg:gap-0 min-h-[100px] lg:h-[100px]">
                {rolesDisplay?.map((value) => {
                  return (
                    <div
                      key={value._id}
                      className="flex flex-wrap sm:flex-nowrap items-center p-2 border border-icon-muted rounded-[8px] cursor-pointer"
                    >
                      <input
                        checked={formData.role === value.role}
                        value={value.role}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        type="radio"
                      />
                      <p className="text-body-lg font-medium text-surface-nav ms-2">
                        {value.role === "user" ? "Học viên" : "Giảng viên"}
                      </p>
                      <p className="text-body-sm sm:text-body-md font-medium text-nav-muted ms-2">
                        {value.role === "user"
                          ? "Tham gia và học khóa học"
                          : "Tạo và bán khóa học"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <input
              className="p-2 border rounded-[8px] mt-[15px] text-title-lg font-medium text-surface-white bg-surface-nav hover:cursor-pointer hover:text-surface-bg"
              type="submit"
              value="Đăng ký"
            />
          </form>
          <div className="flex justify-center mt-[10px] mx-auto">
            <p className="text-body-lg text-nav-muted">Đã có tài khoản?</p>
            <Link
              className="text-body-lg font-medium text-brand-blue ms-2 hover:underline"
              to="/login"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
