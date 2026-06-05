import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { lessonService } from "../../services/lessonService";
import Navbar from "../../components/Navbar";
import { FaStar } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";
import { IoBookOutline } from "react-icons/io5";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";
import { enrollmentService } from "../../services/enrollmentService";
import { toast } from "react-toastify";
import {
  createEnrollment,
  setEnrollments,
} from "../../stores/features/enrollmentSlice";
import { lessonProgressService } from "../../services/lessonProgressService";
import { cartService } from "../../services/cartService";
import { addToCart } from "../../stores/features/cartSlice";

const CourseDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enrollments = useSelector((state) => state.enrollments.items);
  const { isLogin } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonProgresses, setLessonProgresses] = useState([]);

  const enrolledCourse = enrollments?.find((value) => value.course_id == id);
  const myCart = useSelector((state) => state.cart);
  const courseInCart = myCart.items?.some((value) => value.course_id._id == id);

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
    const getCourseById = async () => {
      try {
        const result = await courseService.getCourseById({ courseId: id });
        console.log(result.data);
        setCourse(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getCourseById();
    const getLessonsByCourse = async () => {
      try {
        const result = await lessonService.getLessonsByCourse({ courseId: id });
        setLessons(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getLessonsByCourse();
    const getEnrollmentsByUser = async () => {
      try {
        const result = await enrollmentService.getEnrollmentsByUser();
        console.log(result.data);
        dispatch(setEnrollments(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getEnrollmentsByUser();
  }, [id, dispatch]);
  useEffect(() => {
    const getLessonProgressesByUser = async () => {
      try {
        const result = await lessonProgressService.getLessonProgressesByUser();
        console.log(result.data);
        setLessonProgresses(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getLessonProgressesByUser();
  }, []);

  const handleCreateEnrollment = async () => {
    if (!isLogin) {
      toast.warning("Bạn chưa đăng nhập!");
      return;
    }
    try {
      const result = await enrollmentService.createEnrollment({ courseId: id });
      dispatch(createEnrollment(result.data));
      toast.success(result.message || "Đăng ký học khóa học thành công");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleAddToCart = async () => {
    if (!isLogin) {
      toast.warning("Bạn chưa đăng nhập!");
      return;
    }
    if (courseInCart) {
      toast.warning("Khóa học này đã có trong giỏ hàng!");
      return;
    }
    try {
      const result = await cartService.addToCart({ courseId: id });
      console.log(result.data);
      dispatch(addToCart(result.data));
      toast.success(result.message || "Thêm khóa học vào giỏ hàng thành công");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <Navbar />
      <div>
        {/* Box 1 */}
        <div className="flex flex-col justify-between h-[1100px] bg-primary-purple px-28 py-12">
          <div className="flex flex-col justify-between h-[30%]">
            <div className="flex gap-x-2 text-title-lg text-surface-white">
              <div className="px-3 bg-primary-purple-light rounded-[8px]">
                {course?.category_id.category_name || ""}
              </div>
              <div className="px-3 bg-primary-purple-light rounded-[8px]">
                {course?.level || ""}
              </div>
            </div>
            <p className="text-display-lg text-surface-white font-medium">
              {course?.course_name || ""}
            </p>
            <p className="text-headline-sm text-surface-bg">
              {course?.description || ""}
            </p>
            <div className="flex gap-x-8 text-headline-sm text-surface-white">
              <div className="flex items-center gap-x-1">
                <FaStar className="text-yellow-300" />
                <p>0.0 (0 đánh giá)</p>
              </div>
              <div className="flex items-center gap-x-1">
                <RxPeople className="text-surface-white" />
                <p>0 học viên</p>
              </div>
            </div>
            <div className="flex gap-x-4">
              <img
                className="w-[60px] h-[60px] object-cover rounded-[1000px]"
                src={course?.user_id?.avatar || null}
              />
              <div className="flex flex-col">
                <p className="text-title-lg text-surface-bg">Giảng viên</p>
                <p className="text-headline-sm text-surface-white font-medium">
                  {course?.user_id?.full_name || ""}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-[65%] bg-surface-white rounded-[16px] p-8">
            <img
              className="w-full h-[400px] object-fill rounded-[16px]"
              src={course?.thumbnail_url || null}
              alt=""
            />
            <p className="text-display-md text-brand-blue font-medium">
              {course?.is_free ? 0 : course?.price}đ
            </p>
            {!enrolledCourse && (
              <button
                onClick={
                  course?.is_free ? handleCreateEnrollment : handleAddToCart
                }
                className="bg-surface-nav py-2 text-headline-sm text-surface-white rounded-[8px] transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
              >
                {course?.is_free
                  ? "Đăng ký học ngay"
                  : courseInCart
                  ? "Đã thêm vào giỏ hàng"
                  : "Thêm vào giỏ hàng"}
              </button>
            )}
            <div className="flex flex-col">
              <div className="flex gap-x-2 items-center text-headline-sm">
                <IoBookOutline className="text-nav-muted" />
                <p>{lessons?.length + " " + "bài học"}</p>
              </div>
              <div className="flex gap-x-2 items-center text-headline-sm">
                <IoPlayCircleOutline className="text-nav-muted" />
                <p>Truy cập trọn đời</p>
              </div>
            </div>
          </div>
        </div>
        {/* Box 2 */}
        <div className=" bg-surface-bg px-28 py-10">
          {/* Yêu cầu */}
          <div className="flex flex-col gap-y-4 px-8 py-4 bg-surface-white border border-gray-300 rounded-[16px]">
            <p className="text-headline-md text-surface-nav font-medium">
              Yêu cầu
            </p>
            <ul className="flex flex-col gap-y-2">
              {course?.requirements?.map((value, index) => {
                return (
                  <li key={index} className="flex gap-x-1 items-center">
                    <p className="text-brand-blue">✓</p>
                    {value}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Kết quả đạt được */}
          <div className="flex flex-col gap-y-4 px-8 py-4 mt-8 bg-surface-white border border-gray-300 rounded-[16px]">
            <p className="text-headline-md text-surface-nav font-medium">
              Bạn sẽ học được gì ?
            </p>
            <ul className="flex flex-col gap-y-2">
              {course?.objectives?.map((value, index) => {
                return (
                  <li key={index} className="flex gap-x-1 items-center">
                    <FaCheck className="text-green-500" />
                    {value}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Nội dung khóa học */}
          <div className="flex flex-col gap-y-4 px-8 py-4 mt-8 bg-surface-white border border-gray-300 rounded-[16px]">
            <div className="flex justify-between">
              <p className="text-headline-md text-surface-nav font-medium">
                Nội dung khóa học
              </p>
              <p className="text-title-sm text-surface-nav font-medium">
                {lessons.length + " " + "bài học"}
              </p>
            </div>
            <ul className="flex flex-col gap-y-2">
              {lessons?.map((value, index) => {
                const isCompleted = lessonProgresses?.some(
                  (item) => item.lesson_id._id == value._id && item.is_completed
                );
                const prevLesson = lessons[index - 1];
                const accessLesson =
                  (enrolledCourse && value.order == 1) ||
                  (prevLesson &&
                    lessonProgresses?.some(
                      (item) =>
                        item.lesson_id._id == prevLesson?._id &&
                        item.is_completed
                    ));
                return (
                  <li
                    onClick={() => {
                      if (!enrolledCourse) {
                        toast.warning("Bạn chưa sỡ hữu khóa học này!");
                        return;
                      } else if (isCompleted) {
                        toast.success("Bài học này đã hoàn thành!");
                        return;
                      } else if (!accessLesson) {
                        toast.warning("Bạn chưa hoàn thành bài học trước!");
                        return;
                      } else navigate(`/course/${id}/lesson/${value._id}`);
                    }}
                    key={value._id}
                    className={`flex justify-between items-center p-4 border border-gray-300 rounded-[8px] transition-transform duration-300 ${
                      isCompleted || accessLesson
                        ? "hover:cursor-pointer"
                        : "hover:cursor-not-allowed"
                    } hover:bg-surface-bg`}
                  >
                    <div className="flex items-center gap-x-2 text-title-lg">
                      <div className="px-4 py-2 text-brand-blue font-medium bg-blue-200 rounded-[8px]">
                        {index + 1}
                      </div>
                      <p className="text-surface-nav font-medium">
                        {value.lesson_name}
                      </p>
                    </div>
                    {isCompleted ? (
                      <FaCheck className="text-green-500" />
                    ) : accessLesson ? (
                      <div className="flex gap-x-2 items-center">
                        <p>{secondToTime(value.duration)}</p>
                        <IoPlayCircleOutline className="text-headline-md text-brand-blue" />
                      </div>
                    ) : (
                      <IoIosLock />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default CourseDetail;
