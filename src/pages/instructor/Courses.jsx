import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { toast } from "react-toastify";
import { format } from "../../../helper/format";
import { socket } from "../../../socket";
import { FaPlus } from "react-icons/fa6";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTrashRestore } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";
import { IoListOutline } from "react-icons/io5";
import { RiDraftLine } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import PaginationButton from "../../components/PaginationButton";
import ConfirmDialog from "../../components/ConfirmDialog";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [myCourses, setMyCourses] = useState([]);
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
      status: "draft",
      title: "Bản nháp",
      icon: <RiDraftLine />,
    },
    {
      status: "pending",
      title: "Đang chờ duyệt",
      icon: <GoClock />,
    },
    {
      status: "approved",
      title: "Đã đăng tải",
      icon: <CiCircleCheck />,
    },
    {
      status: "rejected",
      title: "Bị từ chối",
      icon: <IoWarningOutline />,
    },
    {
      status: "deleted",
      title: "Đã xóa",
      icon: <RiDeleteBinLine />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  const [message, setMessage] = useState("");
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const confirmDialog = useRef();
  useEffect(() => {
    socket.on("course-review-result", async () => {
      setRefresh((prev) => prev + 1);
    });
  }, []);
  useEffect(() => {
    const getCoursesByInstructor = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await courseService.getCoursesByInstructor({
          params: params.toString(),
        });
        console.log(result);
        setMyCourses(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getCoursesByInstructor();
  }, [searchParams, status, refresh]);
  const handleDeleteOrRestoreCourse = async () => {
    try {
      const isVisible = course?.is_visible;
      const action = isVisible ? "delete" : "restore";
      const result = await courseService.deleteOrRestoreCourse({
        courseId: course?._id,
        action,
      });
      console.log(result);
      toast.success(result.message);
      confirmDialog?.current?.close();
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.message;
      console.log(status, message);
    }
  };
  const handleSubmitOrUnSubmitCourse = async () => {
    const status = course?.status;
    const statusCourse =
      status === "draft" || status === "rejected" ? "pending" : "draft";
    try {
      const result = await courseService.submitOrUnSubmitCourse({
        courseId: course?._id,
        status: statusCourse,
      });
      console.log(result);
      toast.success(
        result.message || "Đăng tải/Hủy đăng tải khóa học thành công"
      );
      confirmDialog?.current?.close();
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
        <div className="flex flex-col gap-y-4 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col gap-y-2">
            <p className="text-display-sm text-surface-nav font-bold">
              Quản lý khóa học
            </p>
            <p className="text-title-lg text-nav-muted">
              Tạo và quản lý các khóa học của bạn
            </p>
          </div>
          <button
            onClick={() => navigate("/instructor/course/add")}
            className="flex justify-center items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
          >
            <FaPlus />
            Tạo khóa học mới
          </button>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] overflow-x-auto lg:overflow-x-hidden scroll-smooth">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-gray-600",
              "border-b-2 border-b-yellow-600",
              "border-b-2 border-b-green-600",
              "border-b-2 border-b-red-600",
              "border-b-2 border-b-gray-400",
            ];
            const textColors = [
              "text-blue-600",
              "text-gray-600",
              "text-yellow-600",
              "text-green-600",
              "text-red-600",
              "text-gray-400",
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
          ) : myCourses?.arrayCourse?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có khóa học nào</p>
            </div>
          ) : (
            <>
              <div className="hidden xl:block w-full overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 overflow-hidden border border-gray-300 rounded-[16px] mt-6">
                  <thead>
                    <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                      <td className="w-[35%] p-2">Khóa học</td>
                      <td className="w-[10%]">Trạng thái</td>
                      <td className="w-[10%]">Học viên</td>
                      <td className="w-[10%]">Doanh thu</td>
                      <td className="w-[10%]">Đánh giá</td>
                      <td className="w-[22%] p-2 text-right">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {myCourses?.arrayCourse?.length > 0 &&
                      myCourses?.arrayCourse?.map((value) => {
                        return (
                          <tr
                            className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg last:border-b-0"
                            key={value.course?._id}
                          >
                            <td className="flex items-center gap-x-2 w-[35%] p-2">
                              <img
                                className="w-[50px] h-[50px] object-cover rounded-[8px] shrink-0"
                                src={value.course?.image_url}
                                alt=""
                              />
                              <div>
                                <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                  {value.course?.course_name}
                                </p>
                                <p className="text-nav-muted text-body-lg">
                                  {value.course?.category_id?.category_name}
                                </p>
                              </div>
                            </td>
                            <td className="w-[10%]">
                              <p
                                className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                                  value.course?.status === "draft"
                                    ? "text-surface-nav bg-gray-200"
                                    : value.course?.status === "pending"
                                    ? "text-yellow-700 bg-yellow-100"
                                    : value.course?.status === "approved"
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                {value.course?.status}
                              </p>
                            </td>
                            <td className="flex gap-x-1 items-center ms-8 text-title-sm text-surface-nav w-[10%]">
                              <RxPeople />
                              <p>{value.numberEnrollment}</p>
                            </td>
                            <td className="text-title-sm text-surface-nav font-medium w-[10%]">
                              {value.revenue > 0
                                ? format.formatPrice({ price: value.revenue })
                                : 0}
                              đ
                            </td>
                            <td className="w-[10%] flex gap-x-1 items-center">
                              <FaStar className="text-title-sm text-yellow-300" />
                              <p className="text-title-sm text-surface-nav">
                                {value?.course?.rating_star > 0
                                  ? value?.course?.rating_star
                                  : "0.0"}
                              </p>
                            </td>
                            <td className="flex justify-end gap-x-2 items-center pe-2 w-[22%]">
                              <div className="flex gap-x-1">
                                {(value.course?.status === "draft" ||
                                  value.course?.status === "rejected") && (
                                  <div className="flex gap-x-2">
                                    {value.course?.is_visible && (
                                      <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                        <LuSquarePen
                                          onClick={() =>
                                            navigate(
                                              `/instructor/course/${value.course?._id}/edit`
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                    <div
                                      onClick={() => {
                                        const courseId = value?.course?._id;
                                        const isVisible =
                                          value.course?.is_visible;
                                        const item =
                                          myCourses?.arrayCourse?.find(
                                            (v) => v?.course?._id == courseId
                                          );
                                        setCourse(item?.course);
                                        setIsUpdateStatus(false);
                                        setMessage(
                                          `Bạn có muốn ${
                                            isVisible ? "xóa" : "khôi phục"
                                          } khóa học này không ?`
                                        );
                                        confirmDialog?.current?.showModal();
                                      }}
                                      className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer"
                                    >
                                      {value.course?.is_visible ? (
                                        <RiDeleteBinLine className="text-brand-primary" />
                                      ) : (
                                        <FaTrashRestore className="text-brand-primary" />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {value.course?.status !== "approved" ? (
                                value.course?.is_visible && (
                                  <button
                                    onClick={() => {
                                      const courseId = value?.course?._id;
                                      const status = value.course?.status;
                                      const item = myCourses?.arrayCourse?.find(
                                        (v) => v?.course?._id == courseId
                                      );
                                      if (item?.course?.status == "draft") {
                                        if (
                                          item?.numberLesson == 0 ||
                                          item?.numberTest == 0
                                        ) {
                                          toast.error(
                                            "Khóa học này chưa có bài học hoặc bài kiểm tra, không thể đăng tải!"
                                          );
                                          return;
                                        }
                                      }
                                      setCourse(item?.course);
                                      setIsUpdateStatus(true);
                                      setMessage(
                                        `Bạn có muốn ${
                                          status === "draft" ||
                                          status == "rejected"
                                            ? "đăng tải"
                                            : "hủy đăng tải"
                                        } khóa học này không ?`
                                      );
                                      confirmDialog?.current?.showModal();
                                    }}
                                    className={`px-2 py-1 ${
                                      value.course?.status === "pending"
                                        ? "bg-brand-primary"
                                        : "bg-green-700"
                                    } text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer`}
                                  >
                                    {value.course?.status === "pending"
                                      ? "Hủy đăng tải"
                                      : value.course?.status === "draft"
                                      ? "Đăng tải"
                                      : "Đăng tải lại"}
                                  </button>
                                )
                              ) : (
                                <IoEyeOutline
                                  className="hover:cursor-pointer text-title-lg"
                                  onClick={() =>
                                    navigate(`/course/${value?.course._id}`)
                                  }
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 mt-6 xl:hidden w-full">
                {myCourses?.arrayCourse?.length > 0 ? (
                  myCourses?.arrayCourse?.map((value) => {
                    return (
                      <div
                        key={value.course?._id}
                        className="flex flex-col gap-y-3 p-4 border border-gray-300 rounded-[16px] bg-surface-white shadow-sm"
                      >
                        <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-start md:gap-x-3">
                          <div className="flex gap-x-3 items-center min-w-0">
                            <img
                              src={value.course?.image_url}
                              className="w-[80px] h-[80px] rounded-[8px] object-contain shrink-0"
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                {value.course?.course_name}
                              </p>
                              <p className="text-nav-muted text-body-lg">
                                {value.course?.category_id?.category_name}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-center text-body-md font-medium rounded-[8px] px-2.5 py-1 shrink-0 ${
                              value.course?.status === "draft"
                                ? "text-surface-nav bg-gray-200"
                                : value.course?.status === "pending"
                                ? "text-yellow-700 bg-yellow-100"
                                : value.course?.status === "approved"
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}
                          >
                            {value.course?.status}
                          </span>
                        </div>
                        <div className="flex justify-between rounded-[12px]">
                          <div className="flex flex-col items-center">
                            <span className="text-nav-muted text-body-lg">
                              Học viên
                            </span>
                            <div className="flex items-center gap-x-1 text-title-lg text-surface-nav font-medium mt-0.5">
                              <RxPeople />
                              <p>{value.numberEnrollment}</p>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-nav-muted text-body-lg">
                              Doanh thu
                            </span>
                            <span className="text-title-lg font-bold text-green-600 mt-0.5">
                              {value.revenue > 0
                                ? format.formatPrice({ price: value.revenue })
                                : 0}
                              đ
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-nav-muted text-body-lg">
                              Đánh giá
                            </span>
                            <div className="flex items-center gap-x-1 text-title-lg text-surface-nav font-medium mt-0.5">
                              <FaStar className="text-yellow-300" />
                              <p>
                                {value?.course?.rating_star > 0
                                  ? value?.course?.rating_star
                                  : "0.0"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div className="flex gap-x-1 items-center">
                            {(value.course?.status === "draft" ||
                              value.course?.status === "rejected") && (
                              <div className="flex gap-x-1 items-center">
                                {value.course?.is_visible && (
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/instructor/course/${value.course?._id}/edit`
                                      )
                                    }
                                    className="p-2 rounded-[8px] text-title-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <LuSquarePen />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    const courseId = value?.course?._id;
                                    const isVisible = value.course?.is_visible;
                                    const item = myCourses?.arrayCourse?.find(
                                      (v) => v?.course?._id == courseId
                                    );
                                    setCourse(item?.course);
                                    setIsUpdateStatus(false);
                                    setMessage(
                                      `Bạn có muốn ${
                                        isVisible ? "xóa" : "khôi phục"
                                      } khóa học này không ?`
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                  className="p-2 rounded-[8px] text-title-lg hover:bg-gray-100 transition-colors"
                                >
                                  {value.course?.is_visible ? (
                                    <RiDeleteBinLine className="text-brand-primary" />
                                  ) : (
                                    <FaTrashRestore className="text-brand-primary" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                          <div>
                            {value.course?.status !== "approved" ? (
                              value.course?.is_visible && (
                                <button
                                  onClick={() => {
                                    const courseId = value?.course?._id;
                                    const status = value.course?.status;
                                    const item = myCourses?.arrayCourse?.find(
                                      (v) => v?.course?._id == courseId
                                    );
                                    if (item?.course?.status == "draft") {
                                      if (
                                        item?.numberLesson == 0 ||
                                        item?.numberTest == 0
                                      ) {
                                        toast.error(
                                          "Khóa học này chưa có bài học hoặc bài kiểm tra, không thể đăng tải!"
                                        );
                                        return;
                                      }
                                    }
                                    setCourse(item?.course);
                                    setIsUpdateStatus(true);
                                    setMessage(
                                      `Bạn có muốn ${
                                        status === "draft" ||
                                        status == "rejected"
                                          ? "đăng tải"
                                          : "hủy đăng tải"
                                      } khóa học này không ?`
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                  className={`px-3 py-1.5 ${
                                    value.course?.status === "pending"
                                      ? "bg-brand-primary"
                                      : "bg-green-700"
                                  } text-body-lg text-surface-white font-medium rounded-[8px] transition-transform hover:cursor-pointer`}
                                >
                                  {value.course?.status === "pending"
                                    ? "Hủy đăng tải"
                                    : value.course?.status === "draft"
                                    ? "Đăng tải"
                                    : "Đăng tải lại"}
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() =>
                                  navigate(`/course/${value?.course._id}`)
                                }
                                className="flex items-center gap-x-1 text-body-lg text-brand-blue font-medium hover:cursor-pointer"
                              >
                                <IoEyeOutline className="text-title-lg" />
                                <span>Xem chi tiết</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-body-lg text-nav-muted border border-gray-200 rounded-[16px]">
                    Chưa có khóa học nào
                  </div>
                )}
              </div>
            </>
          )}
          {myCourses?.totalPages > 1 && (
            <PaginationButton totalPages={myCourses?.totalPages} />
          )}
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={
          isUpdateStatus
            ? handleSubmitOrUnSubmitCourse
            : handleDeleteOrRestoreCourse
        }
      />
    </>
  );
};
export default InstructorCourses;
