import { useState } from "react";
import { aiService } from "../services/aiService";
import chatbotAI from "../assets/ChatBotAI.png";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import loadingIcon from "../assets/three-dots.gif";
import { FiSend } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { format } from "../../helper/format";
import { useNavigate } from "react-router-dom";
import { Progress } from "antd";
import { LuBot } from "react-icons/lu";
import idle from "../assets/idle.gif";
import typing from "../assets/typing.gif";
import thinking from "../assets/thinking.gif";
import answering from "../assets/answering.gif";
import done from "../assets/done.gif";
const gifs = [idle, typing, thinking, answering, done];
const ChatBotAI = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isDropdown, setIsDropdown] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSended, setIsSended] = useState(false);
  const [idx, setIdx] = useState(0);
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setIdx(2);
    setIsLoading(true);
    setIsSended(true);
    setMessages((prev) => [
      ...prev,
      { message: input, type: "text", sender: "user" },
    ]);
    try {
      const result = await aiService.sendMessage({ input });
      setIdx(3);
      console.log(result);
      console.log(result.data);
      console.log(result.intent);
      switch (result?.intent) {
        case "GREETING":
        case "PROGRAMMING_QUESTION":
        case "OUT_OF_SCOPE":
          setMessages((prev) => [
            ...prev,
            { message: result?.data, type: "text", sender: "chatbot-ai" },
          ]);
          break;
        case "SEARCH_COURSE":
          setMessages((prev) => [
            ...prev,
            {
              message:
                result?.data?.length > 0
                  ? "Dưới đây là danh sách khóa học bạn cần tìm"
                  : "Không tìm thấy khóa học thỏa yêu cầu của bạn",
              type: result?.data?.length > 0 ? "course_list" : "text",
              data: result?.data,
              sender: "chatbot-ai",
            },
          ]);
          break;
        case "LEARNING_PROGRESS":
          setMessages((prev) => [
            ...prev,
            {
              message:
                result?.data?.length > 0
                  ? "Dưới đây là danh sách các khóa học đã đăng ký và tiến độ từng khóa học của bạn"
                  : "Bạn chưa đăng ký khóa học nào, không thể xem tiến độ học tập",
              type: result?.data?.length > 0 ? "learning_progress" : "text",
              data: result?.data,
              sender: "chatbot-ai",
            },
          ]);
          break;
        default:
          break;
      }
      setIsSended(false);
      setInput("");
      setTimeout(() => {
        setIdx(4);
        setTimeout(() => {
          setIdx(0);
        }, 1000);
      }, 1000);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {!isClicked ? (
        <button
          onClick={() => setIsClicked((prev) => !prev)}
          className="fixed flex gap-x-2 items-center bottom-5 right-5 py-2 px-4 bg-blue-500 text-white rounded-[16px] font-medium transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
        >
          <LuBot className="text-headline-md" />
          Chatbot AI
        </button>
      ) : (
        <button
          onClick={() => setIsClicked(false)}
          className="fixed bottom-5 right-5 py-2 px-4 bg-blue-500 text-white rounded-[16px] font-medium transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
        >
          X
        </button>
      )}
      {isClicked && (
        <div className="fixed bottom-20 right-5 bg-surface-white w-[380px] rounded-[16px] shadow-md">
          <div className="p-4 bg-blue-500 h-[80px] rounded-t-[16px]">
            <div className="flex justify-between items-start">
              <div className="flex gap-x-4">
                <img
                  src={gifs[idx]}
                  alt=""
                  width={60}
                  height={60}
                  className="object-cover"
                />
                <div className="flex flex-col text-surface-white">
                  <p className="text-title-sm font-medium">ChatBot AI</p>
                  <p className="text-body-md">
                    Trợ lý học lập trình trực tuyến
                  </p>
                </div>
              </div>
              <div className="flex gap-x-2 text-title-sm text-surface-white">
                <button onClick={() => setIsDropdown((prev) => !prev)}>
                  {isDropdown ? <FaAngleDown /> : <FaAngleUp />}
                </button>
                <button onClick={() => setIsClicked(false)}>X</button>
              </div>
            </div>
          </div>
          {isDropdown && (
            <div>
              <div className="h-[280px] overflow-y-auto scroll-auto bg-gray-50 p-4">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-4 items-start">
                    <div className="rounded-[1000px] p-2 bg-blue-200">
                      <img
                        src={chatbotAI}
                        alt=""
                        width={20}
                        height={20}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-y-2 bg-surface-white rounded-[16px] w-[80%] p-4 shadow-md text-body-md">
                      <p>
                        Xin chào! Tôi là ChatBot AI, trợ lý học lập trình của
                        bạn.
                      </p>
                      <p>
                        Tôi có thể giúp bạn tìm khóa học phù hợp, giải thích
                        kiến thức lập trình, hoặc hỗ trợ theo dõi tiến độ học
                        tập.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 mt-6">
                    {messages?.map((value, index) => {
                      switch (value.type) {
                        case "text":
                          return (
                            <div
                              key={index}
                              className={`flex ${
                                value.sender == "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex gap-x-4 items-start ${
                                  value.sender == "user" &&
                                  "w-[60%] justify-end"
                                }`}
                              >
                                {value.sender == "chatbot-ai" && (
                                  <div className="rounded-[1000px] p-2 bg-blue-200 shrink-0">
                                    <img
                                      src={chatbotAI}
                                      alt=""
                                      width={20}
                                      height={20}
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div
                                  className={`py-2 px-4 ${
                                    value.sender == "user"
                                      ? "bg-blue-500 text-surface-white"
                                      : "bg-surface-white text-surface-nav"
                                  } rounded-[16px] text-body-md shadow-md`}
                                >
                                  {value.message}
                                </div>
                              </div>
                            </div>
                          );
                        case "course_list":
                          return (
                            <div key={index}>
                              <div className="flex gap-x-4 items-start">
                                <div className="rounded-[1000px] p-2 bg-blue-200 shrink-0">
                                  <img
                                    src={chatbotAI}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                  />
                                </div>
                                <div className="py-2 px-4  bg-surface-white text-surface-nav rounded-[16px] text-body-md shadow-md">
                                  {value.message}
                                </div>
                              </div>
                              <div className="flex flex-col gap-y-3 mt-4">
                                {value?.data?.map((value, index) => {
                                  return (
                                    <div
                                      onClick={() =>
                                        navigate(`/course/${value?._id}`)
                                      }
                                      className="flex justify-between py-2 p-2 rounded-[8px] bg-surface-white shadow-sm transition-transform duration-300 hover:cursor-pointer hover:shadow-md"
                                      key={index}
                                    >
                                      <div className="flex gap-x-4">
                                        <img
                                          className="w-[80px] h-[80px] object-fill"
                                          src={value?.image_url}
                                          alt=""
                                        />
                                        <div>
                                          <p className="text-title-sm text-surface-nav font-medium">
                                            {value?.course_name}
                                          </p>
                                          <div className="flex flex-col text-body-md text-surface-nav">
                                            <p>Cấp độ: {value?.level}</p>
                                            <div className="flex gap-x-2">
                                              <p>Đánh giá:</p>
                                              <div className="flex gap-x-1 items-center">
                                                <p>{value?.rating_star}/5</p>
                                                <FaStar className="text-yellow-300" />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex flex-col text-body-md text-surface-nav">
                                            <p>
                                              {
                                                value?.category_id
                                                  ?.category_name
                                              }
                                            </p>
                                            <p>{value?.user_id?.full_name}</p>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-title-sm text-brand-blue font-bold">
                                        {format.formatPrice({
                                          price: value?.price,
                                        })}
                                        đ
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        case "learning_progress":
                          return (
                            <div key={index}>
                              <div className="flex gap-x-4 items-start">
                                <div className="rounded-[1000px] p-2 bg-blue-200 shrink-0">
                                  <img
                                    src={chatbotAI}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="object-cover"
                                  />
                                </div>
                                <div className="py-2 px-4  bg-surface-white text-surface-nav rounded-[16px] text-body-md shadow-md">
                                  {value.message}
                                </div>
                              </div>
                              <div className="flex flex-col gap-y-3 mt-4">
                                {value?.data?.map((value, index) => {
                                  return (
                                    <div
                                      onClick={() =>
                                        navigate(
                                          `/course/${value?.course_id?._id}`
                                        )
                                      }
                                      className="py-2 p-2 rounded-[8px] bg-surface-white shadow-sm transition-transform duration-300 hover:cursor-pointer hover:shadow-md"
                                      key={index}
                                    >
                                      <div className="flex gap-x-2">
                                        <img
                                          className="w-[80px] h-[80px] object-fill"
                                          src={value?.course_id?.image_url}
                                          alt=""
                                        />
                                        <div>
                                          <p className="text-title-sm text-surface-nav font-medium">
                                            {value?.course_id?.course_name}
                                          </p>
                                          <div className="flex gap-x-3 text-body-md text-surface-nav">
                                            <p>Tiến độ khóa học:</p>
                                            <Progress
                                              style={{ width: "100px" }}
                                              percent={value?.progress_percent}
                                            />
                                          </div>
                                          <div className="flex flex-col gap-y-1 text-body-md text-surface-nav">
                                            <p>Tiến độ bài học:</p>
                                            <div className="flex gap-x-2">
                                              <Progress
                                                showInfo={false}
                                                percent={
                                                  (value?.completed_lessons *
                                                    100) /
                                                  value?.total_lessons
                                                }
                                              />
                                              <p>
                                                {value?.completed_lessons}/
                                                {value?.total_lessons}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        default:
                          break;
                      }
                    })}
                  </div>
                  {isSended && isLoading && (
                    <div className="flex gap-x-4 items-start">
                      <div className="rounded-[1000px] p-2 bg-blue-200">
                        <img
                          src={chatbotAI}
                          alt=""
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                      <div className="py-2 px-4 bg-surface-white rounded-[16px] shadow-md">
                        <img src={loadingIcon} alt="" width={30} height={30} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-surface-white h-[60px] rounded-b-[16px] border-t-gray-100 px-4 py-2">
                <div className="flex gap-x-4 items-center">
                  <input
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setIdx(1);
                    }}
                    className="px-4 py-2 text-title-sm text-surface-nav rounded-[16px] w-[80%] border border-gray-200 bg-gray-50 outline-none"
                    type="text"
                    placeholder="Nhập câu hỏi..."
                  />
                  <div
                    onClick={handleSendMessage}
                    className={`p-2 rounded-[12px] bg-blue-500 hover:cursor-pointer ${
                      !input.trim() ? "opacity-50" : "hover:opacity-90"
                    }`}
                  >
                    <FiSend className="text-headline-sm text-surface-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ChatBotAI;
