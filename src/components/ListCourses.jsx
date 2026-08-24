import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LuInbox } from "react-icons/lu";
import { format } from "../../helper/format";

const ListCourses = ({ courses, isLoading }) => {
  const navigate = useNavigate();
  const displayItems = isLoading
    ? Array.from({ length: 6 })
    : courses?.arrayCourse;
  return (
    <>
      <div className="flex flex-wrap gap-6 mx-auto w-full">
        {displayItems?.length > 0 ? (
          displayItems.map((value, index) => {
            return (
              <div
                onClick={() => navigate(`/course/${value?.course?._id}`)}
                key={index}
                className={`${
                  !isLoading &&
                  "border border-gray-300 rounded-[16px] transition-shadow duration-300 hover:shadow-lg hover:cursor-pointer"
                } flex flex-col gap-y-4 w-[31%] p-5 `}
              >
                {isLoading ? (
                  <Skeleton width={250} height={200} />
                ) : (
                  <div className="w-[250px] h-[200px]">
                    <img
                      className="w-full h-full object-contain"
                      src={value?.course?.image_url}
                      alt=""
                    />
                  </div>
                )}
                <div className="flex flex-col gap-y-1">
                  {isLoading ? (
                    <div className="flex gap-x-4 items-center">
                      <Skeleton width={40} height={40} borderRadius={1000} />
                      <Skeleton width={180} height={25} />
                    </div>
                  ) : (
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
                  )}
                  {isLoading ? (
                    <Skeleton height={30} />
                  ) : (
                    <p className="text-headline-sm text-surface-nav font-medium hover:text-brand-blue transition-transform duration-300">
                      {value?.course?.course_name}
                    </p>
                  )}
                  {isLoading ? (
                    <Skeleton width={180} height={25} />
                  ) : (
                    <div className="flex gap-x-3 items-center text-body-lg text-nav-muted">
                      <div className="flex gap-x-1 items-center">
                        <FaStar className="text-yellow-300" />
                        <p>
                          {value?.course?.rating_star > 0
                            ? value?.course?.rating_star
                            : "0.0"}
                        </p>
                      </div>
                      <div className="flex gap-x-1 items-center">
                        <RxPeople />
                        <p>{value?.numberEnrollment}</p>
                      </div>
                      <p>{value?.totalLesson} bài học</p>
                    </div>
                  )}
                </div>
                {isLoading ? (
                  <Skeleton width={150} height={30} />
                ) : (
                  <p className="text-headline-md text-brand-blue font-bold">
                    {format.formatPrice({ price: value?.course?.price })}đ
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6 mx-auto">
            <LuInbox className="text-display-md text-gray-300" />
            <p>Không tìm thấy khóa học để hiển thị</p>
          </div>
        )}
      </div>
    </>
  );
};
export default ListCourses;
