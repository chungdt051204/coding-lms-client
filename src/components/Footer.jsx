import { useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col gap-y-8 py-16 px-8 md:px-16 bg-auth">
        <div className="flex justify-end">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-2 rounded-[1000px] bg-surface-bg transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
          >
            <FaArrowUp />
          </button>
        </div>
        <div className="flex flex-col gap-y-2 text-center text-surface-white">
          <p className="text-display-md font-bold">
            Bắt đầu hành trình học tập ngay hôm nay
          </p>
          <p className="text-title-lg">
            Tham gia cùng hàng nghìn học viên đang nâng cao kỹ năng lập trình
            của họ
          </p>
        </div>
        <button
          onClick={() => navigate("/courses")}
          className="flex justify-between gap-x-4 items-center lg:w-[25%] md:w-[45%] sm:w-[80%] mx-auto py-2 px-4 rounded-[8px] bg-surface-white text-brand-blue text-title-sm md:text-title-lg font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
        >
          Khám phá khóa học
          <FaArrowRight />
        </button>
      </div>
    </>
  );
};
export default Footer;
