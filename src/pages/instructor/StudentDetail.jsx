import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { userService } from "../../services/userService";
import { format } from "../../../helper/format";
import { socket } from "../../../socket";
import { toast } from "react-toastify";
import { Progress } from "antd";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { VscError } from "react-icons/vsc";
import PaginationButton from "../../components/PaginationButton";

const StudentDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const { item: me } = useSelector((state) => state.me);
  const [studentInfo, setStudentInfo] = useState(null);
  const [comment, setComment] = useState("");
  const getAverageProgress = () => {
    let sum = 0;
    studentInfo?.totalEnrollments?.forEach((value) => {
      sum = sum + value?.progress_percent;
    });
    return Math.floor(sum / studentInfo?.totalEnrollments?.length);
  };
  useEffect(() => {
    if (id) {
      const getStudentById = async () => {
        try {
          const params = new URLSearchParams(searchParams);
          params.append("limit", 2);
          const result = await userService.getStudentById({
            studentId: id,
            params: params.toString(),
          });
          console.log(result.data);
          setStudentInfo(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getStudentById();
    }
  }, [id, searchParams]);
  const handlePostComment = ({ courseId, courseName }) => {
    if (comment) {
      const data = {
        userId: id,
        senderId: me?._id,
        courseId: courseId,
        type: "COMMENT",
        title: `Giảng viên ${me?.full_name} đã đánh giá về kết quả học tập của bạn trong khóa học ${courseName}`,
        message: comment?.[courseId],
      };
      socket.emit("post-comment", data);
      setComment((prev) => ({ ...prev, [courseId]: "" }));
      toast.success("Gửi đánh giá thành công");
    }
  };
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex gap-x-3 items-center text-title-sm text-nav-muted transition-transform duration-300 hover:text-surface-nav hover:cursor-pointer">
          <FaArrowLeft onClick={() => navigate(-1)} />
          <p className="font-medium">Quay lại danh sách</p>
        </div>
        <div className="bg-auth rounded-t-[16px] h-[100px] mt-6"></div>
        <div className="relative px-6 pt-2 pb-6 flex flex-col gap-y-4 rounded-b-[16px] shadow-sm">
          <img
            className="absolute w-[100px] h-[100px] rounded-[1000px] object-cover top-[-20px]"
            src={studentInfo?.item?.avatar || null}
            alt=""
          />
          <div className="flex flex-col gap-y-2 ms-[120px] w-[50%]">
            <p className="text-headline-md text-surface-nav font-bold wrap-break-word">
              {studentInfo?.item?.full_name || ""}
            </p>
            <p className="text-title-sm text-nav-muted hidden md:block">
              {studentInfo?.item?.email || ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-y-2 justify-between md:flex-row">
            <div className="flex gap-x-1 items-center text-title-sm text-nav-muted">
              <MdOutlineEmail />
              <p>{studentInfo?.item?.email || ""}</p>
            </div>
            <div className="flex gap-x-1 items-center text-title-sm text-nav-muted">
              <FiPhone />
              <p>{studentInfo?.item?.phone || "Không có"}</p>
            </div>
            <div className="flex gap-x-1 items-center text-title-sm text-nav-muted">
              <FiCalendar />
              <p>
                {format.formatDate({
                  date: studentInfo?.item?.createdAt || "",
                })}
              </p>
            </div>
          </div>
          <hr className="text-surface-bg" />
          <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:px-10">
            <div className="flex flex-col gap-y-1 text-center">
              <p className="text-headline-md text-surface-nav font-bold">
                {studentInfo?.totalEnrollments?.length}
              </p>
              <p className="text-body-md text-nav-muted">Khóa học đã đăng ký</p>
            </div>
            <div className="flex flex-col gap-y-1 text-center">
              <p className="text-center text-headline-md text-green-600 font-bold">
                {
                  studentInfo?.totalEnrollments?.filter(
                    (value) => value?.progress_percent == 100
                  )?.length
                }
              </p>
              <p className="text-body-md text-nav-muted">
                Khóa học đã hoàn thành
              </p>
            </div>
            <div className="flex flex-col gap-y-1 text-center">
              <p className="text-center text-headline-md text-blue-500 font-bold">
                {getAverageProgress()}%
              </p>
              <p className="text-body-md text-nav-muted">Tiến độ trung bình</p>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 items-center mt-8 text-title-lg text-surface-nav">
          <IoBookOutline />
          <p className="font-medium">
            Khóa học đã đăng ký ({studentInfo?.arrayEnrollment?.length})
          </p>
        </div>
        <div className="flex flex-col gap-y-6 mt-6">
          {studentInfo?.arrayEnrollment?.map((value) => {
            const isCompleted = value?.item?.progress_percent == 100;
            return (
              <div
                className="flex flex-col gap-y-4 p-5 shadow-sm rounded-[16px]"
                key={value?.item?._id}
              >
                <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-6">
                  <img
                    className="w-full md:w-[300px] h-[180px] object-cover rounded-[8px]"
                    src={value?.item?.course_id?.thumbnail_url}
                    alt=""
                  />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-headline-sm text-surface-nav font-medium wrap-break-word">
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
                      <Progress percent={value?.item?.completed_lessons * 10} />
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
                        Danh sách kết quả kiểm tra ({value?.testResults?.length}
                        )
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
                                <p className="text-title-sm text-surface-nav font-medium wrap-break-word">
                                  {item?.test_id?.test_name}
                                </p>
                                <div className="flex gap-x-14 md:gap-x-4 text-body-md text-nav-muted">
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
                              className={`hidden md:block px-2 py-1 rounded-[8px] text-body-md font-medium ${
                                item?.score >= item?.test_id?.pass_score
                                  ? "bg-green-100 text-green-600 border-green-600"
                                  : "bg-red-100 text-red-600 border-red-600"
                              }`}
                            >
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
                {isCompleted && (
                  <div className="flex justify-between">
                    <input
                      className="px-4 py-2 w-[90%] bg-gray-50 rounded-[8px] outline-none"
                      onChange={(e) =>
                        setComment((prev) => ({
                          ...prev,
                          [value?.item?.course_id?._id]: e.target.value,
                        }))
                      }
                      value={comment?.[value?.item?.course_id?._id] || ""}
                      type="text"
                      placeholder="Nhập đánh giá của bạn"
                    />
                    <button
                      onClick={() =>
                        handlePostComment({
                          courseId: value?.item?.course_id?._id,
                          courseName: value?.item?.course_id?.course_name,
                        })
                      }
                      className="px-4 py-1 bg-surface-nav text-title-lg text-surface-white rounded-[8px] transition-transform hover:cursor-pointer hover:text-surface-bg"
                    >
                      Gửi
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <PaginationButton totalPages={studentInfo?.totalPagesEnrollment} />
        </div>
      </div>
    </>
  );
};
export default StudentDetail;
