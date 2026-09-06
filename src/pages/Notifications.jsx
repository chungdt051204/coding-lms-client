import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notificationService } from "../services/notificationService";
import {
  deleteReadNotification,
  setNotifications,
} from "../stores/features/notificationSlice";
import { LuDollarSign } from "react-icons/lu";
import { IoBookOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import { BsClipboard2Check } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      <div className="pt-20 lg:pt-24 pb-12 px-4 sm:px-8 md:px-16 lg:px-40 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col gap-y-4 lg:flex-row lg:justify-between lg:items-start">
          <div className="flex flex-col gap-y-1 sm:gap-y-2">
            <p className="text-headline-md sm:text-display-xs lg:text-display-sm text-surface-nav font-bold">
              Thông báo
            </p>
            <p className="text-body-md sm:text-title-md lg:text-title-lg text-nav-muted">
              Cập nhật các thông báo mới nhất của bạn
            </p>
          </div>
          {notifications?.length > 0 && (
            <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4">
              <button
                onClick={handleMarkAsAllRead}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-[8px] bg-surface-white border border-gray-200 text-body-sm sm:text-body-md lg:text-body-lg text-surface-nav font-medium transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
              >
                Đánh dấu tất cả đã đọc
              </button>
              <button
                onClick={handleDeleteReadNotifications}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-[8px] bg-surface-nav text-body-sm sm:text-body-md lg:text-body-lg text-surface-white font-medium transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                Xóa thông báo đã đọc
              </button>
            </div>
          )}
        </div>
        {/* Filter Tabs */}
        {notifications?.length > 0 && (
          <div className="flex justify-between sm:justify-evenly mt-6 px-1.5 sm:px-2 py-1 bg-surface-bg rounded-[8px] border border-surface-bg w-full sm:w-[320px] md:w-[32%] lg:w-[20%]">
            {filterTabs?.map((value, index) => {
              return (
                <div
                  onClick={() => setIdx(index)}
                  key={index}
                  className={`flex-1 sm:flex-none text-center hover:cursor-pointer px-2 py-1 rounded-[8px] transition-colors ${
                    idx == index ? "bg-surface-white shadow-sm" : ""
                  }`}
                >
                  <p className="text-body-sm sm:text-title-sm text-surface-nav font-medium">
                    {value.title}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {/* Notifications List */}
        <div className="flex flex-col gap-y-4 mt-6 h-auto">
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
                    className={`flex justify-between items-start p-3.5 sm:p-4 lg:pt-4 lg:pb-8 border rounded-[16px] gap-x-2 sm:gap-x-4 ${
                      !value.is_read
                        ? "border-brand-blue bg-blue-50/20"
                        : "bg-surface-white border-gray-200"
                    }`}
                  >
                    <div className="flex gap-x-3 sm:gap-x-4 items-start flex-1 min-w-0">
                      <div className="p-2 shadow-md rounded-[8px] text-title-lg sm:text-headline-md text-brand-blue bg-surface-white shrink-0">
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
                      <div className="flex flex-col gap-y-1 sm:gap-y-2 flex-1 min-w-0 pr-1">
                        <p className="text-title-md sm:text-headline-sm text-surface-nav font-medium break-words">
                          {value.title}
                        </p>
                        <p className="text-body-sm sm:text-title-sm text-nav-muted break-words">
                          {value.message}
                        </p>
                        <p className="text-body-xs sm:text-label-sm text-nav-muted">
                          {getTime({ time: value.createdAt })}
                        </p>
                      </div>
                    </div>
                    {!value.is_read && (
                      <span className="px-2 py-0.5 sm:py-1 bg-brand-blue rounded-[6px] sm:rounded-[8px] text-body-xs sm:text-label-lg text-surface-white font-medium shrink-0">
                        Mới
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center gap-y-2 text-body-md sm:text-title-sm text-nav-muted mt-12 sm:mt-6 h-[100vh]">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Bạn chưa có thông báo nào</p>
            </div>
          )}
        </div>
      </div>
      {me?.role_id?.role == "user" && <Footer />}
    </>
  );
};
export default Notifications;
