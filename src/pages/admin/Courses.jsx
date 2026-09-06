import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { courseService } from "../../services/courseService";
import { toast } from "react-toastify";
import { socket } from "../../../socket";
import { RxPeople } from "react-icons/rx";
import { IoListOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { IoBan } from "react-icons/io5";
import ConfirmDialog from "../../components/ConfirmDialog";
import PaginationButton from "../../components/PaginationButton";

const AdminCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả khóa học",
      icon: <IoListOutline />,
    },
    {
      status: "pending",
      title: "Đang chờ duyệt",
      icon: <GoClock />,
    },
    {
      status: "approved",
      title: "Đã duyệt",
      icon: <CiCircleCheck />,
    },
    {
      status: "rejected",
      title: "Từ chối",
      icon: <IoBan />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  const [message, setMessage] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const confirmDialog = useRef();
  const [isRejected, setIsRejected] = useState(false);
  const [reason, setReason] = useState("");
  const rejectDialog = useRef();
  useEffect(() => {
    socket.on("course-review", async () => {
      setRefresh((prev) => prev + 1);
    });
  }, []);
  useEffect(() => {
    const getCoursesByAdmin = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await courseService.getCoursesByAdmin({
          params: params.toString(),
        });
        console.log(result);
        setCourses(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getCoursesByAdmin();
  }, [searchParams, status, refresh]);

  const handleApproveOrRejectCourse = async () => {
    if (isRejected) {
      confirmDialog?.current?.close();
      rejectDialog?.current?.showModal();
    } else if (isApproved) {
      try {
        const result = await courseService.approveOrRejectCourse({
          courseId: course?._id,
          status: isApproved ? "approved" : "rejected",
          data: { message: reason },
        });
        toast.success(result.message || "Duyệt khóa học thành công");
        confirmDialog?.current?.close();
        setRefresh((prev) => prev + 1);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    }
  };
  const handleRejectedCourse = async () => {
    try {
      const result = await courseService.approveOrRejectCourse({
        courseId: course?._id,
        status: isApproved ? "approved" : "rejected",
        data: { message: reason },
      });
      toast.success(result.message || "Từ chối khóa học thành công");
      rejectDialog?.current?.close();
      setIsRejected(false);
      setReason("");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="h-[70px] flex flex-col justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý khóa học
          </p>
          <p className="text-title-lg text-nav-muted">
            Phê duyệt khóa học của giảng viên
          </p>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] overflow-x-auto scroll-smooth">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-yellow-600",
              "border-b-2 border-b-green-600",
              "border-b-2 border-b-red-600",
            ];
            const textColors = [
              "text-blue-600",
              "text-yellow-600",
              "text-green-600",
              "text-red-600",
            ];
            return (
              <div
                className={`flex justify-center sm:justify-start py-4 shrink-0 sm:w-auto hover:cursor-pointer ${
                  idx == index && borderBottomColors[index]
                }`}
                onClick={() => {
                  setIdx(index);
                  setStatus(value.status);
                }}
                key={index}
              >
                <div
                  className={`flex gap-x-2 items-center px-3 sm:px-6 text-title-sm font-medium ${
                    idx == index ? textColors[index] : "text-nav-muted"
                  }`}
                >
                  {value.icon}
                  <p>{value.title}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-y-6">
          {isLoading ? (
            <p className="text-title-lg text-surface-nav text-center mt-2">
              Đang tải dữ liệu...
            </p>
          ) : courses?.arrayCourse?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có khóa học nào</p>
            </div>
          ) : (
            <>
              <div className="hidden xl:block w-full">
                <table className="w-full border-separate border-spacing-0 overflow-hidden border border-surface-bg rounded-[16px] mt-6">
                  <thead>
                    <tr className="flex items-center justify-between text-surface-nav font-medium">
                      <td className="w-[35%] p-2">Khóa học</td>
                      <td className="w-[20%]">Giảng viên</td>
                      <td className="w-[16%]">Học viên</td>
                      <td className="w-[9%]">Trạng thái</td>
                      <td className="w-[20%] p-2 text-right">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {courses?.arrayCourse?.length > 0 ? (
                      courses?.arrayCourse?.map((value) => {
                        return (
                          <tr
                            className="flex justify-between items-center border-t border-surface-bg hover:bg-surface-bg"
                            key={value?.course._id}
                          >
                            <td className="flex items-center gap-x-2 w-[35%] p-2">
                              <img
                                src={value?.course.image_url}
                                width={50}
                                height={50}
                                className="rounded-[8px] object-cover"
                                alt=""
                              />
                              <div>
                                <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                  {value?.course.course_name}
                                </p>
                                <p className="text-nav-muted text-body-lg">
                                  {value?.course.category_id.category_name}
                                </p>
                              </div>
                            </td>
                            <td className="w-[20%] text-title-sm text-surface-nav font-medium wrap-break-word">
                              {value?.course.user_id.full_name}
                            </td>
                            <td className="flex gap-x-1 items-center w-[15%] text-title-sm text-surface-nav">
                              <RxPeople />
                              <p>{value.numberEnrollment}</p>
                            </td>
                            <td className="w-[10%]">
                              <p
                                className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                                  value?.course.status === "pending"
                                    ? "text-yellow-700 bg-yellow-100"
                                    : value?.course.status === "approved"
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                {value?.course.status}
                              </p>
                            </td>
                            <td className="flex justify-end gap-x-2 items-center w-[20%] pe-2">
                              {value?.course.status === "pending" && (
                                <div className="flex items-center gap-x-2">
                                  <button
                                    onClick={() => {
                                      const courseId = value?.course?._id;
                                      const item = courses?.arrayCourse?.find(
                                        (v) => v?.course?._id === courseId
                                      );
                                      setIsApproved(true);
                                      setCourse(item?.course);
                                      setMessage(
                                        "Bạn có muốn duyệt khóa học này không ?"
                                      );
                                      confirmDialog?.current?.showModal();
                                    }}
                                    className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                                  >
                                    Duyệt
                                  </button>
                                  <button
                                    onClick={() => {
                                      const courseId = value?.course?._id;
                                      const item = courses?.arrayCourse?.find(
                                        (v) => v?.course?._id === courseId
                                      );
                                      setIsApproved(false);
                                      setIsRejected(true);
                                      setCourse(item?.course);
                                      setMessage(
                                        "Bạn có muốn từ chối khóa học này không ?"
                                      );
                                      confirmDialog?.current?.showModal();
                                    }}
                                    className="px-2 py-1 bg-brand-primary text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                                  >
                                    Từ chối
                                  </button>
                                </div>
                              )}
                              <IoEyeOutline
                                className="hover:cursor-pointer text-title-lg"
                                onClick={() =>
                                  navigate(`/course/${value?.course._id}`)
                                }
                              />
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
                {courses?.arrayCourse?.length > 0 ? (
                  courses?.arrayCourse?.map((value) => {
                    return (
                      <div
                        key={value?.course._id}
                        className="flex flex-col gap-y-3 p-4 border border-surface-bg rounded-[16px] bg-surface-white shadow-sm"
                      >
                        <div className="flex flex-col gap-y-2 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-x-3 items-center">
                            <img
                              src={value?.course.image_url}
                              className="w-[80px] h-[80px] rounded-[8px] object-contain shrink-0"
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                {value?.course.course_name}
                              </p>
                              <p className="text-nav-muted text-body-lg">
                                {value?.course.category_id.category_name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-center text-body-sm font-medium rounded-[8px] px-2 py-1 shrink-0 ${
                              value?.course.status === "pending"
                                ? "text-yellow-700 bg-yellow-100"
                                : value?.course.status === "approved"
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}
                          >
                            {value?.course.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-y-1 md:flex-row md:justify-between text-title-sm text-surface-nav pt-2 border-t border-surface-bg">
                          <p className="font-medium">
                            Giang viên:{" "}
                            <span className="text-nav-muted wrap-break-word">
                              {value?.course.user_id.full_name}
                            </span>
                          </p>
                          <div className="flex gap-x-1 items-center">
                            <RxPeople />
                            <p>{value.numberEnrollment} học viên</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-y-2 md:flex-row md:justify-between pt-2 border-t border-surface-bg">
                          <div
                            onClick={() =>
                              navigate(`/course/${value?.course._id}`)
                            }
                            className="flex gap-x-1 items-center text-body-lg text-brand-blue hover:cursor-pointer font-medium"
                          >
                            <IoEyeOutline />
                            <span>Xem chi tiết</span>
                          </div>
                          {value?.course.status === "pending" && (
                            <div className="flex gap-x-2 font-medium">
                              <button
                                onClick={() => {
                                  const courseId = value?.course?._id;
                                  const item = courses?.arrayCourse?.find(
                                    (v) => v?.course?._id === courseId
                                  );
                                  setIsApproved(true);
                                  setCourse(item?.course);
                                  setMessage(
                                    "Bạn có muốn duyệt khóa học này không ?"
                                  );
                                  confirmDialog?.current?.showModal();
                                }}
                                className="px-3 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] hover:cursor-pointer"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => {
                                  const courseId = value?.course?._id;
                                  const item = courses?.arrayCourse?.find(
                                    (v) => v?.course?._id === courseId
                                  );
                                  setIsApproved(false);
                                  setIsRejected(true);
                                  setCourse(item?.course);
                                  setMessage(
                                    "Bạn có muốn từ chối khóa học này không ?"
                                  );
                                  confirmDialog?.current?.showModal();
                                }}
                                className="px-3 py-1 bg-brand-primary text-body-lg text-surface-white rounded-[8px] hover:cursor-pointer"
                              >
                                Từ chối
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-nav-muted border border-surface-bg rounded-[16px]">
                    Chưa có khóa học nào
                  </div>
                )}
              </div>
            </>
          )}
          {courses?.totalPages > 1 && (
            <PaginationButton totalPages={courses?.totalPages} />
          )}
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={handleApproveOrRejectCourse}
      />
      <dialog
        ref={rejectDialog}
        className="w-[480px] p-4 m-auto rounded-[8px] shadow-lg"
      >
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full outline-none p-2 rounded-[8px] text-body-lg border border-gray-300"
          type="text"
          placeholder="Nhập lý do từ chối"
        />
        <div className="flex flex-col items-end mt-4">
          <div className="flex gap-x-4 text-title-sm">
            <button
              className="px-6 py-2 border border-gray-300 rounded-[8px] transition-transform duration-300 hover:cursor-pointer"
              onClick={() => {
                setIsRejected(false);
                rejectDialog?.current?.close();
                confirmDialog?.current?.showModal();
              }}
            >
              Hủy
            </button>
            <button
              className="px-6 py-2 bg-blue-600 rounded-[8px] text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              onClick={handleRejectedCourse}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default AdminCourses;
