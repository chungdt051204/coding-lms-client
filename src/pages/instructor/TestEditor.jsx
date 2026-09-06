import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../../stores/features/courseSlice";
import { courseService } from "../../services/courseService";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";

const TestEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const duration_minutes = [15, 20, 30, 45, 60];
  const pass_scores = [50, 60, 70, 80, 90];
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.items);
  const [testInfo, setTestInfo] = useState({
    testName: "",
    courseId: "",
    durationMinutes: duration_minutes[2],
    passScore: pass_scores[2],
  });
  const [questions, setQuestions] = useState([
    {
      questionContent: "",
      options: [
        { answerContent: "", isCorrect: true },
        { answerContent: "", isCorrect: false },
        { answerContent: "", isCorrect: false },
        { answerContent: "", isCorrect: false },
      ],
      order: 0,
    },
  ]);
  const formattedQuestions =
    questions?.filter(
      (value) =>
        value.questionContent !== "" &&
        !value.options?.some((item) => item.answerContent == "")
    ) || [];
  const [error, setError] = useState({
    errorTestName: "",
    errorCourse: "",
  });
  const [errorQuestion, setErrorQuestion] = useState({});
  const validateQuestion = () => {
    let isValid = true;
    questions?.forEach((value, index) => {
      if (
        (value?.questionContent?.trim() !== "" &&
          value?.options?.some((item) => !item?.answerContent)) ||
        (!value?.questionContent?.trim() &&
          value?.options?.some((item) => item?.answerContent !== ""))
      ) {
        setErrorQuestion((prev) => ({
          ...prev,
          [index]: "Vui lòng nhập đầy đủ nội dung câu hỏi!",
        }));
        isValid = false;
      }
    });
    return isValid;
  };
  useEffect(() => {
    console.log(errorQuestion);
  }, [errorQuestion]);
  useEffect(() => {
    if (id) {
      const getTestById = async () => {
        try {
          const result = await testService.getTestById({ testId: id });
          console.log(result);
          setTestInfo({
            testName: result.data?.test_name || "",
            courseId: result.data?.course_id || "",
            durationMinutes:
              result.data?.duration_minutes || duration_minutes[2],
            passScore: result.data?.pass_score || pass_scores[2],
          });
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
          if (result.data.length > 0) {
            const questionsFormatted = result.data.map((value) => {
              return {
                questionId: value.question._id,
                questionContent: value.question.question_content,
                order: value.question.order,
                options: value.options?.map((value) => {
                  return {
                    optionId: value._id,
                    answerContent: value.answer_content,
                    isCorrect: value.is_correct,
                  };
                }),
              };
            });
            setQuestions(questionsFormatted);
          }
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getQuestionsByTest();
    }
  }, [id]);
  useEffect(() => {
    const getCoursesByInstructor = async () => {
      try {
        const result = await courseService.getCoursesByInstructor({
          params: "",
        });
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
  const handleSave = async (e) => {
    e.preventDefault();
    const testNameRegex = /^[\p{L}\p{N}\s&.+\-_()#/,"';:!?%*]+$/u;
    if (testInfo.testName === "") {
      setError((prev) => ({
        ...prev,
        errorTestName: "Vui lòng nhập tên bài kiểm tra!",
      }));
    } else if (!testNameRegex.test(testInfo.testName)) {
      setError((prev) => ({
        ...prev,
        errorTestName: "Tên bài kiểm tra không được chứa ký tự đặc biệt!",
      }));
    }
    if (testInfo.courseId === "") {
      setError((prev) => ({
        ...prev,
        errorCourse: "Vui lòng chọn khóa học!",
      }));
    } else if (
      courses?.arrayCourse?.find(
        (value) =>
          value?.course?._id == testInfo.courseId && value?.numberTest == 1
      )
    ) {
      setError((prev) => ({
        ...prev,
        errorCourse: "Khóa học này đã có bài kiểm tra!",
      }));
    }
    console.log(validateQuestion());
    if (validateQuestion() == false) return;
    else {
      const formData = {
        testName: testInfo.testName,
        courseId: testInfo.courseId,
        durationMinutes: testInfo.durationMinutes,
        passScore: testInfo.passScore,
        questions: formattedQuestions,
      };
      if (id) {
        try {
          const result = await testService.updateTest({ testId: id, formData });
          toast.success(result.message || "Cập nhật bài kiểm tra thành công");
          navigate("/instructor/tests");
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      } else {
        console.log(formData);
        try {
          const result = await testService.createTest({
            formData,
          });
          toast.success(result.message || "Tạo bài kiểm tra thành công");
          navigate("/instructor/tests");
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
          if (status === 409)
            setError((prev) => ({ ...prev, errorCourse: message }));
        }
      }
    }
  };
  const handleDeleteQuestion = async ({ index }) => {
    const question = questions.find((_, idx) => idx === index);
    if (question.questionId) {
      try {
        const result = await questionService.deleteQuestion({
          questionId: question.questionId,
        });
        toast.success(result.message || "Xóa câu hỏi thành công");
        setQuestions(
          questions?.filter((value) => value.questionId !== question.questionId)
        );
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    } else {
      setQuestions(questions?.filter((_, idx) => idx !== index));
    }
  };
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex flex-col gap-y-1">
          <p className="text-display-sm text-surface-nav font-bold">
            {id ? "Chỉnh sửa thông tin bài kiểm tra" : "Tạo bài kiểm tra mới"}
          </p>
          <p className="text-title-lg text-nav-muted">
            {id
              ? "Chỉnh sửa thông tin bài kiểm tra trắc nghiệm của bạn"
              : "Tạo bài kiểm tra trắc nghiệm cho khóa học của bạn"}
          </p>
        </div>
        <form className="mt-5" onSubmit={handleSave}>
          {/* Test Info */}
          <div className="flex flex-col gap-y-2 border-1 border-surface-bg rounded-[16px] p-5">
            <div className="flex flex-col">
              <p className="text-title-lg text-surface-nav font-medium">
                Thông tin bài kiểm tra
              </p>
              <p className="text-body-lg text-nav-muted">
                Thiết lập các thông tin cơ bản
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <label
                className="text-body-lg text-surface-nav font-medium"
                htmlFor="testName"
              >
                Tên bài kiểm tra
              </label>
              <input
                className="p-2 bg-surface-bg rounded-[8px] truncate"
                value={testInfo.testName}
                onChange={(e) => {
                  setTestInfo((prev) => ({
                    ...prev,
                    testName: e.target.value,
                  }));
                  setError((prev) => ({ ...prev, errorTestName: "" }));
                }}
                type="text"
                placeholder="Bài kiểm tra kết thúc khóa học ReactJS"
              />
              {error.errorTestName && (
                <span className="text-body-md text-red-500">
                  {error.errorTestName}
                </span>
              )}
              <div className="flex flex-col gap-y-2">
                <label
                  className="text-body-lg text-surface-nav font-medium"
                  htmlFor="course"
                >
                  Khóa học
                </label>
                <select
                  className="p-2 bg-surface-white border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                  onChange={(e) => {
                    setTestInfo((prev) => ({
                      ...prev,
                      courseId: e.target.value,
                    }));
                    setError((prev) => ({ ...prev, errorCourse: "" }));
                  }}
                  value={testInfo.courseId}
                >
                  <option value="">Chọn khóa học</option>
                  {courses?.arrayCourse?.map((value) => {
                    return (
                      <option key={value.course._id} value={value.course._id}>
                        {value.course.course_name}
                      </option>
                    );
                  })}
                </select>
                {error.errorCourse && (
                  <span className="text-body-md text-red-500">
                    {error.errorCourse}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-y-2 md:flex-row md:justify-between">
                <div className="flex flex-col gap-y-2 w-full md:w-[45%]">
                  <label
                    className="text-body-lg text-surface-nav font-medium"
                    htmlFor="durationMinutes"
                  >
                    Thời gian làm bài (phút)
                  </label>
                  <select
                    className="p-2 bg-surface-bg border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                    onChange={(e) =>
                      setTestInfo((prev) => ({
                        ...prev,
                        durationMinutes: e.target.value,
                      }))
                    }
                    value={testInfo.durationMinutes}
                  >
                    {duration_minutes?.map((value, index) => {
                      return (
                        <option key={index} value={value}>
                          {`${value} phút`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col gap-y-2 w-full md:w-[45%]">
                  <label
                    className="text-body-lg text-surface-nav font-medium"
                    htmlFor="passScore"
                  >
                    Điểm đạt (%)
                  </label>
                  <select
                    className="p-2 bg-surface-bg border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                    onChange={(e) =>
                      setTestInfo((prev) => ({
                        ...prev,
                        passScore: e.target.value,
                      }))
                    }
                    value={testInfo.passScore}
                  >
                    {pass_scores?.map((value, index) => {
                      return (
                        <option key={index} value={value}>
                          {`${value} %`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Câu hỏi */}
          <div className="mt-5">
            <p className="text-headline-sm text-surface-nav font-medium">
              Câu hỏi ({questions.length})
            </p>
          </div>
          <div className="flex flex-col gap-y-5 mt-5">
            {questions?.map((value, index) => {
              return (
                <div
                  className="flex flex-col gap-y-4 p-5 border-1 border-surface-bg rounded-[16px]"
                  key={index}
                >
                  <div className="flex flex-col gap-y-1 px-4">
                    <div className="flex justify-between text-body-lg text-surface-nav">
                      <p className="font-medium">Câu hỏi {index + 1}</p>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion({ index })}
                        >
                          X
                        </button>
                      )}
                    </div>
                    <textarea
                      className="p-2 bg-surface-bg rounded-[8px]"
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index]["questionContent"] = e.target.value;
                        newQuestions[index]["order"] = index + 1;
                        setQuestions(newQuestions);
                      }}
                      value={questions[index].questionContent}
                      placeholder="Nhập nội dung câu hỏi"
                    />
                  </div>
                  <div className="flex flex-col gap-y-2 text-body-lg text-surface-nav">
                    <p className="font-medium">Đáp án (chọn đáp án đúng)</p>
                    <div className="flex flex-col gap-y-2 ">
                      {value.options?.map((_, idx) => {
                        const options = ["A", "B", "C", "D"];
                        return (
                          <div key={idx} className="flex gap-x-2">
                            <input
                              type="radio"
                              onChange={() => {
                                const newQuestions = [...questions];
                                newQuestions[index].options = newQuestions[
                                  index
                                ].options?.map((option, optionIndex) => ({
                                  ...option,
                                  isCorrect: optionIndex == idx,
                                }));
                                setQuestions(newQuestions);
                              }}
                              checked={questions[index].options[idx].isCorrect}
                            />
                            <input
                              value={
                                questions[index].options[idx].answerContent
                              }
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                const options = newQuestions[index].options;
                                const newOptions = [...options];
                                newOptions[idx].answerContent = e.target.value;
                                newQuestions[index].options = newOptions;
                                setQuestions(newQuestions);
                              }}
                              key={index}
                              className="p-2 bg-surface-bg rounded-[8px] w-full truncate"
                              placeholder={`Đáp án ${options[idx]}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {errorQuestion && (
                    <span className="text-title-sm text-red-500">
                      {errorQuestion[index]}
                    </span>
                  )}
                </div>
              );
            })}
            <div className="flex justify-end px-5">
              <button
                type="button"
                className="w-full md:w-[25%] flex justify-center items-center gap-x-4 p-2 bg-surface-nav text-surface-white text-title-lg rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                onClick={() =>
                  setQuestions((prev) => [
                    ...prev,
                    {
                      questionContent: "",
                      options: [
                        { answerContent: "", isCorrect: true },
                        { answerContent: "", isCorrect: false },
                        { answerContent: "", isCorrect: false },
                        { answerContent: "", isCorrect: false },
                      ],
                      order: 0,
                    },
                  ])
                }
              >
                <FaPlus />
                Thêm câu hỏi
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-surface-nav text-surface-white text-title-lg w-full mt-5 p-2 rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
          >
            Lưu
          </button>
        </form>
      </div>
    </>
  );
};
export default TestEditor;
