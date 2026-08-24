import { useEffect, useState } from "react";
import { statisticsService } from "../../services/statisticsService";
import { IoBookOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { FiDollarSign } from "react-icons/fi";
import { format } from "../../../helper/format";
import BarChart from "../../components/BarChart";
import { LuInbox } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { BsCreditCard } from "react-icons/bs";
import MultiAxisLineChart from "../../components/MultiAxisLineChart";

const InstructorDashboard = () => {
  const [statistics, setStatistics] = useState("");
  const days = statistics?.monthlyRevenueAndProfit?.map((value) => {
    return value._id;
  });
  const revenues = statistics?.monthlyRevenueAndProfit?.map((value) => {
    return value.totalRevenue;
  });
  const profits = statistics?.monthlyRevenueAndProfit?.map((value) => {
    return value.totalProfit;
  });
  const courseNames = statistics?.courseRevenueStats?.map((value) => {
    return value?.course_name;
  });
  const courseRevenues = statistics?.courseRevenueStats?.map((value) => {
    return value?.revenue;
  });
  const totalRevenue = () => {
    let totalRevenue = 0;
    statistics?.courseRevenueStats?.map((value) => {
      totalRevenue = totalRevenue + value.revenue;
    });
    return totalRevenue;
  };
  useEffect(() => {
    const getStatisticsByInstructor = async () => {
      try {
        const result = await statisticsService.getStatisticsByInstructor();
        console.log(result.data);
        setStatistics(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getStatisticsByInstructor();
  }, []);

  return (
    <>
      <div className="flex flex-col w-[95%] gap-y-10 py-10">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%] shadow-md">
            <div className="bg-blue-50 rounded-[8px] p-2">
              <IoBookOutline className="text-headline-md text-blue-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng số khóa học đã tạo
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {statistics?.totalCourses}
              </p>
              <p className="text-title-sm text-nav-muted">Khóa học</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%] shadow-md">
            <div className="bg-green-50 rounded-[8px] p-2">
              <RxPeople className="text-headline-md text-green-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng số học viên
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {statistics.totalStudents}
              </p>
              <p className="text-title-sm text-nav-muted">Học viên</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%] shadow-md">
            <div className="bg-red-50 rounded-[8px] p-2">
              <FiDollarSign className="text-headline-md text-red-500" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng doanh thu (100%)
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {format.formatPrice({ price: totalRevenue() })}đ
              </p>
              <p className="text-title-sm text-nav-muted">Doanh thu</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%] shadow-md">
            <div className="bg-red-50 rounded-[8px] p-2">
              <BsCreditCard className="text-headline-md text-orange-500" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Lợi nhuận thu được (80%)
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {format.formatPrice({ price: statistics?.myProfit || 0 })}đ
              </p>
              <p className="text-title-sm text-nav-muted">Lợi nhuận</p>
            </div>
          </div>
        </div>
        {(statistics?.monthlyRevenueAndProfit?.length > 0 ||
          statistics?.courseRevenueStats?.length > 0) && (
          <div className="p-5 border border-gray-200 rounded-[16px]">
            <MultiAxisLineChart
              text="Biểu đồ thống kê tổng doanh thu (100%) và lợi nhuận thu được (80%) trong tháng"
              labels={days}
              label1="Tổng doanh thu (100%)"
              data1={revenues}
              label2="Lợi nhuận thu được (80%)"
              data2={profits}
            />
            <BarChart
              text="Biểu đồ thống kê doanh thu từng khóa học (100%)"
              labels={courseNames}
              label1="Tổng doanh thu (100%)"
              data1={courseRevenues}
            />
          </div>
        )}
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4 border py-6 border-gray-200 rounded-[16px] mt-6">
            <p className="text-title-lg text-surface-nav font-medium px-6">
              Top các khóa học được đánh giá cao nhất
            </p>
            {statistics?.top5HighRatingCourses?.length == 0 ? (
              <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
                <LuInbox className="text-display-md text-gray-300" />
                <p>Chưa có dữ liệu</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {statistics?.top5HighRatingCourses?.map((value, index) => {
                  return (
                    <div
                      key={value._id}
                      className="flex justify-between py-4 hover:bg-blue-50 px-6"
                    >
                      <div className="flex gap-x-8 items-center">
                        <p className="text-title-lg text-nav-muted font-medium">
                          {index + 1}
                        </p>
                        <div className="flex gap-x-6">
                          <img
                            className="w-[100px] h-[80px] object-cover"
                            src={value.image_url}
                            alt=""
                          />
                          <div className="flex flex-col gap-y-1">
                            <p className="text-title-lg text-surface-nav font-medium">
                              {value.course_name}
                            </p>
                            <div className="flex gap-x-1 items-center text-title-sm">
                              <FaStar className="text-yellow-300" />
                              <p className="text-nav-muted">
                                {value.rating_star}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-headline-sm text-brand-blue font-bold">
                        {format.formatPrice({ price: value.price })}đ
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default InstructorDashboard;
