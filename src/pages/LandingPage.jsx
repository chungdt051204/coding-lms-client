import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { courseService } from "../services/courseService";
import { setCourses } from "../stores/features/courseSlice";
import { FaArrowRight } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { LuAward } from "react-icons/lu";
import { IoIosTrendingUp } from "react-icons/io";
import image from "../assets/image.png";
import ListCourses from "../components/ListCourses";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBotAI from "../components/ChatBotAI";
import loading from "../assets/loading.gif";

const LandingPage = () => {
  const navigate = useNavigate();
  const { searchParams } = useSearchParams();
  const dispatch = useDispatch();
  const { item: me } = useSelector((state) => state.me);
  const { items: courses, isLoading } = useSelector((state) => state.courses);
  const categories = useSelector((state) => state.categories.items);
  const items = [
    {
      icon: <IoBookOutline className="text-brand-blue mx-auto" />,
      mainText: "500+",
      subText: "Khóa học",
      bgColor: "bg-blue-100",
    },
    {
      icon: <RxPeople className="text-purple-500 mx-auto" />,
      mainText: "50K+",
      subText: "Học viên",
      bgColor: "bg-purple-100",
    },
    {
      icon: <LuAward className="text-green-500 mx-auto" />,
      mainText: "200+",
      subText: "Giảng viên",
      bgColor: "bg-green-100",
    },
    {
      icon: <IoIosTrendingUp className="text-orange-500 mx-auto" />,
      mainText: "95%",
      subText: "Hài lòng",
      bgColor: "bg-orange-100",
    },
  ];
  useEffect(() => {
    const getApprovedCourses = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("page", 1);
        params.append("limit", 6);
        params.append("option", "newest");
        const result = await courseService.getApprovedCourses({
          params: params.toString(),
        });
        console.log(result.data);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    };
    getApprovedCourses();
  }, [dispatch, searchParams]);

  return (
    <>
      <Navbar />
      <div className="pt-6 md:pt-8 xl:pt-10">
        {/* Hero Section */}
        <div className="min-h-screen xl:h-[100vh] bg-auth py-12 md:py-16 xl:py-24 px-4 sm:px-8 md:px-16 xl:px-40 flex items-center">
          <div className="flex flex-col-reverse xl:flex-row justify-between items-center w-full gap-y-10 xl:gap-y-0">
            <div className="flex flex-col gap-y-4 w-full xl:w-[45%] text-center xl:text-left items-center xl:items-start">
              <p className="p-2 bg-primary-purple-light rounded-[8px] w-full sm:w-auto xl:w-[70%] text-surface-white text-title-md xl:text-title-lg font-medium">
                Hơn 50000 học viên đã tin tưởng
              </p>
              <div className="flex flex-col gap-y-1 text-display-md md:text-display-lg font-bold">
                <p className="text-surface-white">Học lập trình</p>
                <p className="text-surface-white">cùng</p>
                <p className="text-yellow-300">LMS</p>
              </div>
              <p className="text-headline-sm md:text-headline-md text-surface-white font-medium">
                Nền tảng học tập lập trình trực tuyến hiện đại. Danh mục khóa
                học đa dạng
              </p>
              <div className="flex flex-col sm:flex-row justify-center xl:justify-between gap-4 w-full sm:w-auto mt-2">
                <button
                  onClick={() => navigate("/courses")}
                  className="flex justify-center xl:justify-between gap-x-4 items-center py-2.5 px-4 rounded-[8px] bg-surface-white text-brand-blue text-title-md xl:text-title-lg font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
                >
                  Khám phá khóa học
                  <FaArrowRight />
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="py-2.5 px-8 rounded-[8px] bg-surface-white text-brand-blue text-title-md xl:text-title-lg font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
            <div className="w-full sm:w-[80%] xl:w-[45%] py-4 xl:py-16">
              <img
                src={image}
                alt="Hero"
                className="w-full h-auto object-cover rounded-[16px] shadow-lg xl:shadow-none"
              />
            </div>
          </div>
        </div>
        {/* Featured Courses Section */}
        <div className="flex flex-col gap-y-8 md:gap-y-12 xl:gap-y-16 py-12 md:py-16 px-4 sm:px-8 md:px-16 xl:px-40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 sm:gap-y-0">
            <div className="flex flex-col gap-y-1">
              <p className="text-surface-nav text-headline-lg md:text-display-md font-bold">
                Khóa học nổi bật
              </p>
              <p className="text-title-md xl:text-title-lg text-nav-muted">
                Các khóa học mới cập nhật gần đây
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="flex gap-x-4 items-center py-2 px-4 border border-gray-300 rounded-[8px] text-surface-nav text-title-md xl:text-title-lg font-medium transition-transform duration-300 hover:cursor-pointer hover:bg-surface-bg w-full sm:w-auto justify-center"
            >
              Xem tất cả
              <FaArrowRight />
            </button>
          </div>
          <ListCourses courses={courses} isLoading={isLoading} />
        </div>
        {/* Stats / Value Props Section */}
        <div className="bg-surface-white py-12 md:py-16 px-4 sm:px-8 md:px-16 xl:px-48">
          <div className="grid grid-cols-2 md:grid-cols-4 xl:flex xl:justify-between gap-6 xl:gap-0">
            {items?.map((value, index) => (
              <div
                key={index}
                className="flex flex-col gap-y-3 md:gap-y-4 w-full xl:w-[12%] text-center xl:text-left items-center xl:items-start"
              >
                <div
                  className={`w-full py-4 md:py-5 rounded-[16px] ${value.bgColor} text-display-md md:text-display-lg flex items-center justify-center`}
                >
                  {value.icon}
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-headline-lg md:text-display-md text-surface-nav font-bold">
                    {value.mainText}
                  </p>
                  <p className="text-title-md xl:text-title-lg text-nav-muted font-medium">
                    {value.subText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Popular Categories Section */}
        <div className="flex flex-col gap-y-8 md:gap-y-10 bg-gray-100 py-12 md:py-16 px-4 sm:px-8 md:px-16 xl:px-40">
          <div className="flex flex-col gap-y-1 w-full md:w-[70%] xl:w-[40%] mx-auto text-center">
            <p className="text-surface-nav text-headline-lg md:text-display-sm font-bold">
              Danh mục phổ biến
            </p>
            <p className="text-title-md xl:text-title-lg text-nav-muted">
              Khám phá các chủ đề lập trình hàng đầu
            </p>
          </div>
          {categories?.length == 0 ? (
            <img width={100} className="mx-auto" src={loading} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:justify-between gap-4 md:gap-6 xl:gap-0">
              {categories?.map((value, index) => {
                const bgColors = [
                  "bg-blue-100",
                  "bg-purple-100",
                  "bg-green-100",
                ];
                const iconColors = [
                  "text-brand-blue",
                  "text-purple-500",
                  "text-green-500",
                ];
                const colorIdx = index % 3;
                return (
                  <div
                    onClick={() =>
                      navigate(
                        `/courses?search=${encodeURIComponent(
                          value.item.category_name
                        )}`
                      )
                    }
                    key={index}
                    className="flex flex-col gap-y-4 w-full xl:w-[32%] border border-surface-bg rounded-[16px] bg-surface-white py-6 md:py-8 text-center transition-all duration-300 hover:shadow-lg hover:cursor-pointer"
                  >
                    <div
                      className={`mx-auto py-3 px-3 md:py-4 md:px-4 rounded-[16px] ${bgColors[colorIdx]}`}
                    >
                      <IoBookOutline
                        className={`text-display-sm md:text-display-md ${iconColors[colorIdx]} font-medium`}
                      />
                    </div>
                    <div className="flex flex-col gap-y-1 px-4">
                      <p className="text-headline-sm text-surface-nav font-medium">
                        {value.item.category_name}
                      </p>
                      <p className="text-body-md md:text-body-lg text-nav-muted">
                        {value.numberCourse} khóa học
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {me && <ChatBotAI />}
      <Footer />
    </>
  );
};
export default LandingPage;
