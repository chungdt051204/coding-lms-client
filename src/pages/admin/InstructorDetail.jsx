import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "../../../helper/format";
import { toast } from "react-toastify";
import { validateForm } from "../../../helper/validateForm";
import { IoListOutline } from "react-icons/io5";
import { RiDraftLine } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoShieldCheck } from "react-icons/go";
import { IoBookOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { BsCreditCard } from "react-icons/bs";
import { LuInbox } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { IoBan } from "react-icons/io5";
import image from "../../assets/default_image.png";

const InstructorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [instructor, setInstructor] = useState(null);
  const [instructorInfo, setInstructorInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    level: "",
    experience: "",
    frontIdCard: null,
    backIdCard: null,
    degreeCertificate: null,
  });
  const courses = instructor?.arrayCourse;
  const levels = ["Cử nhân", "Thạc sĩ", "Tiến sĩ"];
  const [error, setError] = useState({ errorLevel: "", errorExperience: "" });
  const filterTabs = [
    {
      status: "",
      title: "Tất cả khóa học",
      icon: <IoListOutline />,
      numberCourse: courses?.filter((value) => value?.item?.is_visible)?.length,
    },
    {
      status: "draft",
      title: "Bản nháp",
      icon: <RiDraftLine />,
      numberCourse: courses?.filter(
        (value) => value?.item?.is_visible && value?.item?.status == "draft"
      )?.length,
    },
    {
      status: "pending",
      title: "Đang chờ duyệt",
      icon: <GoClock />,
      numberCourse: courses?.filter(
        (value) => value?.item?.is_visible && value?.item?.status == "pending"
      )?.length,
    },
    {
      status: "approved",
      title: "Đã đăng tải",
      icon: <CiCircleCheck />,
      numberCourse: courses?.filter(
        (value) => value?.item?.is_visible && value?.item?.status == "approved"
      )?.length,
    },
    {
      status: "deleted",
      title: "Đã xóa",
      icon: <RiDeleteBinLine />,
      numberCourse: courses?.filter((value) => !value?.item?.is_visible)
        ?.length,
    },
  ];
  const [idx, setIdx] = useState(0);
  const currentStatus = filterTabs[idx].status;
  const displayCourses = courses?.filter((value) => {
    if (currentStatus == "") return value?.item?.is_visible;
    else if (currentStatus == "deleted") return !value?.item?.is_visible;
    else return value?.item?.is_visible && value?.item?.status == currentStatus;
  });
  useEffect(() => {
    const getInstructorById = async () => {
      try {
        const result = await userService.getInstructorById({
          instructorId: id,
        });
        console.log(result.data);
        setInstructor(result.data);
        setInstructorInfo((prev) => ({
          ...prev,
          fullName: result.data?.item?.full_name || "",
          email: result.data?.item?.email || "",
          phone: result.data?.item?.phone || "",
          avatar: result.data?.item?.avatar || "",
          level: result.data?.item?.level || "",
          experience: result.data?.item?.experience || "",
          frontIdCard: result?.data?.item?.front_id_card || null,
          backIdCard: result?.data?.item?.back_id_card || null,
          degreeCertificate: result?.data?.item?.degree_certificate || null,
        }));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getInstructorById();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      level: instructorInfo.level,
      experience: instructorInfo.experience,
    };
    if (
      !validateForm.validateUserForm({
        formData,
        setError,
      })
    ) {
      return;
    }
    try {
      const result = await userService.updateInstructorInfo({
        instructorId: id,
        formData,
      });
      toast.success(
        result.message || "Cập nhật thông tin giảng viên thành công"
      );
      navigate("/admin/instructors");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Chi tiết giảng viên
          </p>
          <p className="text-title-lg text-nav-muted">
            Quản lý thông tin giảng viên
          </p>
        </div>
        <div className="flex flex-col gap-y-4 lg:flex-row lg:justify-between lg:items-start mt-6">
          <div className="flex flex-col gap-y-4 w-full lg:w-[34%] border border-gray-300 rounded-[16px] p-5">
            <div className="flex flex-col gap-y-1 text-center">
              <img
                className="w-[180px] h-[180px] rounded-[1000px] object-cover mx-auto"
                src={instructorInfo.avatar}
              />
              <p className="text-title-lg text-surface-nav font-medium">
                {instructorInfo.fullName}
              </p>
              <p className="text-title-sm text-nav-muted">
                {instructorInfo.email}
              </p>
            </div>
            <div className="flex flex-col gap-y-4 md:flex-row md:justify-between lg:flex-col">
              <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted w-full md:w-[31%] lg:w-full">
                <FaRegCalendarAlt className="text-title-lg" />
                <div className="flex flex-col gap-y-2 text-title-sm">
                  <p>Ngày tham gia hệ thống</p>
                  <p>
                    {format.formatDate({ date: instructor?.item?.createdAt })}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted w-full md:w-[31%] lg:w-full">
                {instructor?.item?.status ? (
                  <CiCircleCheck className="text-title-lg" />
                ) : (
                  <IoBan className="text-title-lg" />
                )}
                <div className="flex flex-col gap-y-2 text-title-sm">
                  <p>Trạng thái tài khoản</p>
                  <p
                    className={`px-2 rounded-[8px] text-center text-body-md font-medium ${
                      instructor?.item?.status
                        ? "bg-green-100 text-green-500"
                        : "bg-orange-100 text-red-500"
                    }`}
                  >
                    {instructor?.item?.status
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted w-full md:w-[31%] lg:w-full">
                <GoShieldCheck className="text-title-lg" />
                <div className="flex flex-col gap-y-2 text-title-sm">
                  <p>Trạng thái xác thực</p>
                  <p
                    className={`px-2 rounded-[8px] text-center text-body-md font-medium ${
                      instructor?.item?.verified_status === "NOT_VERIFIED"
                        ? "bg-orange-100 text-orange-500"
                        : instructor?.item?.verified_status === "PENDING"
                        ? "bg-gray-100 text-gray-500"
                        : instructor?.item?.verified_status === "REJECTED"
                        ? "bg-red-100 text-red-500"
                        : "bg-green-100 text-green-500"
                    }`}
                  >
                    {instructor?.item?.verified_status === "NOT_VERIFIED"
                      ? "Chưa xác thực"
                      : instructor?.item?.verified_status === "PENDING"
                      ? "Chờ xác thực"
                      : instructor?.item?.verified_status === "REJECTED"
                      ? "Bị từ chối"
                      : "Đã xác thực"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-4 w-full lg:w-[64%] border border-gray-300 rounded-[16px] p-5"
          >
            <p className="text-title-lg text-surface-nav font-medium">
              Thông tin cá nhân
            </p>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-y-2 md:justify-between">
              <div className="flex flex-col gap-y-2 w-full md:w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="fullName"
                >
                  Họ và tên
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="text"
                  value={instructorInfo.fullName}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 w-full md:w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="text"
                  value={instructorInfo.email}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-y-2 w-full md:w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="phone"
                >
                  Số điện thoại
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="text"
                  value={instructorInfo.phone}
                  disabled
                />
              </div>
            </div>
            {instructor?.item?.verified_status === "VERIFIED" && (
              <div className="flex flex-col gap-y-4">
                <hr />
                <p className="text-title-lg text-surface-nav font-medium">
                  Thông tin giảng viên
                </p>
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-col gap-y-2 md:flex-row md:justify-between">
                    <div className="flex flex-col gap-y-2 w-full md:w-[30%]">
                      <label
                        className="text-title-sm text-surface-nav font-medium"
                        htmlFor="level"
                      >
                        Trình độ
                      </label>
                      <select
                        className="border border-gray-300 rounded-[8px] px-2 py-1 text-title-sm text-nav-muted"
                        onChange={(e) => {
                          setInstructorInfo((prev) => ({
                            ...prev,
                            level: e.target.value,
                          }));
                          setError((prev) => ({ ...prev, errorLevel: "" }));
                        }}
                        value={instructorInfo.level}
                      >
                        <option value="">Chọn trình độ</option>
                        {levels?.map((value, index) => {
                          return (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          );
                        })}
                      </select>
                      <span className="text-body-md text-red-500 font-medium">
                        {error.errorLevel}
                      </span>
                    </div>
                    <div className="flex flex-col gap-y-2 w-full md:w-[65%]">
                      <label
                        className="text-title-sm text-surface-nav font-medium"
                        htmlFor="experience"
                      >
                        Kinh nghiệm giảng dạy (năm)
                      </label>
                      <input
                        className="px-2 py-1 border border-gray-300 rounded-[8px]"
                        type="text"
                        onChange={(e) => {
                          setInstructorInfo((prev) => ({
                            ...prev,
                            experience: e.target.value,
                          }));
                          setError((prev) => ({
                            ...prev,
                            errorExperience: "",
                          }));
                        }}
                        value={instructorInfo.experience}
                        placeholder="Nhập số năm"
                      />
                      <span className="text-body-md text-red-500 font-medium">
                        {error.errorExperience}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  className="px-2 py-1 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                  type="submit"
                  value="Lưu thay đổi"
                />
              </div>
            )}
          </form>
        </div>
        <div className="flex flex-col gap-y-4 rounded-[16px]  p-4 border border-gray-300 rounded-[16px] mt-6">
          <p className="text-title-lg text-surface-nav font-medium">
            Thông tin xác thực{" "}
            {instructor?.item?.verified_status === "NOT_VERIFIED" &&
              "(chưa có thông tin)"}
          </p>
          <div className="flex flex-col gap-y-2 p-4 border border-gray-300 rounded-[8px]">
            <div className="flex gap-x-2 items-center text-title-lg text-surface-nav">
              <FaRegAddressCard />
              <p className="font-medium">Ảnh CCCD/CMND</p>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between text-title-sm font-medium">
              <div className="flex flex-col gap-y-2 w-full md:w-[45%]">
                <p>Ảnh mặt trước</p>
                <img
                  className="rounded-[16px] opacity-80 h-[250px] md:h-[200px] lg:h-[250px]"
                  src={instructorInfo.frontIdCard || image}
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-y-2 w-full md:w-[45%]">
                <p className="text-body-lg">Ảnh mặt sau</p>
                <img
                  className="rounded-[16px] opacity-80 h-[250px] md:h-[200px] lg:h-[250px]"
                  src={instructorInfo.backIdCard || image}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 p-4 border border-gray-300 rounded-[8px]">
            <div className="flex gap-x-2 items-center text-title-lg text-surface-nav">
              <FaGraduationCap />
              <p className="font-medium">Ảnh bằng cấp chuyên môn</p>
            </div>
            <img
              className="rounded-[16px] opacity-80 h-[300px] md:h-[400px]"
              src={instructorInfo.degreeCertificate || image}
              alt=""
            />
          </div>
        </div>
        {instructor?.item?.verified_status === "VERIFIED" && (
          <div>
            <div className="flex flex-wrap justify-between gap-6 lg:gap-4 mt-10">
              <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%]">
                <div className="bg-blue-50 rounded-[8px] p-2">
                  <IoBookOutline className="text-headline-md text-blue-600" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-title-sm text-surface-nav font-medium">
                    Tổng số khóa học đã tạo
                  </p>
                  <p className="text-headline-sm text-surface-nav font-bold">
                    {instructor?.numberCourse}
                  </p>
                  <p className="text-title-sm text-nav-muted">Khóa học</p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%]">
                <div className="bg-green-50 rounded-[8px] p-2">
                  <RxPeople className="text-headline-md text-green-600" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-title-sm text-surface-nav font-medium">
                    Tổng lượt đăng ký học
                  </p>
                  <p className="text-headline-sm text-surface-nav font-bold">
                    {instructor?.numberEnrollment}
                  </p>
                  <p className="text-title-sm text-nav-muted">Lượt đăng ký</p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%]">
                <div className="bg-red-50 rounded-[8px] p-2">
                  <FiDollarSign className="text-headline-md text-red-500" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-title-sm text-surface-nav font-medium">
                    Tổng doanh thu kiếm được
                  </p>
                  <p className="text-headline-sm text-surface-nav font-bold">
                    {format.formatPrice({ price: instructor?.totalRevenue })}đ
                  </p>
                  <p className="text-title-sm text-nav-muted">Doanh thu</p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%]">
                <div className="bg-orange-50 rounded-[8px] p-2">
                  <BsCreditCard className="text-headline-md text-orange-500" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-title-sm text-surface-nav font-medium">
                    Tổng lợi nhuận thu được
                  </p>
                  <p className="text-headline-sm text-surface-nav font-bold">
                    {instructor?.item?.balance > 0
                      ? format.formatPrice({ price: instructor?.item?.balance })
                      : 0}
                    đ
                  </p>
                  <p className="text-title-sm text-nav-muted">Lợi nhuận</p>
                </div>
              </div>
            </div>
            <p className="text-title-lg text-surface-nav font-medium mt-10">
              Danh sách khóa học đã tạo
            </p>
            <div className="flex mt-6 border border-gray-300 rounded-[8px] mt-6 overflow-x-auto lg:overflow-x-hidden scroll-smooth">
              {filterTabs?.map((value, index) => {
                const borderBottomColors = [
                  "border-b-2 border-b-blue-600",
                  "border-b-2 border-b-gray-600",
                  "border-b-2 border-b-yellow-600",
                  "border-b-2 border-b-green-600",
                  "border-b-2 border-b-red-600",
                ];
                const textColors = [
                  "text-blue-600",
                  "text-gray-600",
                  "text-yellow-600",
                  "text-green-600",
                  "text-red-600",
                ];
                return (
                  <div
                    className={`flex justify-center sm:justify-start py-4 shrink-0 sm:w-auto hover:cursor-pointer ${
                      idx == index && borderBottomColors[index]
                    }`}
                    onClick={() => setIdx(index)}
                    key={index}
                  >
                    <div
                      className={`flex gap-x-2 items-center px-3 sm:px-6 text-title-sm font-medium ${
                        idx == index ? textColors[index] : "text-nav-muted"
                      }`}
                    >
                      {value.icon}
                      <p>{value.title}</p>
                      <p>({value.numberCourse})</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {isLoading ? (
              <p className="text-title-lg text-surface-nav text-center">
                Đang tải dữ liệu...
              </p>
            ) : displayCourses?.length == 0 ? (
              <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
                <LuInbox className="text-display-md text-gray-300" />
                <p>Chưa có khóa học nào</p>
              </div>
            ) : (
              <>
                <div className="hidden xl:block w-full overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0 overflow-hidden border border-gray-300 rounded-[16px] mt-6">
                    <thead>
                      <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200 bg-gray-50/50">
                        <td className="w-[30%] p-2">Khóa học</td>
                        <td className="w-[15%]">Danh mục</td>
                        <td className="w-[10%]">Học viên</td>
                        <td className="w-[10%]">Doanh thu</td>
                        <td className="w-[10%]">Giá</td>
                        <td className="w-[15%] p-2 text-center">Trạng thái</td>
                      </tr>
                    </thead>
                    <tbody>
                      {displayCourses.length > 0 ? (
                        displayCourses.map((value) => {
                          return (
                            <tr
                              className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg last:border-b-0"
                              key={value?.item?._id}
                            >
                              <td className="flex items-center gap-x-2 w-[30%] p-2">
                                <img
                                  className="w-[50px] h-[50px] object-cover rounded-[8px] shrink-0"
                                  src={value?.item?.image_url}
                                  alt=""
                                />
                                <div>
                                  <p className="text-surface-nav text-title-sm font-medium">
                                    {value?.item?.course_name}
                                  </p>
                                </div>
                              </td>
                              <td className="w-[15%] text-body-md text-nav-muted">
                                {value?.item?.category_id?.category_name}
                              </td>
                              <td className="text-title-sm text-surface-nav w-[10%]">
                                <p>{value.numberStudent}</p>
                              </td>
                              <td className="text-title-sm text-green-600 w-[10%] font-bold">
                                {format.formatPrice({ price: value.revenue })}đ
                              </td>
                              <td className="w-[10%] text-brand-blue font-bold text-title-sm">
                                {format.formatPrice({
                                  price: value?.item?.price,
                                })}
                                đ
                              </td>
                              <td className="p-2 w-[15%]">
                                <p
                                  className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                                    value?.item?.status === "draft"
                                      ? "text-surface-nav bg-gray-200"
                                      : value?.item?.status === "pending"
                                      ? "text-yellow-700 bg-yellow-100"
                                      : value?.item?.status === "approved"
                                      ? "text-green-700 bg-green-100"
                                      : "text-red-700 bg-red-100"
                                  }`}
                                >
                                  {value?.item?.status}
                                </p>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-6 text-nav-muted"
                          >
                            Chưa có khóa học nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-4 mt-6 xl:hidden w-full">
                  {displayCourses.length > 0 ? (
                    displayCourses.map((value) => {
                      return (
                        <div
                          key={value?.item?._id}
                          className="flex flex-col gap-y-3 p-4 border border-gray-300 rounded-[16px] bg-surface-white shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-x-3">
                            <div className="flex gap-x-3 items-center min-w-0">
                              <img
                                src={value?.item?.image_url}
                                className="w-[80px] h-[80px] rounded-[8px] object-contain shrink-0"
                                alt=""
                              />
                              <div className="min-w-0">
                                <p className="text-surface-nav text-title-lg font-medium break-words">
                                  {value?.item?.course_name}
                                </p>
                                <p className="text-nav-muted text-body-lg">
                                  {value?.item?.category_id?.category_name}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-body-lg font-medium rounded-[8px] px-2.5 py-1 shrink-0 ${
                                value?.item?.status === "draft"
                                  ? "text-surface-nav bg-gray-200"
                                  : value?.item?.status === "pending"
                                  ? "text-yellow-700 bg-yellow-100"
                                  : value?.item?.status === "approved"
                                  ? "text-green-700 bg-green-100"
                                  : "text-red-700 bg-red-100"
                              }`}
                            >
                              {value?.item?.status}
                            </span>
                          </div>
                          <div className="flex justify-between px-4 pt-3 border-t border-gray-100 rounded-[12px]">
                            <div className="flex flex-col">
                              <span className="text-caption text-nav-muted">
                                Học viên
                              </span>
                              <span className="text-title-sm font-semibold text-surface-nav">
                                {value.numberStudent}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-caption text-nav-muted">
                                Giá khóa học
                              </span>
                              <span className="text-title-sm font-bold text-brand-blue">
                                {format.formatPrice({
                                  price: value?.item?.price,
                                })}
                                đ
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-caption text-nav-muted">
                                Doanh thu
                              </span>
                              <span className="text-title-sm font-bold text-green-600">
                                {format.formatPrice({ price: value.revenue })}đ
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-nav-muted border border-gray-200 rounded-[16px]">
                      Chưa có khóa học nào
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default InstructorDetail;
