import ListCourses from "../components/ListCourses";
import Navbar from "../components/Navbar";
import image from "../assets/image.png";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowRight } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { LuAward } from "react-icons/lu";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { courseService } from "../services/courseService";
import { setCourses } from "../stores/features/courseSlice";
import Footer from "../components/Footer";
import ChatBotAI from "../components/ChatBotAI";

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
      <div className="pt-10">
        <div className="h-[100vh] bg-auth py-24 px-40">
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-4 w-[45%]">
              <p className="p-2 bg-primary-purple-light rounded-[8px] w-[70%] text-surface-white text-title-lg font-medium">
                Hơn 50000 học viên đã tin tưởng
              </p>
              <div className="flex flex-col gap-y-1 text-display-lg font-bold">
                <p className="text-surface-white">Học lập trình</p>
                <p className="text-surface-white">cùng</p>
                <p className="text-yellow-300">LMS</p>
              </div>
              <p className="text-headline-md text-surface-white font-medium">
                Nền tảng học tập lập trình trực tuyến hiện đại. Danh mục khóa
                học đa dạng
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => navigate("/courses")}
                  className="flex justify-between gap-x-4 items-center py-2 px-4 rounded-[8px] bg-surface-white text-brand-blue text-title-lg font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
                >
                  Khám phá khóa học
                  <FaArrowRight />
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className=" py-2 px-8 rounded-[8px] bg-surface-white text-brand-blue text-title-lg font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
            <div className="w-[45%] py-16">
              <img src={image} alt="" className="rounded-[16px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-16 py-16 px-40">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-1">
              <p className="text-surface-nav text-display-md font-bold">
                Khóa học nổi bật
              </p>
              <p className="text-title-lg text-nav-muted">
                Các khóa học mới cập nhật gần đây
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="flex gap-x-4 items-center py-2 px-4 border border-gray-300 rounded-[8px] text-surface-nav text-title-lg font-medium transition-transform duration-300 hover:cursor-pointer hover:bg-surface-bg"
            >
              Xem tất cả
              <FaArrowRight />
            </button>
          </div>
          <ListCourses courses={courses} isLoading={isLoading} />
        </div>
        <div className="bg-surface-white py-16 px-48">
          <div className="flex justify-between">
            {items?.map((value, index) => {
              return (
                <div key={index} className="flex flex-col gap-y-4 w-[12%]">
                  <div
                    className={`w-full py-5 rounded-[16px] ${value.bgColor} text-display-lg`}
                  >
                    {value.icon}
                  </div>
                  <div className="flex-col gap-y-1">
                    <p className="text-display-md text-surface-nav font-bold">
                      {value.mainText}
                    </p>
                    <p className="text-title-lg text-nav-muted font-medium">
                      {value.subText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-y-10 bg-gray-100 py-16 px-40">
          <div className="flex flex-col gap-y-1 w-[40%] mx-auto text-center">
            <p className="text-surface-nav text-display-sm font-bold">
              Danh mục phổ biến
            </p>
            <p className="text-title-lg text-nav-muted">
              Khám phá các chủ đề lập trình hàng đầu
            </p>
          </div>
          <div className="flex justify-between">
            {categories?.map((value, index) => {
              const bgColors = ["bg-blue-100", "bg-purple-100", "bg-green-100"];
              const iconColors = [
                "text-brand-blue",
                "text-purple-500",
                "text-green-500",
              ];
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
                  className="flex flex-col gap-y-4 w-[32%] border border-surface-bg rounded-[16px] bg-surface-white py-8 text-center transition-shadow duration-300 hover:shadow-lg hover:cursor-pointer"
                >
                  <div
                    className={`mx-auto py-4 px-4 rounded-[16px] ${bgColors[index]}`}
                  >
                    <IoBookOutline
                      className={`text-display-md ${iconColors[index]} font-medium`}
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p className="text-headline-sm text-surface-nav font-medium">
                      {value.item.category_name}
                    </p>
                    <p className="text-body-lg text-nav-muted">
                      {value.numberCourse} khóa học
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {me && <ChatBotAI />}
      <Footer />
    </>
  );
};
export default LandingPage;
