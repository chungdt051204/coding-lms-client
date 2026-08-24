import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
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
      <div className="py-24 px-40 bg-surface-white">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Khóa học của tôi
          </p>
          <p className="text-title-lg text-nav-muted">
            Theo dõi tiến độ các khóa học đã đăng ký
          </p>
        </div>
        <div className="flex flex-col gap-6 mt-6">
          {loading ? (
            <p className="text-title-lg text-surface-nav text-center">
              Đang tải dữ liệu...
            </p>
          ) : enrollments?.arrayEnrollment?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Bạn chưa sỡ hữu khóa học nào</p>
            </div>
          ) : (
            enrollments?.arrayEnrollment?.map((value) => {
              const isCompleted = value?.item?.progress_percent == 100;
              return (
                <div
                  className="flex flex-col gap-y-4 p-5 shadow-sm rounded-[16px]"
                  key={value?.item?._id}
                >
                  <div className="flex gap-x-6">
                    <img
                      className="w-[300px] h-[180px] object-cover rounded-[8px]"
                      src={value?.item?.course_id?.thumbnail_url}
                      alt=""
                    />
                    <div className="flex flex-col gap-y-1 w-full">
                      <p className="text-headline-sm text-surface-nav font-medium">
                        {value?.item?.course_id?.course_name}
                      </p>
                      <div className="flex gap-x-1 items-center text-body-lg text-nav-muted">
                        <FiCalendar />
                        <p>Đăng ký:</p>
                        <p>
                          {format.formatDate({ date: value?.item?.createdAt })}
                        </p>
                      </div>
                      <div className="flex flex-col text-body-sm text-nav-muted">
                        <p>Tiến độ bài học</p>
                        <p>
                          {value?.item?.completed_lessons}/
                          {value?.item?.total_lessons}
                        </p>
                        <Progress
                          percent={value?.item?.completed_lessons * 10}
                        />
                      </div>
                      <div className="flex flex-col text-body-sm text-nav-muted">
                        <p>Tiến độ khóa học</p>
                        <Progress percent={value?.item?.progress_percent} />
                      </div>
                    </div>
                  </div>
                  {value?.testResults?.length > 0 && (
                    <div>
                      <div className="flex gap-x-1 items-center text-title-sm text-surface-nav font-medium">
                        <IoDocumentTextOutline />
                        <p>
                          Danh sách kết quả kiểm tra (
                          {value?.testResults?.length})
                        </p>
                      </div>
                      <div className="flex flex-col gap-y-2 mt-4">
                        {value?.testResults?.map((item) => {
                          return (
                            <div
                              key={item._id}
                              className="flex justify-between bg-gray-50 rounded-[16px] px-4 py-2 items-center"
                            >
                              <div className="flex gap-x-4 items-center">
                                <div
                                  className={`py-2 w-[40px] h-[40px] rounded-[1000px] font-bold text-center ${
                                    item?.score >= item?.test_id?.pass_score
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-500"
                                  }`}
                                >
                                  {item?.score}
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-title-sm text-surface-nav font-medium">
                                    {item?.test_id?.test_name}
                                  </p>
                                  <div className="flex gap-x-4 text-body-md text-nav-muted">
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
                                className={`flex gap-x-1 items-center px-2 py-1 rounded-[8px] text-body-md font-medium ${
                                  item?.score >= item?.test_id?.pass_score
                                    ? "bg-green-100 text-green-600 border-green-600"
                                    : "bg-red-100 text-red-600 border-red-600"
                                }`}
                              >
                                {item?.score >= item?.test_id?.pass_score ? (
                                  <FiTarget />
                                ) : (
                                  <VscError />
                                )}
                                {item?.score >= item?.test_id?.pass_score
                                  ? "Đạt"
                                  : "Chưa đạt"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        navigate(`/course/${value?.item?.course_id?._id}`)
                      }
                      className={`flex gap-x-4 items-center  px-16 py-2 rounded-[8px] ${
                        isCompleted
                          ? "bg-nav-muted w-[35%]"
                          : "bg-surface-nav w-[30%]"
                      } text-title-lg text-surface-white font-medium transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg`}
                    >
                      <IoPlayOutline />
                      {isCompleted ? "Xem lại khóa học" : "Tiếp tục học"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
