import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { testService } from "../services/testService";
import { questionService } from "../services/questionService";
import { Progress } from "antd";
import { toast } from "react-toastify";
import { testResultService } from "../services/testResultService";
import Navbar from "../components/Navbar";
import { GoClock } from "react-icons/go";
import { FiFlag } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import Footer from "../components/Footer";
const TestDetail = () => {
  const navigate = useNavigate();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const isAdmin = me?.role_id?.role === "admin";
  const isInstructor = me?.role_id?.role === "instructor";
  const { courseId } = useParams();
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];
  const [selectedOptionIds, setSelectedOptionIds] = useState({});
  const answeredQuestions = Object.keys(selectedOptionIds)?.length; //Object.key biến Object thành mảng dựa vào key
  const currentProgress = Math.floor(
    (answeredQuestions / questions?.length) * 100
  );
  const [clicked, setClicked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (id) {
      const getTestById = async () => {
        try {
          const result = await testService.getTestById({ testId: id });
          console.log(result.data);
          setTest(result.data);
          setTimer((prev) => ({
            ...prev,
            minutes: result.data?.duration_minutes,
          }));
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getTestById();
      const getQuestionsByTest = async () => {
        try {
          const result = await questionService.getQuestionsByTest({
            testId: id,
          });
          console.log(result.data);
          setQuestions(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getQuestionsByTest();
      const getTestResultsByTest = async () => {
        try {
          const result = await testResultService.getTestResultsByTest({
            testId: id,
          });
          console.log(result.data);
          const passedTestResult = result.data?.find(
            (value) => value.score >= value?.test_id?.pass_score
          );
          if (passedTestResult)
            navigate(
              `/course/${courseId}/test/${id}/result/${passedTestResult?._id}`
            );
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getTestResultsByTest();
    }
  }, [id, courseId, navigate]);

  const handleStart = () => {
    setClicked(true);
    setStartedAt(Date.now());
    setInterval(() => {
      setTimer((prev) => {
        if (prev.minutes == 0 && prev.seconds == 0) return prev;
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { minutes: prev.minutes - 1, seconds: 59 };
      });
    }, 1000);
  };
  const handleSubmit = async () => {
    if (!isLoading && (isAdmin || isInstructor)) {
      toast.warning(
        "Giảng viên và quản trị viên chỉ được test chức năng, không được nộp bài!"
      );
      return;
    }
    setSubmitted(true);
    const data = {
      testId: id,
      startedAt,
      submittedAt: Date.now(),
      selectedOptionIds,
    };
    try {
      const result = await testResultService.createTestResult({ data });
      navigate(`/course/${courseId}/test/${id}/result/${result.data?._id}`);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  useEffect(() => {
    if (clicked) {
      if (timer.minutes == 0 && timer.seconds == 10) {
        toast.warning(
          "Sắp hết giờ làm bài, hệ thống sẽ tự động nộp bài khi hết giờ"
        );
      }
    }
  }, [clicked, timer.minutes, timer.seconds]);
  useEffect(() => {
    if (clicked) {
      if (timer.minutes == 0 && timer.seconds == 0) {
        if (!submitted) {
          handleSubmit();
        }
      }
    }
  }, [clicked, submitted, timer.minutes, timer.seconds]);
  if (isLoading) return <div className="text-center">Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 py-18">
        <div className="flex flex-col gap-y-2 py-5 px-24 bg-surface-white">
          <div className="flex justify-between">
            <p className="text-headline-md text-surface-nav font-bold">
              {test?.test_name || ""}
            </p>
            <div className="flex gap-x-4">
              <div className="flex gap-x-2 items-center py-2 px-4 rounded-[8px] bg-blue-100 text-headline-sm text-blue-700 font-bold">
                <GoClock />
                <p>
                  {String(timer.minutes).padStart(2, "0")}:
                  {String(timer.seconds).padStart(2, "0")}
                </p>
              </div>
              <button
                onClick={clicked ? handleSubmit : handleStart}
                className={`flex gap-x-2 items-center py-1 px-4 border rounded-[8px] text-title-sm font-medium transition-transform duration-300 hover:cursor-pointer ${
                  !clicked
                    ? "bg-surface-nav text-surface-white hover:text-surface-bg"
                    : "bg-surface-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                {clicked && <FiFlag />}
                {clicked ? "Nộp bài" : "Bắt đầu làm bài"}
              </button>
            </div>
          </div>
          <p className="text-title-sm text-nav-muted">
            Đã trả lời {answeredQuestions}/{questions?.length}
          </p>
          <Progress style={{ fontSize: 16 }} percent={currentProgress} />
        </div>
        <div className="py-6 px-24">
          <div className="border border-gray-300 rounded-[16px] p-8 bg-surface-white">
            <div className="flex justify-between">
              <p className="text-body-md font-medium text-purple-700 px-3 py-1 bg-purple-100 rounded-[8px]">
                Câu {currentIndex + 1}/{questions?.length}
              </p>
              {currentQuestion?.options?.some(
                (item) =>
                  item?._id == selectedOptionIds[currentQuestion?.question?._id]
              ) && (
                <div className="flex gap-x-1 items-center text-body-md font-medium text-green-700 px-3 py-1 bg-green-100 rounded-[8px]">
                  <CiCircleCheck />
                  <p>Đã trả lời</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-6 mt-4">
              <p className="text-headline-sm text-surface-nav font-bold">
                {currentQuestion?.question?.question_content || ""}
              </p>
              <div className="flex flex-col gap-y-2">
                {currentQuestion?.options?.map((value) => {
                  return (
                    <div key={value._id}>
                      <div
                        className={`flex gap-x-2 border-2 rounded-[8px] p-4 transition-transform duration-300 hover:border-blue-200 ${
                          selectedOptionIds[currentQuestion?.question?._id] ==
                          value._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <input
                          checked={
                            selectedOptionIds[currentQuestion?.question?._id] ==
                            value._id
                          }
                          onChange={() => {
                            if (!clicked) {
                              toast.warning(
                                "Vui lòng nhấn bắt đầu làm bài kiểm tra!"
                              );
                              return;
                            }
                            setSelectedOptionIds((prev) => ({
                              ...prev,
                              [currentQuestion?.question?._id]: value._id,
                            }));
                          }}
                          type="radio"
                        />
                        <p className="text-surface-nav text-title-sm font-medium">
                          {value.answer_content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  if (!clicked) {
                    toast.warning("Vui lòng ấn bắt đầu làm bài kiểm tra!");
                    return;
                  }
                  setCurrentIndex(currentIndex - 1);
                }}
                disabled={currentIndex == 0}
                className={`flex gap-x-2 items-center px-4 py-1 border border-gray-200 rounded-[8px] text-title-sm font-medium ${
                  currentIndex == 0
                    ? "text-nav-muted hover:cursor-not-allowed"
                    : "text-surface-nav transition-transform duration-300 hover:cursor-pointer hover:bg-surface-bg"
                }`}
              >
                <FaArrowLeft />
                <p> Câu trước</p>
              </button>
              <div className="flex gap-x-2">
                {questions?.map((value, index) => {
                  return (
                    <div
                      onClick={() => {
                        if (!clicked) {
                          toast.warning(
                            "Vui lòng ấn bắt đầu làm bài kiểm tra!"
                          );
                          return;
                        }
                        setCurrentIndex(index);
                      }}
                      key={index}
                      className={`px-4 py-2 rounded-[8px] text-title-sm font-medium transition-transform duration-300 hover:cursor-pointer ${
                        value?.options?.some(
                          (item) =>
                            item?._id == selectedOptionIds[value?.question?._id]
                        )
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : currentIndex == index
                          ? "bg-brand-blue text-surface-white"
                          : "bg-surface-bg hover:bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  if (!clicked) {
                    toast.warning("Vui lòng ấn bắt đầu làm bài kiểm tra!");
                    return;
                  }
                  setCurrentIndex(currentIndex + 1);
                }}
                disabled={currentIndex == questions?.length - 1}
                className={`flex gap-x-2 items-center px-4 py-1 rounded-[8px] text-title-sm text-surface-white font-medium ${
                  currentIndex == questions?.length - 1
                    ? "bg-gray-400 hover:cursor-not-allowed"
                    : "bg-surface-nav transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
                }`}
              >
                <p>Câu sau</p>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default TestDetail;
