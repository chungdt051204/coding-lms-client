import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../services/courseService";
import { enrollmentService } from "../services/enrollmentService";
import { setEnrollments } from "../stores/features/enrollmentSlice";
import { createNotification } from "../stores/features/notificationSlice";
import { lessonProgressService } from "../services/lessonProgressService";
import { cartService } from "../services/cartService";
import { testService } from "../services/testService";
import { ratingService } from "../services/ratingService";
import { conversationService } from "../services/conversationService";
import { addToCart } from "../stores/features/cartSlice";
import { toast } from "react-toastify";
import { format } from "../../helper/format";
import { FaStar } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";
import { IoBookOutline } from "react-icons/io5";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";
import { FiFileText } from "react-icons/fi";
import { LuTimer } from "react-icons/lu";
import { FiTarget } from "react-icons/fi";
import { FaAngleRight } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { Progress } from "antd";
import { LuInbox } from "react-icons/lu";
import { FiMessageCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import ConversationDetail from "../components/ConversationDetail";
import Footer from "../components/Footer";

const CourseDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enrollments = useSelector((state) => state.enrollments.items);
  const { item: me } = useSelector((state) => state.me);
  const isAdmin = me?.role_id?.role === "admin";
  const isInstructor = me?.role_id?.role === "instructor";
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [lessonProgresses, setLessonProgresses] = useState([]);
  const [test, setTest] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const enrolledCourse = enrollments?.arrayEnrollment?.find(
    (value) => value?.item?.course_id?._id == id
  );
  const completedCourse = enrolledCourse?.item?.progress_percent == 100;
  const accessedTest =
    enrolledCourse?.item?.total_lessons ===
    enrolledCourse?.item?.completed_lessons;
  const numberAccessLesson =
    enrolledCourse?.item?.access_level == "LIMITED"
      ? (course?.lessons?.length * 50) / 100
      : enrolledCourse?.item?.access_level == "UNLIMITED"
      ? course?.lessons?.length
      : 0;
  const myCart = useSelector((state) => state.cart);
  const courseInCart = myCart.items?.some((value) => value.course_id._id == id);
  const ratingStar = [
    { star: 1, comment: "Khóa học rất tệ" },
    { star: 2, comment: "Khóa học bình thường" },
    { star: 3, comment: "Khóa học tạm ổn" },
    { star: 4, comment: "Khóa học rất hay" },
    { star: 5, comment: "Khóa học rất tuyệt vời" },
  ];
  const [idx, setIdx] = useState(-1);
  const [comment, setComment] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isDropdown, setIsDropdown] = useState(true);
  const { items: roles } = useSelector((state) => state.roles);
  const getRole = ({ roleId }) => {
    const role = roles?.find((value) => value._id == roleId);
    return role?.role;
  };
  const [conversation, setConversation] = useState(null);
  const conversationInfo = {
    conversationId: conversation?.item?._id,
    userId: me?._id,
    instructorId: course?.item?.user_id?._id,
    courseId: id,
    userAvatar: course?.item?.user_id?.avatar,
    userFullName: course?.item?.user_id?.full_name,
    courseImage: course?.item?.image_url,
    courseName: course?.item?.course_name,
    messages: conversation?.messages,
  };
  useEffect(() => {
    if (id) {
      const getCourseById = async () => {
        try {
          const result = await courseService.getCourseById({ courseId: id });
          console.log(result.data);
          setCourse(result.data);
          setRatings(result.data?.ratings);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getCourseById();
    }
  }, [id, dispatch, refresh]);
  useEffect(() => {
    if (me) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyRating(
        ratings?.find(
          (value) => value.course_id == id && value?.user_id?._id == me?._id
        )
      );
      const getEnrollmentsByUser = async () => {
        try {
          const result = await enrollmentService.getEnrollmentsByUser({
            params: {},
          });
          dispatch(setEnrollments(result.data));
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getEnrollmentsByUser();
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
  }, [me, dispatch, id, ratings]);
  useEffect(() => {
    console.log(myRating);
    if (myRating) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIdx(myRating?.rating_star - 1);
      setComment(myRating?.comment || "");
    }
  }, [myRating]);
  useEffect(() => {
    if (enrolledCourse || isAdmin || isInstructor) {
      const getTestByCourse = async () => {
        try {
          const result = await testService.getTestByCourse({ courseId: id });
          console.log(result.data);
          setTest(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getTestByCourse();
      const getConversationByParticipantsAndCourse = async () => {
        try {
          const result =
            await conversationService.getConversationByParticipantsAndCourse({
              instructorId: course?.item?.user_id?._id,
              courseId: id,
            });
          console.log(result.data);
          setConversation(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getConversationByParticipantsAndCourse();
    }
  }, [enrolledCourse, id, course, isAdmin, isInstructor]);
  const handleCreateEnrollment = async () => {
    if (!me) {
      toast.warning("Bạn chưa đăng nhập!");
      return;
    }
    try {
      const result = await enrollmentService.createEnrollment({
        data: { courseId: id, accessLevel: "UNLIMITED" },
      });
      console.log(result.data);
      dispatch(createNotification(result.data?.result2));
      toast.success(result.message || "Đăng ký học khóa học thành công");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleAddToCart = async () => {
    if (!me) {
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
  const handleRating = async () => {
    if (!me) {
      toast.warning("Vui lòng đăng nhập để thực hiện đánh giá!");
      return;
    } else if (!enrolledCourse) {
      toast.warning("Bạn chưa sỡ hữu khóa học, không thể đánh giá!");
      return;
    } else if (!completedCourse) {
      toast.warning("Bạn chưa hoàn thành khóa học, không thể đánh giá!");
      return;
    } else if (idx == -1) {
      toast.warning("Vui lòng chọn số sao để đánh giá!");
      return;
    }
    try {
      const result = await ratingService.createRating({
        data: {
          courseId: id,
          ratingStar: idx + 1,
          comment: comment || ratingStar[idx].comment,
        },
      });
      console.log(result);
      setRefresh((prev) => prev + 1);
      toast.success(result.message || "Tạo đánh giá thành công");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-y-10 py-18 bg-surface-bg">
        <>
          {enrolledCourse && (
            <button
              onClick={() => setClicked((prev) => !prev)}
              className={`fixed z-50 bottom-4 right-4 sm:bottom-5 sm:right-5 text-surface-white border-none bg-auth ${
                clicked ? "p-3 sm:py-2 sm:px-6" : "py-2.5 sm:py-3 px-4 sm:px-6"
              } rounded-full text-title-sm font-medium transition-transform duration-300 hover:scale-105 hover:cursor-pointer shadow-lg`}
            >
              {clicked ? (
                <span className="font-bold text-title-md">✕</span>
              ) : (
                <div className="flex gap-x-2 items-center">
                  <FiMessageCircle className="text-title-lg sm:text-headline-sm" />
                  <p>Chat với giảng viên</p>
                </div>
              )}
            </button>
          )}
          <ConversationDetail
            conversationInfo={conversationInfo}
            me={me}
            getRole={getRole}
            isClicked={clicked}
            setIsClicked={setClicked}
            isDropdown={isDropdown}
            setIsDropdown={setIsDropdown}
          />
          {/* Hero / Header Box */}
          <div className="flex flex-col min-h-screen xl:h-[1100px] bg-primary-purple py-8 md:py-12 px-4 sm:px-8 md:px-16 xl:px-28 gap-y-10">
            <div className="flex flex-col justify-between gap-y-4">
              <div className="flex flex-wrap gap-2 text-caption sm:text-body-md xl:text-title-lg text-surface-white">
                <div className="px-3 py-1 bg-primary-purple-light rounded-[8px]">
                  {course?.item?.category_id?.category_name || ""}
                </div>
                <div className="px-3 py-1 bg-primary-purple-light rounded-[8px]">
                  {course?.item?.level || ""}
                </div>
              </div>
              <p className="text-headline-lg sm:text-display-md xl:text-display-lg text-surface-white font-medium wrap-break-word">
                {course?.item?.course_name || ""}
              </p>
              <p className="text-body-md sm:text-title-lg xl:text-headline-sm text-surface-bg">
                {course?.item?.description || ""}
              </p>
              {!isAdmin && (
                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-2 text-body-md sm:text-title-lg xl:text-headline-sm text-surface-white">
                  <div className="flex items-center gap-x-1.5">
                    <FaStar className="text-yellow-300 shrink-0" />
                    <p>
                      {course?.averageStar} ({course?.ratings?.length || 0} đánh
                      giá)
                    </p>
                  </div>
                  <div className="flex items-center gap-x-1.5">
                    <RxPeople className="text-surface-white shrink-0" />
                    <p>{course?.numberEnrollment || 0} học viên</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-x-3 sm:gap-x-4 pt-2">
                <img
                  className="w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] object-cover rounded-full shrink-0"
                  src={course?.item?.user_id?.avatar || null}
                  alt={course?.item?.user_id?.full_name || "Instructor Avatar"}
                />
                <div className="flex flex-col">
                  <p className="text-caption sm:text-body-md xl:text-title-lg text-surface-bg">
                    Giảng viên
                  </p>
                  <p className="text-title-md sm:text-headline-sm text-surface-white font-medium wrap-break-word">
                    {course?.item?.user_id?.full_name || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-y-4 xl:gap-y-0 xl:h-[65%] bg-surface-white rounded-[16px] p-4 sm:p-6 xl:p-8 shadow-md">
              <img
                className="w-full h-[280px] md:h-[360px] xl:h-[400px] object-cover sm:object-fill rounded-[12px] xl:rounded-[16px]"
                src={course?.item?.thumbnail_url || null}
                alt={course?.item?.course_name || "Thumbnail"}
              />
              <p className="text-brand-blue font-bold text-headline-sm md:text-headline-md">
                {course?.item?.is_free
                  ? 0
                  : format.formatPrice({ price: course?.item?.price })}
                đ
              </p>
              {!enrolledCourse && !isAdmin && !isInstructor && (
                <button
                  onClick={
                    course?.item?.is_free
                      ? handleCreateEnrollment
                      : handleAddToCart
                  }
                  className="w-full bg-surface-nav py-3 xl:py-2 text-title-md sm:text-headline-sm text-surface-white rounded-[8px] transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg active:scale-[0.99]"
                >
                  {course?.item?.is_free
                    ? "Đăng ký học ngay"
                    : courseInCart
                    ? "Đã thêm vào giỏ hàng"
                    : "Thêm vào giỏ hàng"}
                </button>
              )}
              <div className="flex flex-col gap-y-2 pt-2 border-t border-gray-100 xl:border-none">
                <div className="flex gap-x-2 items-center text-body-md sm:text-title-lg xl:text-headline-sm">
                  <IoBookOutline className="text-nav-muted shrink-0 text-xl" />
                  <p>{(course?.lessons?.length || 0) + " bài học"}</p>
                </div>
                <div className="flex gap-x-2 items-center text-body-md sm:text-title-lg xl:text-headline-sm">
                  <IoPlayCircleOutline className="text-nav-muted shrink-0 text-xl" />
                  <p>Truy cập trọn đời</p>
                </div>
              </div>
            </div>
          </div>
        </>
        {/* Rating box */}
        {(!isAdmin || course?.item?.status == "approved") && (
          <div className="px-4 sm:px-8 md:px-16 xl:px-28">
            <div className="flex flex-col gap-y-6 md:gap-y-8 border border-gray-300 rounded-[16px] p-4 sm:p-6 xl:p-8 bg-surface-white">
              <p className="text-title-lg sm:text-headline-md text-surface-nav font-medium">
                Đánh giá từ học viên
              </p>
              <div className="flex flex-col lg:flex-row justify-between items-center p-4 sm:p-6 bg-blue-50 rounded-[16px] gap-6">
                <div className="flex flex-col gap-y-2 w-full md:w-[25%] xl:w-[20%] text-center items-center">
                  <p className="text-display-md sm:text-display-lg text-brand-blue font-bold">
                    {course?.averageStar > 0 ? course?.averageStar : "0.0"}
                  </p>
                  <div className="flex gap-x-1 justify-center">
                    {ratingStar?.map((_, i) => {
                      return i <= course?.averageStar - 1 ? (
                        <FaStar
                          key={i}
                          className="text-title-lg sm:text-display-sm text-yellow-300"
                        />
                      ) : (
                        <FaRegStar
                          key={i}
                          className="text-title-lg sm:text-display-sm text-gray-300"
                        />
                      );
                    })}
                  </div>
                  <p className="text-caption sm:text-title-sm text-nav-muted">
                    {course?.ratings?.length || 0} đánh giá
                  </p>
                </div>
                <div className="flex flex-col gap-y-3 sm:gap-y-4 w-full xl:w-[78%]">
                  {course?.ratingStats?.map((value, index) => {
                    const percentage =
                      value.count == 0 ? 0 : 100 / Number(value.count);
                    return (
                      <div
                        className="flex items-center gap-x-3 sm:gap-x-6"
                        key={index}
                      >
                        <p className="w-[45px] sm:w-[50px] text-caption sm:text-title-sm text-surface-nav shrink-0">
                          {value.star} sao
                        </p>
                        <div className="flex-1">
                          <Progress
                            percent={percentage}
                            status="normal"
                            showInfo={false}
                          />
                        </div>
                        <p className="w-[60px] sm:w-[100px] text-right text-caption sm:text-title-sm text-nav-muted shrink-0">
                          {percentage} %
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!isInstructor && !isAdmin && (
                <div className="flex flex-col gap-y-4 p-4 sm:p-5 bg-gray-50 rounded-[16px]">
                  <p className="text-title-md sm:text-headline-sm text-surface-nav font-medium">
                    Viết đánh giá của bạn
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 items-start">
                    <p className="text-body-md sm:text-title-sm text-surface-nav">
                      Đánh giá:
                    </p>
                    <div className="flex flex-col gap-y-1">
                      <div className="flex gap-x-1">
                        {ratingStar?.map((_, i) => {
                          return i <= idx ? (
                            <FaStar
                              key={i}
                              onClick={() => {
                                if (!myRating) setIdx(i);
                              }}
                              className={`text-title-lg sm:text-headline-md text-yellow-300 ${
                                myRating
                                  ? "hover:cursor-not-allowed"
                                  : "hover:cursor-pointer"
                              }`}
                            />
                          ) : (
                            <FaRegStar
                              key={i}
                              onClick={() => {
                                if (!myRating) setIdx(i);
                              }}
                              className={`text-title-lg sm:text-headline-md text-gray-300 ${
                                myRating
                                  ? "hover:cursor-not-allowed"
                                  : "hover:cursor-pointer"
                              }`}
                            />
                          );
                        })}
                      </div>
                      {idx != -1 && (
                        <p className="text-caption sm:text-body-md text-surface-nav">
                          ({ratingStar[idx].comment})
                        </p>
                      )}
                    </div>
                  </div>
                  <textarea
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    disabled={myRating}
                    rows={3}
                    className="p-3 sm:p-4 rounded-[8px] bg-surface-bg text-body-md sm:text-title-sm text-surface-nav placeholder:text-nav-muted outline-0 resize-none w-full"
                    placeholder="Chia sẻ của bạn về khóa học"
                  ></textarea>
                  <button
                    onClick={!myRating ? handleRating : undefined}
                    className={`border ${
                      myRating
                        ? "hover:cursor-not-allowed"
                        : "hover:cursor-pointer hover:text-surface-bg active:scale-[0.99]"
                    } w-full sm:w-auto xl:w-[20%] py-2.5 sm:py-2 px-6 bg-surface-nav text-body-md sm:text-title-sm font-medium text-surface-white rounded-[8px] transition-transform duration-300`}
                  >
                    Gửi đánh giá
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-y-4 sm:gap-y-6">
                <p className="text-title-md sm:text-title-lg text-surface-nav font-medium">
                  Tất cả đánh giá
                </p>
                <div className="flex flex-col gap-y-4">
                  {ratings?.length > 0 ? (
                    ratings?.map((value) => {
                      return (
                        <div
                          className="flex gap-x-3 sm:gap-x-4 items-start border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                          key={value._id}
                        >
                          <img
                            className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full object-cover shrink-0"
                            src={value?.user_id?.avatar}
                            referrerPolicy="no-referrer"
                            alt=""
                          />
                          <div className="flex flex-col gap-y-1 w-full min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-0.5">
                              <p className="text-body-md sm:text-title-sm text-surface-nav font-medium truncate">
                                {value?.user_id?.full_name}
                              </p>
                              <p className="text-caption sm:text-title-sm text-nav-muted">
                                {format.formatDate({
                                  date: value?.createdAt,
                                })}
                              </p>
                            </div>
                            <div className="flex gap-x-1">
                              {ratingStar?.map((_, i) => {
                                return i <= value?.rating_star - 1 ? (
                                  <FaStar
                                    key={i}
                                    className="text-body-md sm:text-headline-sm text-yellow-300"
                                  />
                                ) : (
                                  <FaRegStar
                                    key={i}
                                    className="text-body-md sm:text-headline-sm text-gray-300"
                                  />
                                );
                              })}
                            </div>
                            <p className="text-body-md sm:text-title-sm text-nav-muted break-words mt-1">
                              {value?.status
                                ? value?.comment
                                : "Bình luận này đã bị ẩn bởi quản trị viên"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-full mt-4 py-8">
                      <LuInbox className="text-display-md text-gray-300 text-4xl" />
                      <p>Chưa có đánh giá nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Requirement & Objective & Lessons */}
        <div className="px-4 sm:px-8 md:px-16 xl:px-28">
          <div className="flex flex-col gap-y-4 px-8 py-4 bg-surface-white border border-gray-300 rounded-[16px]">
            <p className="text-headline-sm md:text-headline-md text-surface-nav font-medium">
              Yêu cầu
            </p>
            <ul className="flex flex-col gap-y-2">
              {course?.item?.requirements?.map((value, index) => {
                return (
                  <li key={index} className="flex gap-x-2 items-center">
                    <p className="text-brand-blue shrink-0">✓</p>
                    {value}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-y-4 px-8 py-4 mt-8 bg-surface-white border border-gray-300 rounded-[16px]">
            <p className="text-headline-sm md:text-headline-md text-surface-nav font-medium">
              Bạn sẽ học được gì ?
            </p>
            <ul className="flex flex-col gap-y-2">
              {course?.item?.objectives?.map((value, index) => {
                return (
                  <li key={index} className="flex gap-x-2 items-center">
                    <FaCheck className="text-green-500 shrink-0" />
                    {value}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-y-4 px-8 py-4 mt-8 bg-surface-white border border-gray-300 rounded-[16px]">
            <div className="flex flex-col gap-y-1 md:flex-row md:justify-between">
              <p className="text-headline-sm md:text-headline-md text-surface-nav font-medium">
                Nội dung khóa học
              </p>
              <p className="text-title-lg text-surface-nav font-medium">
                {course?.lessons?.length + " " + "bài học"}
              </p>
            </div>
            <ul className="flex flex-col gap-y-2">
              {course?.lessons?.map((value, index) => {
                const isCompleted = lessonProgresses?.some(
                  (item) => item.lesson_id._id == value._id && item.is_completed
                );
                const prevLesson = course?.lessons[index - 1];
                const accessLesson =
                  (enrolledCourse && value.order == 1) ||
                  isAdmin ||
                  isInstructor ||
                  (prevLesson &&
                    lessonProgresses?.some(
                      (item) =>
                        item.lesson_id._id == prevLesson?._id &&
                        item.is_completed
                    ));
                return (
                  <li
                    onClick={() => {
                      if (isAdmin || isInstructor)
                        navigate(`/course/${id}/lesson/${value._id}`);
                      else {
                        if (!enrolledCourse) {
                          toast.warning("Bạn chưa sỡ hữu khóa học này!");
                          return;
                        } else if (value.order > numberAccessLesson) {
                          toast.warning(
                            "Vui lòng thanh toán đầy đủ khóa học để mở khóa toàn bộ bài học!"
                          );
                        } else if (isCompleted) {
                          toast.success("Bài học này đã hoàn thành!");
                          return;
                        } else if (!accessLesson) {
                          toast.warning("Bạn chưa hoàn thành bài học trước!");
                          return;
                        } else navigate(`/course/${id}/lesson/${value._id}`);
                      }
                    }}
                    key={value._id}
                    className={`flex justify-between items-center p-4 border border-gray-300 rounded-[8px] transition-transform duration-300 ${
                      isCompleted || accessLesson
                        ? "hover:cursor-pointer"
                        : "hover:cursor-not-allowed"
                    } hover:bg-surface-bg`}
                  >
                    <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center w-full">
                      <div className="flex items-center gap-x-4 text-title-sm md:text-title-lg">
                        <div className="px-4 py-2 text-brand-blue font-medium bg-blue-200 rounded-[8px]">
                          {index + 1}
                        </div>
                        <p className="text-surface-nav font-medium w-full">
                          {value.lesson_name}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        {isCompleted ? (
                          <FaCheck className="text-green-500 shrink-0 " />
                        ) : accessLesson ? (
                          <div className="flex gap-x-2 items-center shrink-0 ">
                            <p>
                              {format.formatSecondToTime({
                                second: value.duration,
                              })}
                            </p>
                            <IoPlayCircleOutline className="text-headline-md text-brand-blue" />
                          </div>
                        ) : (
                          <IoIosLock
                            className={`shrink-0 ${
                              value.order <= numberAccessLesson
                                ? "text-brand-blue"
                                : "text-surface-nav"
                            } `}
                          />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          {test &&
            accessedTest &&
            (enrolledCourse?.item?.access_level === "UNLIMITED" ||
              isAdmin ||
              isInstructor) && (
              <div className="p-6 rounded-[16px] mt-10 bg-surface-white border border-gray-300">
                <div className="flex justify-between items-center">
                  <p className="text-headline-sm md:text-headline-md text-surface-nav font-medium">
                    Bài kiểm tra
                  </p>
                  <p className="text-title-sm text-purple-700 font-medium px-2 py-1 rounded-[8px] bg-purple-100">
                    1 bài kiểm tra
                  </p>
                </div>
                <div
                  onClick={() =>
                    navigate(`/course/${id}/test/${test?.item?._id}`)
                  }
                  className="flex justify-between items-start border rounded-[8px] p-5 mt-6 border-2 border-purple-100 transition-transform duration-300 hover:border-purple-300 hover:cursor-pointer "
                >
                  <div className="flex gap-x-4 items-start">
                    <div className="p-3 bg-auth rounded-[8px] transition-transform duration-300 hover:scale-105">
                      <FiFileText className="text-headline-md text-surface-white" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="text-title-lg text-surface-nav font-medium transition-transform duration-300 hover:text-purple-500">
                        {test?.item?.test_name || ""}
                      </p>
                      <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-10 text-title-sm text-nav-muted">
                        <div className="flex gap-x-2 items-center">
                          <FiFileText />
                          <p>{test?.numberQuestion} câu hỏi</p>
                        </div>
                        <div className="flex gap-x-2 items-center">
                          <LuTimer />
                          <p>{test?.item?.duration_minutes || ""} phút</p>
                        </div>
                        <div className="flex gap-x-2 items-center">
                          <FiTarget />
                          <p>Điểm đạt: {test?.item?.pass_score || ""} %</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <FaAngleRight className="text-headline-sm text-purple-500" />
                </div>
              </div>
            )}
        </div>
      </div>
      {me?.role_id?.role == "user" && <Footer />}
    </>
  );
};
export default CourseDetail;
