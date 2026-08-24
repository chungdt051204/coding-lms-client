import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { format } from "../../helper/format";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../../helper/validateForm";
import { userService } from "../services/userService";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { LuSave } from "react-icons/lu";
import { MdLockOutline } from "react-icons/md";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";

const MyProfile = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState({
    errorFullName: "",
    errorPhone: "",
    errorPassword: "",
    errorConfirmPassword: "",
  });
  const [frontIdCard, setFrontIdCard] = useState(null);
  const [backIdCard, setBackIdCard] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [preview, setPreview] = useState({
    avatarPreview: null,
    frontIdCardPreview: null,
    backIdCardPreview: null,
    degreeCertificatePreview: null,
  });
  const [errorImage, setErrorImage] = useState({
    errorAvatar: "",
    errorFrontIdCard: "",
    errorBackIdCard: "",
    errorDegreeCertificate: "",
  });
  const [refresh, setRefresh] = useState(0);
  const handleValidateFile = ({ e, errorField }) => {
    const allowedTypes = ["jpg", "png", "jpeg"];
    const image = e.target.files[0];
    const type = image?.name?.split(".")[1];
    if (!allowedTypes.includes(type)) {
      setErrorImage((prev) => ({
        ...prev,
        [errorField]: "Định dạng ảnh không hợp lệ!",
      }));
      return false;
    } else if (image?.size > 300000) {
      setErrorImage((prev) => ({
        ...prev,
        [errorField]: "Kích thước ảnh tối đa 300KB!",
      }));
      return false;
    }
    return true;
  };
  const handlePreview = ({ e, field, errorField }) => {
    const image = e.target.files[0];
    const previewUrl = URL.createObjectURL(image);
    setPreview((prev) => ({ ...prev, [field]: previewUrl }));
    setErrorImage((prev) => ({ ...prev, [errorField]: "" }));
  };
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
  }, [isLoading, me, navigate]);

  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await userService.getMe();
        console.log(result.data);
        setMe(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getMe();
  }, [refresh]);
  useEffect(() => {
    if (me) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountInfo((prev) => ({
        ...prev,
        fullName: me?.full_name || "",
        phone: me?.phone || "",
        avatar: me?.avatar || null,
      }));
      setFullName(me?.full_name || "");
      setAvatarPreview(me?.avatar || null);
      setFrontIdCard(me?.front_id_card || null);
      setBackIdCard(me?.back_id_card || null);
      setDegreeCertificate(me?.degree_certificate || null);
    }
  }, [me]);
  const handleUpdateAvatar = async () => {
    const data = {
      avatar: accountInfo.avatar,
    };
    if (!validateForm.validateUserForm({ formData: data, setError })) return;
    const formData = new FormData();
    formData.append("avatar", accountInfo.avatar);
    try {
      const result = await userService.updateAvatar({ avatar: formData });
      toast.success(result?.message || "Cập nhật ảnh đại diện thành công");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleUpdateProfile = async () => {
    const data = {
      fullName: accountInfo.fullName,
      phone: accountInfo.phone,
    };
    if (!validateForm.validateUserForm({ formData: data, setError })) return;
    try {
      const result = await userService.updateProfile({ data });
      toast.success(result?.message || "Cập nhật thông tin thành công");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleChangePassword = async () => {
    const data = {
      password: accountInfo.password,
      confirmPassword: accountInfo.confirmPassword,
    };
    if (!validateForm.validateUserForm({ formData: data, setError })) return;
    const formData = {
      password: accountInfo.password,
    };
    try {
      const result = await userService.changePassword({
        password: formData,
      });
      toast.success(result?.message || "Thay đổi mật khẩu thành công");
      setRefresh((prev) => prev + 1);
      navigate("/login");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleSendRequestVerification = async () => {
    const data = {
      frontIdCard,
      backIdCard,
      degreeCertificate,
    };
    console.log(data);
    if (
      (typeof frontIdCard == "object" ||
        typeof backIdCard == "object" ||
        typeof degreeCertificate == "object") &&
      !validateForm.validateUserForm({
        formData: data,
        setError: setErrorImage,
      })
    )
      return;
    const formData = new FormData();
    formData.append("frontIdCard", frontIdCard);
    formData.append("backIdCard", backIdCard);
    formData.append("degreeCertificate", degreeCertificate);
    try {
      const result = await userService.sendRequestVerification({
        images: formData,
      });
      toast.success(result?.message || "Gửi yêu cầu xác thực thành công");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleCancelRequestVerification = async () => {
    try {
      const result = await userService.cancelRequestVerification();
      toast.success(result?.message || "Hủy yêu cầu xác thực thành công");
      setFrontIdCard(null);
      setBackIdCard(null);
      setDegreeCertificate(null);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  if (isLoading) return <div className="text-center">Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="p-24">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Tài khoản của tôi
          </p>
          <p className="text-title-lg text-nav-muted">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>
        <div className="flex justify-between items-start mt-6">
          <div className="flex flex-col gap-y-4 w-[34%] border border-gray-300 rounded-[16px] px-5 pt-5 pb-10">
            <div className="relative flex flex-col gap-y-1 text-center">
              <img
                className="w-[180px] h-[180px] object-cover rounded-[1000px] mx-auto"
                src={preview.avatarPreview || accountInfo.avatar}
                alt=""
              />
              <label
                htmlFor="avatar"
                className="absolute p-2 top-[130px] left-[200px] rounded-[1000px] bg-surface-nav"
              >
                <IoCameraOutline className="text-headline-md text-surface-white" />
              </label>
              <input
                onChange={(e) => {
                  if (handleValidateFile({ e, errorField: "errorAvatar" })) {
                    setAccountInfo((prev) => ({
                      ...prev,
                      avatar: e.target.files[0],
                    }));
                    handlePreview({
                      e,
                      field: "avatarPreview",
                      errorField: "errorAvatar",
                    });
                  }
                }}
                id="avatar"
                className="hidden"
                type="file"
              />
              <span className="text-body-md text-red-500 font-medium">
                {errorImage.errorAvatar}
              </span>
              <p className="text-title-lg text-surface-nav font-medium">
                {fullName}
              </p>
              <p className="text-title-sm text-nav-muted">{me?.email || ""}</p>
              <button
                onClick={handleUpdateAvatar}
                className="flex justify-center px-2 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                <div className="flex gap-x-2 items-center">
                  <LuSave />
                  Cập nhật ảnh đại diện
                </div>
              </button>
            </div>
            <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted">
              <FaRegCalendarAlt className="text-title-lg" />
              <div className="flex flex-col gap-y-2 text-title-sm">
                <p>Ngày tham gia hệ thống</p>
                <p>{format.formatDate({ date: me?.createdAt })}</p>
              </div>
            </div>
            {me?.role_id?.role == "instructor" && (
              <div className="flex flex-col gap-y-1 p-2 border border-gray-300 rounded-[8px] text-nav-muted">
                <div className="flex gap-x-4 items-center">
                  <IoShieldCheckmarkOutline className="text-title-lg" />
                  <div className="flex flex-col gap-y-2 text-title-sm">
                    <p>Trạng thái xác thực</p>
                    <p
                      className={`p-1 rounded-[8px] text-center ${
                        me?.verified_status === "NOT_VERIFIED"
                          ? "bg-orange-100 text-orange-500"
                          : me?.verified_status === "PENDING"
                          ? "bg-gray-100 text-gray-500"
                          : me?.verified_status === "REJECTED"
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-500"
                      }`}
                    >
                      {me?.verified_status === "NOT_VERIFIED"
                        ? "Chưa xác thực"
                        : me?.verified_status === "PENDING"
                        ? "Chờ xác thực"
                        : me?.verified_status === "REJECTED"
                        ? "Bị từ chối"
                        : "Đã xác thực"}
                    </p>
                  </div>
                </div>
                <p className="text-body-md text-nav-muted">
                  {me?.verified_status === "NOT_VERIFIED"
                    ? "Vui lòng gửi giấy tờ để được quản trị viên duyệt"
                    : me?.verified_status === "PENDING"
                    ? "Yêu cầu xác thực đang được xử lý"
                    : me?.verified_status === "REJECTED" &&
                      "Vui lòng xác thực lại"}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4 w-[64%] ">
            <form className="flex flex-col gap-y-4 border border-gray-300 rounded-[16px] p-5">
              <p className="text-title-lg text-surface-nav font-medium">
                Thông tin cá nhân
              </p>
              <div className="flex flex-wrap gap-y-2 justify-between">
                <div className="flex flex-col gap-y-1 w-[40%]">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="fullName"
                  >
                    Họ và tên
                  </label>
                  <input
                    className="px-2 py-1 border border-gray-300 rounded-[8px]"
                    type="text"
                    onChange={(e) => {
                      setAccountInfo((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }));
                      setError((prev) => ({ ...prev, errorFullName: "" }));
                    }}
                    value={accountInfo.fullName}
                    placeholder="Nhập họ tên"
                  />
                  <span className="text-body-md text-red-500 font-medium">
                    {error.errorFullName}
                  </span>
                </div>
                <div className="flex flex-col gap-y-1 w-[40%]">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="px-2 py-1 border border-gray-300 rounded-[8px] hover:cursor-not-allowed"
                    type="text"
                    value={me?.email || ""}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-y-1 w-[40%]">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="phone"
                  >
                    Số điện thoại
                  </label>
                  <input
                    className="px-2 py-1 border border-gray-300 rounded-[8px]"
                    type="text"
                    onChange={(e) => {
                      setAccountInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                      setError((prev) => ({ ...prev, errorPhone: "" }));
                    }}
                    value={accountInfo.phone}
                    placeholder="Nhập số điện thoại"
                  />
                  <span className="text-body-md text-red-500 font-medium">
                    {error.errorPhone}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="flex justify-center w-[35%] px-2 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                >
                  <div className="flex gap-x-2 items-center">
                    <LuSave />
                    Lưu thông tin
                  </div>
                </button>
              </div>
              <hr className="text-gray-300" />
              <p className="text-title-lg text-surface-nav font-medium">
                Đổi mật khẩu
              </p>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="newPassword"
                  >
                    Mật khẩu mới
                  </label>
                  <input
                    className="px-2 py-1 border border-gray-300 rounded-[8px]"
                    type="password"
                    onChange={(e) => {
                      setAccountInfo((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      setError((prev) => ({ ...prev, errorPassword: "" }));
                    }}
                    placeholder="Nhập mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <span className="text-body-md text-red-500 font-medium">
                    {error.errorPassword}
                  </span>
                </div>
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="confirmNewPassword"
                  >
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    className="px-2 py-1 border border-gray-300 rounded-[8px]"
                    type="password"
                    onChange={(e) => {
                      setAccountInfo((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }));
                      setError((prev) => ({
                        ...prev,
                        errorConfirmPassword: "",
                      }));
                    }}
                  />
                  <span className="text-body-md text-red-500 font-medium">
                    {error.errorConfirmPassword}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="flex justify-center w-[35%] px-2 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                >
                  <div className="flex gap-x-2 items-center">
                    <MdLockOutline />
                    Đổi mật khẩu
                  </div>
                </button>
              </div>
            </form>
            {me?.role_id?.role == "instructor" && (
              <form className="flex flex-col gap-y-4 border border-gray-300 rounded-[16px] p-5">
                <p className="text-title-lg text-surface-nav font-medium">
                  Xác minh giảng viên
                </p>
                <div className="flex gap-x-2 items-start p-4 rounded-[8px] bg-blue-50 text-blue-800">
                  <IoIosInformationCircleOutline className="text-title-lg shrink-0" />
                  <div className="flex flex-col gap-y-2 text-title-sm">
                    <p className="font-medium">Xác minh giảng viên</p>
                    <p>
                      Để trở thành giảng viên và có thể quản lý các khóa học,
                      bạn cần gửi ảnh CCCD và ảnh bằng cấp chuyên môn để quản
                      trị viên kiểm tra và duyệt
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2 p-4 border border-gray-300 rounded-[8px]">
                  <div className="flex gap-x-2 items-center text-title-lg text-surface-nav">
                    <FaRegAddressCard />
                    <p className="font-medium">Ảnh CCCD/CMND</p>
                  </div>
                  <div className="flex justify-between text-title-sm font-medium">
                    <div className="flex flex-col gap-y-2 w-[45%]">
                      <p>Ảnh mặt trước</p>
                      {preview.frontIdCardPreview || frontIdCard ? (
                        <div className="relative">
                          <img
                            className="rounded-[16px] opacity-80"
                            src={preview.frontIdCardPreview || frontIdCard}
                            alt=""
                          />
                          {(me?.verified_status === "NOT_VERIFIED" ||
                            me?.verified_status === "REJECTED") && (
                            <div>
                              <label
                                htmlFor="frontIdCard"
                                className="absolute p-2 top-[70px] left-[120px] rounded-[1000px] bg-surface-nav"
                              >
                                <IoCameraOutline className="text-headline-md text-surface-white" />
                              </label>
                              <input
                                onChange={(e) => {
                                  if (
                                    handleValidateFile({
                                      e,
                                      errorField: "errorFrontIdCard",
                                    })
                                  ) {
                                    setFrontIdCard(e.target.files[0]);
                                    handlePreview({
                                      e,
                                      field: "frontIdCardPreview",
                                      errorField: "errorFrontIdCard",
                                    });
                                  }
                                }}
                                id="frontIdCard"
                                className="hidden"
                                type="file"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border-2 border-gray-300 border-dashed p-4 rounded-[8px]">
                          <label htmlFor="frontIdCard" className="text-body-md">
                            <div className="flex gap-x-2 items-center text-brand-blue">
                              <IoCloudUploadOutline />
                              <p>Nhấp để chọn ảnh</p>
                            </div>
                            <p className="text-nav-muted">
                              Định dạng: JPG, PNG, JPEG
                            </p>
                          </label>
                          <input
                            onChange={(e) => {
                              if (
                                handleValidateFile({
                                  e,
                                  errorField: "errorFrontIdCard",
                                })
                              ) {
                                setFrontIdCard(e.target.files[0]);
                                handlePreview({
                                  e,
                                  field: "frontIdCardPreview",
                                  errorField: "errorFrontIdCard",
                                });
                              }
                            }}
                            disabled={
                              me?.verified_status == "PENDING" ||
                              me?.verified_status == "VERIFIED"
                            }
                            id="frontIdCard"
                            type="file"
                            className="hidden"
                          />
                        </div>
                      )}
                      <span className="text-body-md text-red-500 font-medium">
                        {errorImage.errorFrontIdCard}
                      </span>
                    </div>
                    <div className="flex flex-col gap-y-2 w-[45%]">
                      <p className="text-body-lg">Ảnh mặt sau</p>
                      {preview.backIdCardPreview || backIdCard ? (
                        <div className="relative">
                          <img
                            className="rounded-[16px] opacity-80"
                            src={preview.backIdCardPreview || backIdCard}
                            alt=""
                          />
                          {(me?.verified_status === "NOT_VERIFIED" ||
                            me?.verified_status === "REJECTED") && (
                            <div>
                              <label
                                htmlFor="backIdCard"
                                className="absolute p-2 top-[70px] left-[120px] rounded-[1000px] bg-surface-nav"
                              >
                                <IoCameraOutline className="text-headline-md text-surface-white" />
                              </label>
                              <input
                                onChange={(e) => {
                                  if (
                                    handleValidateFile({
                                      e,
                                      errorField: "errorBackIdCard",
                                    })
                                  ) {
                                    setBackIdCard(e.target.files[0]);
                                    handlePreview({
                                      e,
                                      field: "backIdCardPreview",
                                      errorField: "errorBackIdCard",
                                    });
                                  }
                                }}
                                id="backIdCard"
                                className="hidden"
                                type="file"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border-2 border-gray-300 border-dashed p-4 rounded-[8px]">
                          <label htmlFor="backIdCard" className="text-body-md">
                            <div className="flex gap-x-2 items-center text-brand-blue">
                              <IoCloudUploadOutline />
                              <p>Nhấp để chọn ảnh</p>
                            </div>
                            <p className="text-nav-muted">
                              Định dạng: JPG, PNG, JPEG
                            </p>
                          </label>
                          <input
                            onChange={(e) => {
                              if (
                                handleValidateFile({
                                  e,
                                  errorField: "errorBackIdCard",
                                })
                              ) {
                                setBackIdCard(e.target.files[0]);
                                handlePreview({
                                  e,
                                  field: "backIdCardPreview",
                                  errorField: "errorBackIdCard",
                                });
                              }
                            }}
                            disabled={
                              me?.verified_status == "PENDING" ||
                              me?.verified_status == "VERIFIED"
                            }
                            id="backIdCard"
                            type="file"
                            className="hidden"
                          />
                        </div>
                      )}
                      <span className="text-body-md text-red-500 font-medium">
                        {errorImage.errorBackIdCard}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2 p-4 border border-gray-300 rounded-[8px]">
                  <div className="flex gap-x-2 items-center text-title-lg text-surface-nav">
                    <FaGraduationCap />
                    <p className="font-medium">Ảnh bằng cấp chuyên môn</p>
                  </div>
                  {preview.degreeCertificatePreview || degreeCertificate ? (
                    <div className="relative">
                      <img
                        className="rounded-[16px] opacity-80"
                        src={
                          preview.degreeCertificatePreview || degreeCertificate
                        }
                        alt=""
                      />
                      {(me?.verified_status === "NOT_VERIFIED" ||
                        me?.verified_status === "REJECTED") && (
                        <div>
                          <label
                            htmlFor="degreeCertificate"
                            className="absolute p-2 top-[180px] left-[280px] rounded-[1000px] bg-surface-nav"
                          >
                            <IoCameraOutline className="text-headline-md text-surface-white" />
                          </label>
                          <input
                            onChange={(e) => {
                              if (
                                handleValidateFile({
                                  e,
                                  errorField: "errorDegreeCertificate",
                                })
                              ) {
                                setDegreeCertificate(e.target.files[0]);
                                handlePreview({
                                  e,
                                  field: "degreeCertificatePreview",
                                  errorField: "errorDegreeCertificate",
                                });
                              }
                            }}
                            id="degreeCertificate"
                            className="hidden"
                            type="file"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-gray-300 border-dashed p-4 rounded-[8px]">
                      <label
                        htmlFor="degreeCertificate"
                        className="text-body-md"
                      >
                        <div className="flex gap-x-2 items-center text-brand-blue">
                          <IoCloudUploadOutline />
                          <p>Nhấp để chọn ảnh</p>
                        </div>
                        <p className="text-nav-muted">
                          Định dạng: JPG, PNG, JPEG
                        </p>
                      </label>
                      <input
                        onChange={(e) => {
                          if (
                            handleValidateFile({
                              e,
                              errorField: "errorDegreeCertificate",
                            })
                          ) {
                            setDegreeCertificate(e.target.files[0]);
                            handlePreview({
                              e,
                              field: "degreeCertificatePreview",
                              errorField: "errorDegreeCertificate",
                            });
                          }
                        }}
                        disabled={
                          me?.verified_status == "PENDING" ||
                          me?.verified_status == "VERIFIED"
                        }
                        id="degreeCertificate"
                        className="hidden"
                        type="file"
                      />
                    </div>
                  )}
                  <span className="text-body-md text-red-500 font-medium">
                    {errorImage.errorDegreeCertificate}
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={
                      me?.verified_status === "NOT_VERIFIED" ||
                      me?.verified_status === "REJECTED"
                        ? handleSendRequestVerification
                        : me?.verified_status === "PENDING"
                        ? handleCancelRequestVerification
                        : undefined
                    }
                    disabled={me?.verified_status === "VERIFIED"}
                    className={`w-[40%] px-4 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg ${
                      me?.verified_status === "VERIFIED"
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {me?.verified_status === "NOT_VERIFIED"
                      ? "Gửi yêu cầu xác thực"
                      : me?.verified_status === "PENDING"
                      ? "Hủy yêu cầu xác thực"
                      : me?.verified_status === "REJECTED"
                      ? "Gửi lại yêu cầu xác thực"
                      : "Đã xác thực"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {me?.role_id?.role == "user" && <Footer />}
    </>
  );
};
export default MyProfile;
