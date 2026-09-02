import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { testResultService } from "../services/testResultService";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TestResult = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { testId } = useParams();
  const { id } = useParams();
  const [testResult, setTestResult] = useState(null);
  const passed =
    testResult?.item?.score >= testResult?.item?.test_id?.pass_score;
  const getTimeSpent = () => {
    if (testResult) {
      const durationInSeconds =
        (new Date(testResult?.item?.submitted_at) -
          new Date(testResult?.item?.started_at)) /
        1000;
      return `${String(Math.floor(durationInSeconds / 60)).padStart(
        2,
        "0"
      )}:${String(Math.floor(durationInSeconds % 60)).padStart(2, "0")}`;
    }
    return `0:00`;
  };
  useEffect(() => {
    if (id) {
      const getTestResultById = async () => {
        try {
          const result = await testResultService.getTestResultById({
            testResultId: id,
          });
          console.log(result.data);
          setTestResult(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getTestResultById();
    }
  }, [id]);
  return (
    <>
      <Navbar />
      <div className="py-24 bg-surface-bg h-[800px] md:h-[640px] lg:h-[100vh]">
        <div className="flex flex-col gap-y-4 w-[90%] items-center mx-auto p-8 border border-gray-300 bg-surface-white rounded-[16px]">
          <div
            className={`p-4 rounded-[1000px] ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {passed ? (
              <FaRegCheckCircle className="text-display-md text-green-600" />
            ) : (
              <FaRegTimesCircle className="text-display-md text-red-600" />
            )}
          </div>
          <p className="text-headline-md text-surface-nav font-bold">
            {!passed ? "Chưa đạt yêu cầu" : "Chúc mừng! Bạn đã đạt"}
          </p>
          <p className="text-title-sm text-nav-muted">
            {!passed
              ? `Bạn cần tối thiểu ${testResult?.item?.test_id?.pass_score} % để hoàn thành bài kiểm tra`
              : "Bạn đã hoàn thành bài kiểm tra với kết quả xuất sắc!"}
          </p>
          <div className="flex flex-col gap-y-4 md:flex-row md:justify-between w-full">
            <div className="flex flex-col gap-y-1 w-full md:w-[32%] text-center py-4 bg-blue-50 rounded-[8px]">
              <p className="text-headline-md text-blue-600 font-bold">
                {testResult?.item?.score} %
              </p>
              <p className="text-title-lg text-nav-muted">Điểm số</p>
            </div>
            <div className="flex flex-col gap-y-2 w-full md:w-[32%] text-center py-4 bg-green-50 rounded-[8px]">
              <p className="text-headline-md text-green-600 font-bold">
                {testResult?.item?.number_answer_correct}/
                {testResult?.numberQuestion}
              </p>
              <p className="text-title-lg text-nav-muted">Câu đúng</p>
            </div>
            <div className="flex flex-col gap-y-2 w-full md:w-[32%] text-center py-4 bg-purple-50 rounded-[8px]">
              <p className="text-headline-md text-purple-600 font-bold">
                {getTimeSpent()}
              </p>
              <p className="text-title-lg text-nav-muted">Thời gian làm bài</p>
            </div>
          </div>
          <div className="flex gap-x-6 mt-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="py-2 px-6 border border-gray-300 rounded-[8px] text-title-sm text-surface-nav font-medium transition-transform duration-300 hover:cursor-pointer hover:bg-surface-bg"
            >
              Quay về khóa học
            </button>
            {!passed && (
              <button
                onClick={() => navigate(`/course/${courseId}/test/${testId}`)}
                className="py-2 px-6 rounded-[8px] text-title-sm text-surface-white font-medium bg-surface-nav transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
              >
                Làm lại
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default TestResult;
