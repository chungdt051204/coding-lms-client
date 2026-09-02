import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageService } from "../services/messageService";
import { socket } from "../../socket";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

const ConversationDetail = ({
  setRefresh,
  setConversation,
  conversationInfo,
  me,
  getRole,
  isClicked,
  setIsClicked,
  isDropdown,
  setIsDropdown,
}) => {
  const navigate = useNavigate();
  const currentRole = getRole({ roleId: me?.role_id?._id });
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  useEffect(() => {
    socket.on("received-message", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data?.newMessage]);
      setChatMessage("");
    });
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (conversationInfo?.messages) setMessages(conversationInfo?.messages);
  }, [conversationInfo?.messages]);
  useEffect(() => {
    console.log(conversationInfo?.conversationId);
    if (conversationInfo?.conversationId) {
      socket.emit("join-conversation", conversationInfo?.conversationId); //Join vào cuộc hội thoại
      const readAllMessagesByConversation = async () => {
        try {
          const result = await messageService.readAllMesssagesByConversation({
            conversationId: conversationInfo?.conversationId,
          });
          console.log(result);
          setRefresh((prev) => prev + 1);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      readAllMessagesByConversation();
    }
  }, [conversationInfo?.conversationId, setRefresh]);
  const handleSendMessage = async () => {
    if (chatMessage) {
      const data = {
        senderId: me?._id,
        userId: conversationInfo?.userId,
        instructorId: conversationInfo?.instructorId,
        courseId: conversationInfo?.courseId,
        message: chatMessage,
      };
      socket.emit("send-message", data);
    }
  };
  return (
    <>
      {isClicked && (
        <div
          className={`w-[350px] border fixed right-5 bg-surface-white z-10 ${
            isDropdown ? "top-20" : "bottom-20"
          } border-none shadow-md rounded-[16px]`}
        >
          <div
            className={`h-[65px] bg-auth rounded-t-[16px] px-6 py-3 ${
              !isDropdown && "rounded-b-[16px]"
            }`}
          >
            <div className="flex justify-between items-start text-surface-white">
              <div className="flex gap-x-2 items-center">
                {currentRole == "instructor" && (
                  <FaArrowLeft onClick={() => setConversation(null)} />
                )}
                <img
                  className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                  src={conversationInfo?.userAvatar}
                  alt=""
                />
                <div className="flex flex-col">
                  <p className="font-medium l text-title-sm">
                    {conversationInfo?.userFullName}
                  </p>
                  <p className="text-body-md">
                    {currentRole == "user" ? "Giảng viên" : "Học viên"}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-4 text-title-sm">
                <button
                  className="text-surface-bg hover:text-surface-white"
                  onClick={() => setIsDropdown((prev) => !prev)}
                >
                  {isDropdown ? <FaAngleDown /> : <FaAngleUp />}
                </button>
                <button
                  className="text-surface-bg hover:text-surface-white"
                  onClick={() => setIsClicked(false)}
                >
                  X
                </button>
              </div>
            </div>
          </div>
          {isDropdown && (
            <div className="z-10">
              {currentRole == "instructor" && (
                <div>
                  <div className="flex justify-between items-center text-brand-blue border-b border-b-blue-100 bg-blue-50 hover:bg-blue-100 transition-transform duration-300 h-[55px] px-6 py-3">
                    <div className="flex gap-x-2 items-center">
                      <img
                        className="w-[30px] h-[30px] object-contain rounded-[8px]"
                        src={conversationInfo?.courseImage}
                        alt=""
                      />
                      <p
                        onClick={() =>
                          navigate(`/course/${conversationInfo?.courseId}`)
                        }
                        className="text-title-sm font-medium hover:underline hover:cursor-pointer"
                      >
                        {conversationInfo?.courseName}
                      </p>
                    </div>
                    <FiExternalLink />
                  </div>
                  <div className="flex justify-between items-center border-b border-b-gray-100 bg-gray-50 transition-transform duration-300 px-6 py-3">
                    <div className="flex gap-x-2 items-center">
                      <img
                        className="w-[30px] h-[30px] object-contain rounded-[8px]"
                        src={conversationInfo?.userAvatar}
                        alt=""
                      />
                      <div className="flex flex-col gap-y-1">
                        <p className="text-body-lg font-medium">
                          {conversationInfo?.userFullName}
                        </p>
                        <p
                          onClick={() =>
                            navigate(
                              `/instructor/student/${conversationInfo?.userId}`
                            )
                          }
                          className="text-body-md text-brand-blue hover:underline hover:cursor-pointer"
                        >
                          Xem hồ sơ học viên
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`${
                  currentRole == "user" ? "h-[300px]" : "h-[240px]"
                } scroll-auto overflow-y-auto bg-gray-50 px-4 py-4`}
              >
                {currentRole == "user" && (
                  <div className="flex gap-x-2 mt-6">
                    <img
                      className="w-[30px] h-[30px] rounded-[1000px] object-cover"
                      src={conversationInfo?.userAvatar}
                      alt=""
                    />
                    <div className="w-[75%] bg-surface-white rounded-[16px] shadow-sm py-2 px-4">
                      <p className="text-body-sm text-surface-nav">
                        Xin chào! Tôi là {conversationInfo?.userFullName}. Bạn
                        có thắc mắc gì về khóa học không?
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-y-6 mt-6">
                  {messages?.map((value) => {
                    return (
                      <div
                        key={value._id}
                        className={`flex ${
                          (currentRole == "user" &&
                            getRole({ roleId: value?.sender_id?.role_id }) ==
                              "user") ||
                          (currentRole == "instructor" &&
                            getRole({ roleId: value?.sender_id?.role_id }) ==
                              "instructor")
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <p
                          className={`${
                            (currentRole == "user" &&
                              getRole({ roleId: value?.sender_id?.role_id }) ==
                                "user") ||
                            (currentRole == "instructor" &&
                              getRole({ roleId: value?.sender_id?.role_id }) ==
                                "instructor")
                              ? "bg-auth text-surface-white"
                              : "bg-surface-white text-surface-nav"
                          } text-body-sm rounded-[16px] shadow-sm py-2 px-4 w-fit`}
                        >
                          {value.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-surface-white h-[60px] rounded-b-[16px] border-t-gray-100 px-4 py-2">
                <div className="flex gap-x-4 items-center">
                  <input
                    onChange={(e) => setChatMessage(e.target.value)}
                    value={chatMessage}
                    className="px-4 py-2 text-title-sm text-surface-nav rounded-[16px] w-[80%] border border-gray-200 bg-gray-50 outline-none"
                    type="text"
                    placeholder="Nhập câu hỏi..."
                  />
                  <div
                    onClick={handleSendMessage}
                    className={`p-2 rounded-[12px] bg-auth hover:cursor-pointer ${
                      !chatMessage ? "opacity-50" : "hover:opacity-90"
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
export default ConversationDetail;
