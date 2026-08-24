import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoBookOutline } from "react-icons/io5";
import { authService } from "../services/authService";
import { validateForm } from "../../helper/validateForm";
import { toast } from "react-toastify";

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
  useEffect(() => {
    console.log(rolesDisplay);
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
      <div className="flex flex-col bg-auth">
        <div className="flex flex-col w-[50%] p-8 mt-8 mx-auto bg-surface-white rounded-[16px]">
          <div className="flex flex-col justify-between items-center w-[40%] h-[160px] m-auto">
            <div className="flex flex-col justify-center items-center w-[70px] h-[70px] bg-auth rounded-[16px]">
              <IoBookOutline className="text-display-md text-surface-white" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-headline-md text-surface-nav font-medium">
                Tạo tài khoản
              </p>
              <p className="text-title-lg text-nav-muted">
                Đăng ký để bắt đầu học tập
              </p>
            </div>
          </div>
          <form
            className=" flex flex-col justify-between h-[450px] mt-[15px]"
            onSubmit={handleRegister}
          >
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
            <span className="text-body-md font-medium text-red-500">
              {error?.errorFullName}
            </span>
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
            </span>
            <label
              className="text-body-lg font-medium text-surface-nav"
              htmlFor="role"
            >
              Bạn muốn đăng ký với vai trò
            </label>
            <div className="flex flex-col justify-between h-[100px]">
              {rolesDisplay?.map((value) => {
                return (
                  <div
                    key={value._id}
                    className="flex items-center p-2 border-1 border-icon-muted rounded-[8px]"
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
                    <p className="text-body-md font-medium text-nav-muted ms-2">
                      {value.role === "user"
                        ? "Tham gia và học khóa học"
                        : "Tạo và bán khóa học"}
                    </p>
                  </div>
                );
              })}
            </div>
            <input
              className="p-2 border-1 rounded-[8px] mt-[15px] text-title-lg font-medium text-surface-white bg-surface-nav hover:cursor-pointer hover:text-surface-bg"
              type="submit"
              value="Đăng ký"
            />
          </form>
          <div className="flex mt-[10px] mx-auto">
            <p className="text-body-lg text-nav-muted ms-2">Đã có tài khoản?</p>
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
