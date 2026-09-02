import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { conversationService } from "../services/conversationService";
import { socket } from "../../socket";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaFacebookMessenger } from "react-icons/fa";
import { LuInbox } from "react-icons/lu";
import ConversationDetail from "./ConversationDetail";

const Conversations = ({ me }) => {
  const { items: roles } = useSelector((state) => state.roles);
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const getRole = ({ roleId }) => {
    const role = roles?.find((value) => value._id == roleId);
    return role?.role;
  };
  const [refresh, setRefresh] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [isDropdown, setIsDropdown] = useState(true);

  const conversationInfo = {
    conversationId: conversation?.item?._id,
    userId: conversation?.item?.user_id?._id,
    instructorId: me?._id,
    courseId: conversation?.item?.course_id?._id,
    userAvatar: conversation?.item?.user_id?.avatar,
    userFullName: conversation?.item?.user_id?.full_name,
    courseImage: conversation?.item?.course_id?.image_url,
    courseName: conversation?.item?.course_id?.course_name,
    messages: conversation?.messages,
  };
  const getTime = ({ time }) => {
    const secondsDifference = Math.floor((new Date() - new Date(time)) / 1000);
    if (secondsDifference < 60) return "Vừa xong";
    else if (secondsDifference < 3600)
      return `${Math.floor(secondsDifference / 60)} phút trước`;
    else if (secondsDifference < 86400)
      return `${Math.floor(secondsDifference / 3600)} giờ trước`;
    else if (secondsDifference < 2592000)
      return `${Math.floor(secondsDifference / 86400)} ngày trước`;
    return `${Math.floor(secondsDifference / 2592000)} tháng trước`;
  };
  useEffect(() => {
    socket.on("new-message", (data) => {
      setRefresh((prev) => prev + 1);
      console.log(data);
    });
  }, []);
  useEffect(() => {
    const getConversationsByInstructor = async () => {
      try {
        const result = await conversationService.getConversationsByInstructor();
        console.log(result.data);
        setConversations(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getConversationsByInstructor();
  }, [refresh]);
  const handleSelectedConversation = async ({ conversationId }) => {
    try {
      const result = await conversationService.getConversationById({
        conversationId,
      });
      console.log(result.data);
      setConversation(result.data);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };

  return (
    <>
      <div className="relative">
        <FaFacebookMessenger
          onClick={() => setIsClicked((prev) => !prev)}
          className="text-headline-md text-brand-blue"
        />
        {conversations?.totalUnreadMessages > 0 && (
          <div className="absolute bottom-4 left-4 bg-red-500 w-[20px] h-[20px] rounded-[1000px] text-center text-surface-white text-body-md">
            {conversations?.totalUnreadMessages}
          </div>
        )}
      </div>
      {isClicked && !conversation ? (
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
              <div className="flex gap-x-2">
                <IoChatbubblesOutline className="text-headline-md" />
                <p className="font-medium l text-title-sm">Tin nhắn</p>
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
              <div className="h-[350px] scroll-auto overflow-y-auto bg-surface-white rounded-[16px]">
                {conversations?.arrayConversation?.length > 0 ? (
                  conversations?.arrayConversation?.map((value) => {
                    return (
                      <div
                        onClick={() =>
                          handleSelectedConversation({
                            conversationId: value?.item?._id,
                          })
                        }
                        key={value?.item?._id}
                        className="flex justify-between p-3 items-center transition-transform duration-300 hover:bg-gray-50 hover:cursor-pointer"
                      >
                        <div className="flex gap-x-4">
                          <div className="relative">
                            <img
                              className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                              src={value?.item?.user_id?.avatar}
                              alt=""
                              referrerPolicy="no-referrer"
                            />
                            {value?.unreadMessages > 0 && (
                              <div className="absolute bottom-12 left-7 bg-blue-500 w-[20px] h-[20px] rounded-[1000px] text-center text-surface-white text-body-md">
                                {value?.unreadMessages}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col font-medium">
                            <p className="text-title-sm text-surface-nav">
                              {value?.item?.user_id?.full_name}
                            </p>
                            <p
                              className={`text-body-md ${
                                !value?.item?.newest_message_id?.is_read &&
                                getRole({
                                  roleId:
                                    value?.item?.newest_message_id?.sender_id
                                      ?.role_id,
                                }) == "user"
                                  ? "text-surface-nav"
                                  : "text-nav-muted"
                              }`}
                            >
                              {getRole({
                                roleId:
                                  value?.item?.newest_message_id?.sender_id
                                    ?.role_id,
                              }) == "instructor"
                                ? "Bạn:" +
                                  " " +
                                  value?.item?.newest_message_id?.message
                                : value?.item?.newest_message_id?.message}
                            </p>
                            <p className="text-body-md text-brand-blue">
                              {value?.item?.course_id?.course_name}
                            </p>
                          </div>
                        </div>
                        <p className="text-body-md text-nav-muted">
                          {getTime({
                            time: value?.item?.newest_message_id?.createdAt,
                          })}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
                    <LuInbox className="text-display-md text-gray-300" />
                    <p>Chưa có cuộc hội thoại nào</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <ConversationDetail
          setRefresh={setRefresh}
          setConversation={setConversation}
          conversationInfo={conversationInfo}
          me={me}
          getRole={getRole}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
          isDropdown={isDropdown}
          setIsDropdown={setIsDropdown}
        />
      )}
    </>
  );
};
export default Conversations;
