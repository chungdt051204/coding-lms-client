import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { setCourses, updateCourse } from "../../stores/features/courseSlice";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTrashRestore } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: myCourses, isLoading } = useSelector((state) => state.courses);

  useEffect(() => {
    const getCoursesByInstructor = async () => {
      try {
        const result = await courseService.getCoursesByInstructor();
        console.log(result);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getCoursesByInstructor();
  }, [dispatch]);
  const handleDeleteOrRestoreCourse = async ({ courseId, isVisible }) => {
    try {
      const action = isVisible ? "delete" : "restore";
      const result = await courseService.deleteOrRestoreCourse({
        courseId,
        action,
      });
      console.log(result);
      toast.success(result.message);
      dispatch(updateCourse(result.data));
    } catch (error) {
      const status = error.status;
      const message = error.message;
      console.log(status, message);
    }
  };
  const handleSubmitOrUnSubmitCourse = async ({ courseId, status }) => {
    console.log(courseId, status);
    const statusCourse =
      status === "draft" || status === "rejected" ? "pending" : "draft";
    try {
      const result = await courseService.submitOrUnSubmitCourse({
        courseId,
        status: statusCourse,
      });
      console.log(result);
      dispatch(updateCourse(result.data));
      toast.success(
        result.message || "Đăng tải/Hủy đăng tải khóa học thành công"
      );
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] py-8">
        <div className="flex justify-between items-center w-[95%]">
          <div className="h-[70px] flex flex-col justify-between">
            <p className="text-display-sm text-surface-nav font-bold">
              Quản lý khóa học
            </p>
            <p className="text-title-lg text-nav-muted">
              Tạo và quản lý các khóa học của bạn
            </p>
          </div>
          <button
            onClick={() => navigate("/instructor/course/add")}
            className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
          >
            <FaPlus />
            Tạo khóa học mới
          </button>
        </div>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-gray-300 rounded-[16px] mt-6">
            <thead>
              <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                <td className="w-[36%] p-2">Khóa học</td>
                <td className="w-[10%]">Trạng thái</td>
                <td className="w-[10%] text-center">Học viên</td>
                <td className="w-[15%] text-center">Doanh thu</td>
                <td className="w-[10%]">Đánh giá</td>
                <td className="w-[30%] p-2 text-right">Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {myCourses.length > 0 &&
                myCourses.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg"
                      key={value.course?._id}
                    >
                      <td className="flex items-center gap-x-2 w-[36%] p-2">
                        <img
                          src={value.course?.image_url}
                          width={50}
                          height={50}
                        />
                        <div>
                          <p className="text-surface-nav text-title-lg font-medium">
                            {value.course?.course_name}
                          </p>
                          <p className="text-nav-muted text-body-lg">
                            {value.course?.category_id.category_name}
                          </p>
                        </div>
                      </td>
                      <td className="w-[10%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value.course?.status === "draft"
                              ? "text-surface-nav bg-gray-200"
                              : value.course?.status === "pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : value.course?.status === "approved"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value.course?.status}
                        </p>
                      </td>
                      <td className="flex gap-x-1 items-center w-[10%] ms-8">
                        <RxPeople />
                        <p>{value.numberEnrollment}</p>
                      </td>
                      <td className="w-[15%]"></td>
                      <td className="w-[10%]"></td>
                      <td className="flex justify-end gap-x-2 items-center w-[30%] pe-2">
                        <div className="flex gap-x-1">
                          {value.course?.is_visible && (
                            <div className="p-3 rounded-[8px] text-title-lg transition-transform duration-300 hover:bg-gray-200 hover:cursor-pointer">
                              <IoEyeOutline />
                            </div>
                          )}
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
                              <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                {value.course?.is_visible ? (
                                  <RiDeleteBinLine
                                    className="text-brand-primary"
                                    onClick={() =>
                                      handleDeleteOrRestoreCourse({
                                        courseId: value.course?._id,
                                        isVisible: value.course?.is_visible,
                                      })
                                    }
                                  />
                                ) : (
                                  <FaTrashRestore
                                    className="text-brand-primary"
                                    onClick={() =>
                                      handleDeleteOrRestoreCourse({
                                        courseId: value.course?._id,
                                        isVisible: value.course?.is_visible,
                                      })
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {value.course?.status !== "approved" &&
                          value.course?.is_visible && (
                            <button
                              onClick={() =>
                                handleSubmitOrUnSubmitCourse({
                                  courseId: value.course?._id,
                                  status: value.course?.status,
                                })
                              }
                              className={`px-2 py-1 ${
                                value.course?.status === "pending"
                                  ? "bg-brand-primary"
                                  : "bg-green-700"
                              }  text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer`}
                            >
                              {value.course?.status === "pending"
                                ? "Hủy đăng tải"
                                : value.course?.status === "draft"
                                ? "Đăng tải"
                                : "Đăng tải lại"}
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
export default InstructorCourses;
