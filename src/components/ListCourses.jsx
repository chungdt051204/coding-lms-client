import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { courseService } from "../services/courseService";
import { setCourses } from "../stores/features/courseSlice";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";
const ListCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: courses, isLoading } = useSelector((state) => state.courses);
  useEffect(() => {
    const getApprovedCourses = async () => {
      try {
        const result = await courseService.getApprovedCourses();
        console.log(result.data);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    };
    getApprovedCourses();
  }, [dispatch]);
  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  return (
    <>
      <div className="flex flex-wrap gap-6 mx-auto">
        {courses?.length > 0 ? (
          courses.map((value) => {
            return (
              <div
                key={value?.course?._id}
                className="flex flex-col gap-y-4 w-[31%] p-5 border border-gray-300 rounded-[16px] transition-shadow duration-300 hover:shadow-lg hover:cursor-pointer"
              >
                <div className="w-[250px] h-[200px] transition-transform duration-300 hover:scale-105">
                  <img
                    className="w-full h-full object-contain"
                    src={value?.course?.image_url}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-x-1 items-center">
                    <img
                      className="h-[40px] rounded-[1000px]"
                      src={value?.course?.user_id?.avatar}
                      alt=""
                    />
                    <p className="text-body-lg text-nav-muted">
                      {value?.course?.user_id?.full_name}
                    </p>
                  </div>
                  <p className="text-headline-sm text-surface-nav font-medium hover:text-brand-blue transition-transform duration-300">
                    {value?.course?.course_name}
                  </p>
                  <div className="flex gap-x-3 items-center text-body-lg text-nav-muted">
                    <div className="flex gap-x-1 items-center">
                      <FaStar className="text-yellow-500" />
                      <p>0.0</p>
                    </div>
                    <div className="flex gap-x-1 items-center">
                      <RxPeople />
                      <p>{value?.numberEnrollment}</p>
                    </div>
                    <p>{value?.totalLesson} bài học</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-headline-md text-brand-blue font-bold">
                    {value?.course?.price}đ
                  </p>
                  <button
                    onClick={() => navigate(`/course/${value?.course?._id}`)}
                    className="bg-surface-nav text-body-lg text-surface-white py-1 px-3 rounded-[8px] transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>Không tìm thấy khóa học để hiển thị</p>
        )}
      </div>
    </>
  );
};
export default ListCourses;
