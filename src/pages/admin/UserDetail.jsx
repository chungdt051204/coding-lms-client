import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { useParams } from "react-router-dom";
import { format } from "../../../helper/format";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { IoBan } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";
import { BsCreditCard } from "react-icons/bs";
import { LuInbox } from "react-icons/lu";

const UserDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const courses = user?.arrayCourse;

  useEffect(() => {
    const getInstructorById = async () => {
      try {
        const result = await userService.getUserById({
          userId: id,
        });
        console.log(result.data);
        setUser(result.data);
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

  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Chi tiết người dùng
          </p>
          <p className="text-title-lg text-nav-muted">
            Xem thông tin người dùng
          </p>
        </div>
        <div className="flex flex-col gap-y-6 lg:flex-row lg:justify-between lg:items-start mt-6">
          <div className="flex flex-col gap-y-4 w-full lg:w-[34%] border border-gray-300 rounded-[16px] p-5">
            <div className="flex flex-col gap-y-1 text-center">
              <img
                className="w-[180px] h-[180px] rounded-[1000px] object-cover mx-auto"
                src={user?.item?.avatar || null}
                alt=""
              />
              <p className="text-title-lg text-surface-nav font-medium">
                {user?.item?.full_name || ""}
              </p>
              <p className="text-title-sm text-nav-muted">
                {user?.item?.email || ""}
              </p>
            </div>
            <div className="flex flex-col gap-y-4 md:flex-row lg:flex-col justify-between">
              <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted w-full md:w-[48%] lg:w-full">
                <FaRegCalendarAlt className="text-title-lg" />
                <div className="flex flex-col gap-y-2 text-title-sm">
                  <p>Ngày tham gia hệ thống</p>
                  <p>{format.formatDate({ date: user?.item?.createdAt })}</p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted w-full md:w-[48%] lg:w-full">
                {user?.item?.status ? (
                  <CiCircleCheck className="text-title-lg" />
                ) : (
                  <IoBan className="text-title-lg" />
                )}
                <div className="flex flex-col gap-y-2 text-title-sm">
                  <p>Trạng thái tài khoản</p>
                  <p
                    className={`px-2 rounded-[8px] text-center text-body-md font-medium ${
                      user?.item?.status
                        ? "bg-green-50 text-green-500"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {user?.item?.status ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-6 w-full lg:w-[64%]">
            <form className="border border-gray-300 rounded-[16px] p-5">
              <p className="text-title-lg text-surface-nav font-medium">
                Thông tin cá nhân
              </p>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-y-2 md:justify-between mt-2">
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
                    value={user?.item?.full_name || ""}
                    readOnly
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
                    value={user?.item?.email || ""}
                    readOnly
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
                    value={user?.item?.phone || ""}
                    readOnly
                  />
                </div>
              </div>
            </form>
            <div className="flex flex-col gap-y-4 md:flex-row md:justify-between">
              <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%]">
                <div className="bg-blue-50 rounded-[8px] p-2">
                  <IoBookOutline className="text-headline-md text-blue-600" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-title-sm text-surface-nav font-medium">
                    Tổng khóa học đã sỡ hữu
                  </p>
                  <p className="text-headline-sm text-surface-nav font-bold">
                    {user?.numberCourse}
                  </p>
                  <p className="text-title-sm text-nav-muted">Khóa học</p>
                </div>
              </div>
              <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%]">
                <div className="bg-orange-50 rounded-[8px] p-2">
                  <BsCreditCard className="text-headline-md text-orange-500" />
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-title-sm text-surface-nav font-medium">
                    Tổng chi tiêu
                  </p>
                  <p className="text-headline-sm text-surface-nav font-bold">
                    {format.formatPrice({ price: user?.totalAmount })}đ
                  </p>
                  <p className="text-title-sm text-nav-muted">Chi tiêu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-title-lg text-surface-nav font-medium mt-10">
          Danh sách khóa học sỡ hữu
        </p>
        {isLoading ? (
          <p className="text-title-lg text-surface-nav text-center">
            Đang tải dữ liệu...
          </p>
        ) : courses?.length == 0 ? (
          <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
            <LuInbox className="text-display-md text-gray-300" />
            <p>Chưa có khóa học nào</p>
          </div>
        ) : (
          <>
            <div className="hidden xl:block w-full overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 overflow-hidden border border-gray-300 rounded-[16px] mt-6">
                <thead>
                  <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                    <td className="w-[30%] p-2">Khóa học</td>
                    <td className="w-[15%]">Danh mục</td>
                    <td className="w-[10%]">Giảng viên</td>
                    <td className="w-[10%]">Giá</td>
                    <td className="w-[15%] p-2 text-center">Trạng thái</td>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((value) => {
                      return (
                        <tr
                          className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg last:border-b-0"
                          key={value?._id}
                        >
                          <td className="flex items-center gap-x-2 w-[30%] p-2">
                            <img
                              className="w-[50px] h-[50px] object-cover rounded-[8px] shrink-0"
                              src={value?.image_url}
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-sm font-medium">
                                {value?.course_name}
                              </p>
                            </div>
                          </td>
                          <td className="w-[15%] text-body-md text-nav-muted">
                            {value?.category_id?.category_name}
                          </td>
                          <td className="text-title-sm text-surface-nav w-[10%]">
                            <p>{value?.user_id?.full_name}</p>
                          </td>
                          <td className="w-[10%] text-brand-blue font-bold text-title-sm">
                            {format.formatPrice({ price: value?.price })}đ
                          </td>
                          <td className="p-2 w-[15%]">
                            <p
                              className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                                value?.status === "draft"
                                  ? "text-surface-nav bg-gray-200"
                                  : value?.status === "pending"
                                  ? "text-yellow-700 bg-yellow-100"
                                  : value?.status === "approved"
                                  ? "text-green-700 bg-green-100"
                                  : "text-red-700 bg-red-100"
                              }`}
                            >
                              {value?.status}
                            </p>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
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
              {courses.length > 0 ? (
                courses.map((value) => {
                  return (
                    <div
                      key={value?._id}
                      className="flex flex-col gap-y-3 p-4 border border-gray-300 rounded-[16px] bg-surface-white shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-x-3">
                        <div className="flex gap-x-3 items-center min-w-0">
                          <img
                            src={value?.image_url}
                            className="w-[80px] h-[80px] rounded-[8px] object-contain shrink-0"
                            alt=""
                          />
                          <div className="min-w-0">
                            <p className="text-surface-nav text-title-lg font-medium break-words">
                              {value?.course_name}
                            </p>
                            <p className="text-nav-muted text-body-lg">
                              {value?.category_id?.category_name}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-body-lg font-medium rounded-[8px] px-2.5 py-1 shrink-0 ${
                            value?.status === "draft"
                              ? "text-surface-nav bg-gray-200"
                              : value?.status === "pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : value?.status === "approved"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          {value?.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 p-2.5 rounded-[12px]">
                        <div className="flex flex-col">
                          <span className="text-caption text-nav-muted">
                            Giảng viên
                          </span>
                          <span className="text-title-sm font-medium text-surface-nav">
                            {value?.user_id?.full_name}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-caption text-nav-muted">
                            Giá khóa học
                          </span>
                          <span className="text-title-sm font-bold text-brand-blue">
                            {format.formatPrice({ price: value?.price })}đ
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
    </>
  );
};
export default UserDetail;
