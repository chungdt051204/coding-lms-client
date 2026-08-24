import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuDollarSign } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import { notificationService } from "../services/notificationService";
import {
  deleteReadNotification,
  setNotifications,
} from "../stores/features/notificationSlice";
import { LuInbox } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { BsClipboard2Check } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const { items: notifications } = useSelector((state) => state.notifications);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả",
    },
    {
      status: "unread",
      title: "Chưa đọc",
    },
  ];
  const [idx, setIdx] = useState(0);
  const currentStatus = filterTabs[idx].status;
  const displayNotifications = notifications?.filter((value) => {
    if (currentStatus == "") return value;
    else return value.is_read == false;
  });
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
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
  }, [isLoading, me, navigate]);

  const handleMarkAsAllRead = async () => {
    try {
      const result = await notificationService.markAsAllRead();
      dispatch(setNotifications(result.data));
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleDeleteReadNotifications = async () => {
    try {
      const readNotifications = notifications?.filter((value) => value.is_read);
      for (const item of readNotifications) {
        dispatch(deleteReadNotification(item._id));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const result = await notificationService.deleteReadNotifications();
      console.log(result);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="py-24 px-40 h-[100vh]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-2 justify-between">
            <p className="text-display-sm text-surface-nav font-bold">
              Thông báo
            </p>
            <p className="text-title-lg text-nav-muted">
              Cập nhật các thông báo mới nhất của bạn
            </p>
          </div>

          {notifications?.length > 0 && (
            <div className="flex gap-x-4">
              <button
                onClick={handleMarkAsAllRead}
                className="px-4 py-2 rounded-[8px] bg-surface-white border border-gray-200 text-body-lg text-surface-nav font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
              >
                Đánh dấu tất cả đã đọc
              </button>
              <button
                onClick={handleDeleteReadNotifications}
                className="px-4 py-2 rounded-[8px] bg-surface-nav  text-body-lg text-surface-white font-medium transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                Xóa thông báo đã đọc
              </button>
            </div>
          )}
        </div>
        {notifications?.length > 0 && (
          <div className="flex justify-evenly mt-6 px-2 py-1 bg-surface-bg rounded-[8px] border border-surface-bg w-[16%]">
            {filterTabs?.map((value, index) => {
              return (
                <div
                  onClick={() => setIdx(index)}
                  key={index}
                  className={`hover:cursor-pointer p-1 rounded-[8px] ${
                    idx == index && "bg-surface-white"
                  }`}
                >
                  <p className="text-title-sm text-surface-nav font-medium">
                    {value.title}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col gap-y-4 mt-6">
          {displayNotifications?.length > 0 ? (
            <AnimatePresence>
              {displayNotifications?.map((value) => {
                return (
                  <motion.div
                    key={value._id}
                    exit={{
                      x: 300,
                      opacity: 0,
                      transition: {
                        duration: 0.3,
                      },
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex justify-between items-start px-4 pt-4 pb-8 border rounded-[16px] ${
                      !value.is_read
                        ? "border-brand-blue"
                        : "bg-surface-white border-gray-200"
                    }`}
                  >
                    <div className="flex gap-x-4 items-start">
                      <div className="p-2 shadow-md rounded-[8px] text-headline-md text-brand-blue">
                        {value.type == "PAYMENT" ? (
                          <LuDollarSign />
                        ) : value.type == "ENROLLMENT" ? (
                          <BsClipboard2Check />
                        ) : value.type == "COMMENT" ? (
                          <FaRegComment />
                        ) : value.type == "ACCOUNT" ? (
                          <FiUser />
                        ) : (
                          <IoBookOutline />
                        )}
                      </div>
                      <div className="flex flex-col gap-y-2 w-[90%]">
                        <p className="text-headline-sm text-surface-nav font-medium">
                          {value.title}
                        </p>
                        <p className="text-title-sm text-nav-muted">
                          {value.message}
                        </p>
                        <p className="text-label-sm text-nav-muted">
                          {getTime({ time: value.createdAt })}
                        </p>
                      </div>
                    </div>
                    {!value.is_read && (
                      <p className="px-2 py-1 bg-brand-blue rounded-[8px] text-label-lg text-surface-white font-medium">
                        Mới
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Bạn chưa có thông báo nào</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Notifications;
