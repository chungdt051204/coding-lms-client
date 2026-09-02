import { useEffect, useState } from "react";
import { statisticsService } from "../../services/statisticsService";
import { format } from "../../../helper/format";
import { IoBookOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { LuInbox } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { FiUserCheck } from "react-icons/fi";
import { BsCreditCard } from "react-icons/bs";
import BarChart from "../../components/BarChart";
import MultiAxisLineChart from "../../components/MultiAxisLineChart";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState("");
  const days = statistics?.profitAndRevenueStats?.map((value) => {
    return value?._id;
  });
  const profits = statistics?.profitAndRevenueStats?.map((value) => {
    return value?.profit;
  });
  const revenues = statistics?.profitAndRevenueStats?.map((value) => {
    return value?.revenue;
  });
  const instructorNames = statistics?.instructors
    ?.filter((value) => value.balance > 0)
    ?.map((value) => {
      return value?.full_name;
    });
  const instructorProfits = statistics?.instructors
    ?.filter((value) => value?.balance > 0)
    ?.map((value) => {
      return value?.balance;
    });
  useEffect(() => {
    const getStatisticsByAdmin = async () => {
      try {
        const result = await statisticsService.getStatisticsByAdmin();
        console.log(result.data);
        setStatistics(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getStatisticsByAdmin();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-y-10 py-10 px-6 md:px-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%] shadow-md">
            <div className="bg-blue-50 rounded-[8px] p-2">
              <IoBookOutline className="text-headline-md text-blue-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng số khóa học
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {statistics?.totalCourses}
              </p>
              <p className="text-title-sm text-nav-muted">Khóa học</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%] shadow-md">
            <div className="bg-purple-50 rounded-[8px] p-2">
              <FiUserCheck className="text-headline-md text-purple-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng số giảng viên
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {statistics?.totalInstructors}
              </p>
              <p className="text-title-sm text-nav-muted">giảng viên</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%] shadow-md">
            <div className="bg-green-50 rounded-[8px] p-2">
              <RxPeople className="text-headline-md text-green-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng số người dùng
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {statistics?.totalUsers}
              </p>
              <p className="text-title-sm text-nav-muted">người dùng</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%] shadow-md">
            <div className="bg-orange-50 rounded-[8px] p-2">
              <LuInbox className="text-headline-md text-orange-500" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng đơn hàng
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {statistics?.totalOrders}
              </p>
              <p className="text-title-sm text-nav-muted">đơn hàng</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%] shadow-md">
            <div className="bg-red-50 rounded-[8px] p-2">
              <FiDollarSign className="text-headline-md text-red-500" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng doanh thu (100%)
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {format.formatPrice({ price: statistics?.totalRevenue })}đ
              </p>
              <p className="text-title-sm text-nav-muted">Doanh thu</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-full md:w-[48%] lg:w-[32%] shadow-md">
            <div className="bg-red-50 rounded-[8px] p-2">
              <BsCreditCard className="text-headline-md text-orange-500" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Lợi nhuận thu được (20%)
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {format.formatPrice({ price: statistics?.adminProfit })}đ
              </p>
              <p className="text-title-sm text-nav-muted">Lợi nhuận</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-6 p-5 border border-gray-200 rounded-[16px]">
          <div className="flex flex-col gap-y-4">
            <p className="text-title-sm text-surface-nav font-medium">
              Biểu đồ thống kê tổng doanh thu (100%) và lợi nhuận thu được (20%)
              trong tháng
            </p>
            {statistics?.profitAndRevenueStats?.length > 0 ? (
              <MultiAxisLineChart
                labels={days}
                label1="Tổng doanh thu (100%)"
                data1={revenues}
                label2="Lợi nhuận thu được (20%)"
                data2={profits}
              />
            ) : (
              <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted">
                <LuInbox className="text-display-md text-gray-300" />
                <p>Chưa có dữ liệu</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <p className="text-title-sm text-surface-nav font-medium">
              Biểu đồ thống kê lợi nhuận thu được (80%) của từng giảng viên
            </p>
            {statistics?.instructors?.length > 0 ? (
              <BarChart
                labels={instructorNames}
                label1="Lợi nhuận thu được (80%)"
                data1={instructorProfits}
              />
            ) : (
              <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted">
                <LuInbox className="text-display-md text-gray-300" />
                <p>Chưa có dữ liệu</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4 border py-6 border-gray-200 rounded-[16px] mt-6">
            <p className="text-title-lg text-surface-nav font-medium px-6">
              Top các khóa học bán chạy nhất
            </p>
            {statistics?.top5BestSellerCourses?.length == 0 ? (
              <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted">
                <LuInbox className="text-display-md text-gray-300" />
                <p>Chưa có dữ liệu</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {statistics?.top5BestSellerCourses?.map((value, index) => {
                  return (
                    <div
                      key={value?.data?._id}
                      className="flex justify-between py-4 hover:bg-blue-50 px-6"
                    >
                      <div className="flex gap-x-8 items-center">
                        <p className="text-title-lg text-nav-muted font-medium">
                          {index + 1}
                        </p>
                        <div className="flex gap-x-6">
                          <img
                            className="w-[100px] h-[80px] object-cover"
                            src={value?.data?.image_url}
                            alt=""
                          />
                          <div className="flex flex-col gap-y-1">
                            <p className="text-title-lg text-surface-nav font-medium">
                              {value?.data?.course_name}
                            </p>
                            <div className="flex gap-x-1 items-center text-title-sm">
                              <FaStar className="text-yellow-300" />
                              <p className="text-nav-muted">
                                {value?.data?.rating_star}
                              </p>
                            </div>
                            <p className="text-title-lg text-brand-blue font-bold">
                              {format.formatPrice({
                                price: value?.data?.price,
                              })}
                              đ
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-1 text-title-sm text-surface-nav font-medium">
                        <p>Số lượng bán được</p>
                        <p className="text-right">{value?.count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4 border py-6 border-gray-200 rounded-[16px] mt-6">
              <p className="text-title-lg text-surface-nav font-medium px-6">
                Top các khóa học có doanh thu cao nhất
              </p>
              {statistics?.top5HighestRevenueCourses?.length == 0 ? (
                <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted">
                  <LuInbox className="text-display-md text-gray-300" />
                  <p>Chưa có dữ liệu</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {statistics?.top5HighestRevenueCourses?.map(
                    (value, index) => {
                      return (
                        <div
                          key={value?.data?._id}
                          className="flex flex-col sm:flex-row justify-between sm:items-center py-3 md:py-4 px-3 sm:px-6 hover:bg-blue-50 transition-colors gap-y-3 sm:gap-y-0 border-b border-gray-100 sm:border-b-0 last:border-b-0"
                        >
                          <div className="flex gap-x-3 sm:gap-x-8 items-center min-w-0">
                            <div className="flex gap-x-3 sm:gap-x-8 items-center shrink-0">
                              <p className="text-body-md sm:text-title-lg text-nav-muted font-medium w-4 sm:w-auto text-center">
                                {index + 1}
                              </p>
                              <img
                                className="w-[72px] h-[58px] sm:w-[100px] sm:h-[80px] object-cover rounded-[6px] shrink-0"
                                src={value?.data?.image_url}
                                alt={value?.data?.course_name || ""}
                              />
                            </div>
                            <div className="flex flex-col gap-y-0.5 sm:gap-y-1 min-w-0">
                              <p className="text-body-md sm:text-title-lg text-surface-nav font-medium">
                                {value?.data?.course_name}
                              </p>
                              <div className="flex gap-x-1 items-center text-caption sm:text-title-sm">
                                <FaStar className="text-yellow-300 shrink-0" />
                                <p className="text-nav-muted">
                                  {value?.data?.rating_star > 0
                                    ? value?.data?.rating_star
                                    : "0.0"}
                                </p>
                              </div>
                              <p className="text-body-md sm:text-title-lg text-brand-blue font-bold">
                                {format.formatPrice({
                                  price: value?.data?.price,
                                })}
                                đ
                              </p>
                            </div>
                          </div>
                          <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end sm:bg-transparent p-2 sm:p-0 rounded-[8px] shrink-0">
                            <p className="text-caption sm:text-title-sm text-surface-nav font-medium">
                              Doanh thu
                            </p>
                            <p className="text-body-md sm:text-title-lg text-brand-blue font-bold">
                              {format.formatPrice({ price: value?.revenue })}đ
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4 border py-6 border-gray-200 rounded-[16px] mt-6">
              <p className="text-title-lg text-surface-nav font-medium px-6">
                Top các khóa học được đánh giá cao nhất
              </p>
              {statistics?.top5HighestRatingCourses?.length == 0 ? (
                <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted">
                  <LuInbox className="text-display-md text-gray-300" />
                  <p>Chưa có dữ liệu</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {statistics?.top5HighestRatingCourses?.map((value, index) => {
                    return (
                      <div
                        key={value._id}
                        className="flex flex-col sm:flex-row justify-between sm:items-center py-3 md:py-4 px-3 sm:px-6 hover:bg-blue-50 transition-colors gap-y-3 sm:gap-y-0 border-b border-gray-100 sm:border-b-0 last:border-b-0"
                      >
                        <div className="flex gap-x-3 sm:gap-x-8 items-center min-w-0">
                          <p className="text-body-md sm:text-title-lg text-nav-muted font-medium w-4 sm:w-auto text-center shrink-0">
                            {index + 1}
                          </p>
                          <div className="flex gap-x-3 sm:gap-x-6 items-center min-w-0">
                            <img
                              className="w-[72px] h-[58px] sm:w-[100px] sm:h-[80px] object-cover rounded-[6px] shrink-0"
                              src={value.image_url}
                              alt={value.course_name || ""}
                            />
                            <div className="flex flex-col gap-y-0.5 sm:gap-y-1 min-w-0">
                              <p className="text-body-md sm:text-title-lg text-surface-nav font-medium">
                                {value.course_name}
                              </p>
                              <div className="flex gap-x-1 items-center text-caption sm:text-title-sm">
                                <FaStar className="text-yellow-300 shrink-0" />
                                <p className="text-nav-muted">
                                  {value.rating_star > 0
                                    ? value.rating_star
                                    : "0.0"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:block justify-between items-center sm:bg-transparent p-2 sm:p-0 rounded-[8px] shrink-0">
                          <span className="sm:hidden text-caption text-nav-muted font-medium">
                            Giá
                          </span>
                          <p className="text-body-md sm:text-title-lg text-brand-blue font-bold text-right">
                            {format.formatPrice({
                              price: value.price,
                            })}
                            đ
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminDashboard;
