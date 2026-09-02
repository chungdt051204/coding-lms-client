import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { enrollmentService } from "../../services/enrollmentService";
import { setEnrollments } from "../../stores/features/enrollmentSlice";
import { Progress } from "antd";
import { IoPlayOutline } from "react-icons/io5";
import { format } from "../../../helper/format";
import { FiCalendar } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { VscError } from "react-icons/vsc";
import { LuInbox } from "react-icons/lu";
import Navbar from "../../components/Navbar";
import PaginationButton from "../../components/PaginationButton";
import Footer from "../../components/Footer";

const MyCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const { items: enrollments, isLoading: loading } = useSelector(
    (state) => state.enrollments
  );
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
    if (!isLoading && me?.role_id?.role !== "user") {
      navigate("/");
      return;
    }
  }, [isLoading, me, navigate]);
  useEffect(() => {
    const getEnrollmentsByUser = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 2);
        const result = await enrollmentService.getEnrollmentsByUser({
          params: params.toString(),
        });
        console.log(result.data);
        dispatch(setEnrollments(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getEnrollmentsByUser();
  }, [dispatch, searchParams]);
  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      <Navbar />
      <div className="py-24 px-4 sm:px-8 md:px-16 xl:px-40 bg-surface-white">
        {/* Header Section */}
        <div className="flex flex-col gap-y-1 sm:gap-y-2 justify-between">
          <p className="text-headline-md sm:text-display-sm text-surface-nav font-bold">
            Khóa học của tôi
          </p>
          <p className="text-body-md sm:text-title-lg text-nav-muted">
            Theo dõi tiến độ các khóa học đã đăng ký
          </p>
        </div>
        {/* Enrollment List */}
        <div className="flex flex-col gap-6 mt-6">
          {loading ? (
            <p className="text-body-lg sm:text-title-lg text-surface-nav text-center py-8">
              Đang tải dữ liệu...
            </p>
          ) : enrollments?.arrayEnrollment?.length === 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-full mt-6 py-12 h-[100vh]">
              <LuInbox className="text-display-md text-gray-300 text-5xl" />
              <p>Bạn chưa sỡ hữu khóa học nào</p>
            </div>
          ) : (
            enrollments?.arrayEnrollment?.map((value) => {
              const isCompleted = value?.item?.progress_percent === 100;
              return (
                <div
                  className="flex flex-col gap-y-4 p-4 sm:p-5 shadow-sm border border-gray-100 rounded-[16px]"
                  key={value?.item?._id}
                >
                  <div className="flex flex-col md:flex-row gap-4 xl:gap-x-6">
                    <img
                      className="w-full md:w-[260px] xl:w-[300px] h-[180px] sm:h-[200px] md:h-[180px] object-cover rounded-[8px] shrink-0"
                      src={value?.item?.course_id?.thumbnail_url}
                      alt=""
                    />
                    <div className="flex flex-col gap-y-2 sm:gap-y-1 w-full justify-between">
                      <p className="text-title-lg sm:text-headline-sm text-surface-nav font-medium line-clamp-2">
                        {value?.item?.course_id?.course_name}
                      </p>

                      <div className="flex gap-x-1.5 items-center text-body-md sm:text-body-lg text-nav-muted">
                        <FiCalendar className="shrink-0" />
                        <p>Đăng ký:</p>
                        <p>
                          {format.formatDate({ date: value?.item?.createdAt })}
                        </p>
                      </div>
                      {/* Progress Bars */}
                      <div className="grid grid-cols-1 gap-3 mt-1">
                        <div className="flex flex-col text-body-sm text-nav-muted">
                          <div className="flex flex-col">
                            <span>Tiến độ bài học</span>
                            <span>
                              {value?.item?.completed_lessons}/
                              {value?.item?.total_lessons}
                            </span>
                          </div>
                          <Progress
                            percent={
                              value?.item?.total_lessons
                                ? (value?.item?.completed_lessons /
                                    value?.item?.total_lessons) *
                                  100
                                : 0
                            }
                          />
                        </div>
                        <div className="flex flex-col text-body-sm text-nav-muted">
                          <p>Tiến độ khóa học</p>
                          <Progress percent={value?.item?.progress_percent} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Test Results Section */}
                  {value?.testResults?.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex gap-x-1.5 items-center text-title-sm text-surface-nav font-medium">
                        <IoDocumentTextOutline className="shrink-0" />
                        <p>
                          Danh sách kết quả kiểm tra (
                          {value?.testResults?.length})
                        </p>
                      </div>
                      <div className="flex flex-col gap-y-2 mt-3">
                        {value?.testResults?.map((item) => {
                          const isPassed =
                            item?.score >= item?.test_id?.pass_score;
                          return (
                            <div
                              key={item._id}
                              className="flex flex-col sm:flex-row justify-between bg-gray-50 rounded-[12px] sm:rounded-[16px] p-3 sm:px-4 sm:py-2 items-start sm:items-center gap-y-3 sm:gap-y-0"
                            >
                              <div className="flex gap-x-3 sm:gap-x-4 items-center w-full sm:w-auto">
                                <div
                                  className={`w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full font-bold flex items-center justify-center shrink-0 text-title-sm ${
                                    isPassed
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-500"
                                  }`}
                                >
                                  {item?.score}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <p className="text-body-md sm:text-title-sm text-surface-nav font-medium truncate">
                                    {item?.test_id?.test_name}
                                  </p>
                                  <div className="flex gap-x-3 text-caption sm:text-body-md text-nav-muted">
                                    <p>
                                      {format.formatDate({
                                        date: item?.submitted_at,
                                      })}
                                    </p>
                                    <p>{item?.score}/100</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`flex gap-x-1 items-center px-2.5 py-1 rounded-[8px] text-caption sm:text-body-md font-medium self-end shrink-0 border ${
                                  isPassed
                                    ? "bg-green-100 text-green-600 border-green-200"
                                    : "bg-red-100 text-red-600 border-red-200"
                                }`}
                              >
                                {isPassed ? <FiTarget /> : <VscError />}
                                <span>{isPassed ? "Đạt" : "Chưa đạt"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Action Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() =>
                        navigate(`/course/${value?.item?.course_id?._id}`)
                      }
                      className={`flex justify-center items-center gap-x-2 sm:gap-x-4 py-2.5 px-6 xl:px-16 rounded-[8px] w-full sm:w-auto ${
                        isCompleted
                          ? "bg-nav-muted xl:w-[35%]"
                          : "bg-surface-nav xl:w-[30%]"
                      } text-title-md xl:text-title-lg text-surface-white font-medium transition-all duration-300 hover:opacity-90 hover:cursor-pointer`}
                    >
                      <IoPlayOutline className="text-xl shrink-0" />
                      <span>
                        {isCompleted ? "Xem lại khóa học" : "Tiếp tục học"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Pagination */}
        {enrollments?.totalPages > 1 && (
          <div className="mt-6">
            <PaginationButton totalPages={enrollments?.totalPages} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
export default MyCourses;
