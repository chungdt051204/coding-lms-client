import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enrollmentService } from "../services/enrollmentService";
import { useNavigate, useParams } from "react-router-dom";
import { setEnrollments } from "../stores/features/enrollmentSlice";
import { lessonService } from "../services/lessonService";
import { lessonProgressService } from "../services/lessonProgressService";
import { IoPlayCircleOutline } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import ReactPlayer from "react-player";
import { FaCheck } from "react-icons/fa6";
import { Navbar } from "../components/Navbar";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
const LessonDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { item: me, isLoading: loading } = useSelector((state) => state.me);
  const isAdmin = me?.role_id?.role === "admin";
  const isInstructor = me?.role_id?.role === "instructor";
  const { items: enrollments, isLoading } = useSelector(
    (state) => state.enrollments
  );
  const { courseId, id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [lessonProgresses, setLessonProgresses] = useState([]);
  const currentTime = Number(
    lessonProgresses.find((value) => value.lesson_id._id == id)?.current_time
  );
  const enrolledCourse = enrollments?.arrayEnrollment?.find(
    (value) => value?.item?.course_id?._id == courseId
  );
  const numberAccessLesson =
    enrolledCourse?.item?.access_level == "LIMITED"
      ? (lessons?.length * 50) / 100
      : enrolledCourse?.item?.access_level == "UNLIMITED"
      ? lessons?.length
      : 0;
  const playerRef = useRef();
  const secondToTime = (second) => {
    if (second < 60) return `00:${second}`;
    if (second >= 60 && second < 3600)
      return `${Math.floor(second / 60)}:${second % 60}`;
    if (second >= 3600)
      return `${Math.floor(second / 3600)}:${Math.floor(
        (second % 3600) / 60
      )}:${(second % 3600) % 60}`;
  };
  useEffect(() => {
    console.log(numberAccessLesson);
  }, [numberAccessLesson]);
  useEffect(() => {
    if (!enrolledCourse && !isLoading && !isAdmin && !isInstructor) {
      navigate("/");
      return;
    }
  }, [enrolledCourse, navigate, isLoading, isAdmin, isInstructor]);
  useEffect(() => {
    if (!loading && !isAdmin && !isInstructor) {
      const getEnrollmentsByUser = async () => {
        try {
          const result = await enrollmentService.getEnrollmentsByUser({
            params: {},
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
    }
    if (courseId) {
      const getLessonsByCourse = async () => {
        try {
          const result = await lessonService.getLessonsByCourse({ courseId });
          console.log(result.data);
          setLessons(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getLessonsByCourse();
    }
  }, [courseId, dispatch, isAdmin, isInstructor, loading]);
  useEffect(() => {
    const getLessonById = async () => {
      try {
        const result = await lessonService.getLessonById({
          lessonId: id,
          courseId,
        });
        console.log(result.data);
        setLesson(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getLessonById();
  }, [courseId, id]);
  useEffect(() => {
    if (!loading && !isAdmin && !isInstructor) {
      const getLessonProgressesByUser = async () => {
        try {
          const result =
            await lessonProgressService.getLessonProgressesByUser();
          console.log(result.data);
          setLessonProgresses(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getLessonProgressesByUser();
    }
  }, [isAdmin, isInstructor, loading]);
  useEffect(() => {
    const index = lessons?.findIndex((value) => value?._id == id);
    if (
      index < lessons?.length - 1 &&
      lessonProgresses?.some(
        (value) =>
          value?.lesson_id?._id == lessons[index]?._id && value?.is_completed
      )
    ) {
      navigate(`/course/${courseId}/lesson/${lessons[index + 1]?._id}`);
    }
  }, [courseId, id, lessonProgresses, lessons, navigate]);
  const createLessonProgress = async () => {
    if (!loading && !isAdmin && !isInstructor) {
      if (!lessonProgresses?.some((value) => value.lesson_id._id == id)) {
        try {
          const result = await lessonProgressService.createLessonProgress({
            lessonId: id,
          });
          console.log(result.data);
          console.log(result.message || "Tạo tiến độ bài học thành công");
          setLessonProgresses((prev) => [...prev, result.data]);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      }
    }
  };
  const updateLessonProgress = async () => {
    if (!loading && !isAdmin && !isInstructor) {
      const currentTime = playerRef?.current?.currentTime;
      if (currentTime) {
        try {
          const result = await lessonProgressService.updateLessonProgress({
            lessonId: id,
            currentTime: Math.floor(currentTime),
          });
          console.log(result.message || "Cập nhật tiến độ bài học thành công");
          const newLessonProgresses = [...lessonProgresses];
          const index = newLessonProgresses.findIndex(
            (value) => value.lesson_id._id == id
          );
          newLessonProgresses[index] = result.data;
          setLessonProgresses(newLessonProgresses);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex py-24">
        <div className="flex flex-col gap-y-2 w-[60%]">
          <div className="h-[450px] bg-surface-nav py-8 px-10">
            <ReactPlayer
              onStart={() => {
                if (!isAdmin && !isInstructor)
                  playerRef.current.currentTime = currentTime;
              }}
              onPlay={createLessonProgress}
              onProgress={updateLessonProgress}
              ref={playerRef}
              width={680}
              height={400}
              src={lesson?.video_url || null}
              controls={isAdmin || isInstructor}
            />
          </div>
          <div className="flex gap-x-2 px-10 text-surface-nav">
            <p className="text-headline-md font-bold">
              Bài {lesson?.order || ""}
            </p>
            <p className="text-headline-md font-bold">
              {lesson?.lesson_name || ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col w-[40%] gap-y-4 px-8">
          <div className="flex justify-between">
            <p className="text-title-lg text-surface-nav font-medium">
              Nội dung khóa học
            </p>
            <p className="text-title-sm text-surface-nav">
              {lessons.length} bài học
            </p>
          </div>
          <ul className="p-4 border border-gray-300 rounded-[16px]">
            {lessons?.map((value, index) => {
              const currentProgress = lessonProgresses?.find(
                (item) => item.lesson_id?._id == value._id
              );
              const isCompleted = currentProgress?.is_completed;
              const prevLesson = lessons[index - 1];
              //Bài học chỉ có thể xem khi là bài học đầu tiên hoặc bài học phía trước đã hoàn thành
              const accessLesson =
                isAdmin ||
                value.order == 1 ||
                (prevLesson &&
                  lessonProgresses?.some(
                    (item) =>
                      item.lesson_id._id == prevLesson?._id && item.is_completed
                  ));
              return (
                <li
                  onClick={() => {
                    if (isCompleted) {
                      toast.success("Bài học này đã hoàn thành!");
                      return;
                    } else if (!accessLesson) {
                      toast.warning("Bạn chưa hoàn thành bài học trước!");
                      return;
                    }
                    navigate(`/course/${courseId}/lesson/${value._id}`);
                  }}
                  key={value._id}
                  className={`flex justify-between ${
                    isCompleted || accessLesson
                      ? "hover:cursor-pointer"
                      : "hover:cursor-not-allowed"
                  }`}
                >
                  <div className="flex flex-col">
                    <p className="text-body-lg text-surface-nav font-medium">
                      {value.lesson_name}
                    </p>
                    <div className="flex gap-x-1 items-center">
                      <IoPlayCircleOutline className="text-title-lg text-brand-blue" />
                      <p className="text-body-lg text-nav-muted">
                        {secondToTime(value.duration)}
                      </p>
                    </div>
                  </div>
                  {isCompleted ? (
                    <FaCheck className="text-green-500 text-title-lg" />
                  ) : accessLesson ? (
                    <IoPlayCircleOutline className="text-title-lg text-brand-blue" />
                  ) : (
                    <IoIosLock
                      className={`text-title-lg ${
                        value.order <= numberAccessLesson
                          ? "text-brand-blue"
                          : "text-surface-nav"
                      } `}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {me?.role_id?.role === "user" && <Footer />}
    </>
  );
};
export default LessonDetail;
