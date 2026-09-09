import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ratingService } from "../../services/ratingService";
import { toast } from "react-toastify";
import { IoListOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import PaginationButton from "../../components/PaginationButton";
import ConfirmDialog from "../../components/ConfirmDialog";

const Comments = () => {
  const [searchParams] = useSearchParams();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả bình luận",
      icon: <IoListOutline />,
    },
    {
      status: "active",
      title: "Hiển thị",
      icon: <FaRegEye />,
    },
    {
      status: "inactive",
      title: "Đã ẩn",
      icon: <FaRegEyeSlash className="text-title-lg" />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  const [message, setMessage] = useState("");
  const confirmDialog = useRef();

  useEffect(() => {
    const getRatings = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await ratingService.getRatings({
          params: params.toString(),
        });
        console.log(result.data);
        setComments(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getRatings();
  }, [refresh, searchParams, status]);
  const handleUpdateStatusComment = async () => {
    try {
      const result = await ratingService.hideOrShowComment({
        ratingId: comment?._id,
      });
      console.log(result);
      confirmDialog?.current?.close();
      setRefresh((prev) => prev + 1);
      toast.success(result?.message || "Ẩn/Hiển bình luận thành công");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex flex-col gap-y-1">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý bình luận
          </p>
          <p className="text-title-lg text-nav-muted">
            Quản lý tất cả bình luận trên nền tảng
          </p>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] overflow-x-auto scroll-smooth">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-green-600",
              "border-b-2 border-b-red-600",
            ];
            const textColors = [
              "text-blue-600",
              "text-green-600",
              "text-red-600",
            ];
            return (
              <div
                className={`flex justify-center sm:justify-start py-4 shrink-0 sm:w-auto hover:cursor-pointer ${
                  idx == index && borderBottomColors[index]
                }`}
                onClick={() => {
                  setIdx(index);
                  setStatus(value.status);
                }}
                key={index}
              >
                <div
                  className={`flex gap-x-2 items-center px-3 sm:px-6 text-title-sm font-medium ${
                    idx == index ? textColors[index] : "text-nav-muted"
                  }`}
                >
                  {value.icon}
                  <p>{value.title}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-y-6">
          {isLoading ? (
            <p className="text-title-lg text-surface-nav text-center mt-2">
              Đang tải dữ liệu...
            </p>
          ) : comments?.items?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có bình luận nào</p>
            </div>
          ) : (
            <>
              <div className="hidden xl:block w-full overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 overflow-hidden border border-surface-bg rounded-[16px] mt-6">
                  <thead>
                    <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-surface-bg">
                      <td className="w-[25%] p-2">Người dùng</td>
                      <td className="w-[15%]">Khóa học</td>
                      <td className="w-[20%]">Bình luận</td>
                      <td className="w-[15%] text-center">Trạng thái</td>
                      <td className="w-[20%] p-2 text-right">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {comments?.items?.length > 0 ? (
                      comments?.items?.map((value) => {
                        return (
                          <tr
                            className="flex justify-between items-center border-t border-surface-bg hover:bg-surface-bg"
                            key={value?._id}
                          >
                            <td className="flex items-center gap-x-2 w-[25%] p-2">
                              <img
                                className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                                src={value?.user_id?.avatar}
                                referrerPolicy="no-referrer"
                                alt=""
                              />
                              <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                {value?.user_id?.full_name}
                              </p>
                            </td>
                            <td className="w-[15%] text-title-sm text-surface-nav">
                              <p>{value?.course_id?.course_name}</p>
                            </td>
                            <td className="w-[20%] text-title-sm text-surface-nav wrap-break-word">
                              <p>{value?.comment}</p>
                            </td>
                            <td className="w-[15%] px-2">
                              <p
                                className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                                  value?.status
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                {value?.status ? "Hiển thị" : "Đã ẩn"}
                              </p>
                            </td>
                            <td className="flex justify-end w-[20%] pe-2">
                              <button
                                onClick={() => {
                                  const commentId = value?._id;
                                  const comment = comments?.items?.find(
                                    (v) => v?._id === commentId
                                  );
                                  setComment(comment);
                                  setMessage(
                                    `Bạn có muốn ${
                                      value?.status ? "ẩn" : "hiện"
                                    } bình luận này không ? `
                                  );
                                  confirmDialog?.current?.showModal();
                                }}
                                className={`px-2 py-1 rounded-[8px] text-title-sm text-surface-white ${
                                  value?.status ? "bg-red-600" : "bg-green-600"
                                } transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer`}
                              >
                                {value?.status
                                  ? "Ẩn bình luận"
                                  : "Hiện bình luận"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-nav-muted"
                        >
                          Chưa có bình luận nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 mt-6 xl:hidden w-full">
                {comments?.items?.length > 0 ? (
                  comments?.items?.map((value) => {
                    return (
                      <div
                        key={value?._id}
                        className="flex flex-col gap-y-3 p-4 border border-surface-bg rounded-[16px] bg-surface-white shadow-sm"
                      >
                        <div className="flex flex-col gap-y-2 md:justify-between md:items-start md:gap-x-3">
                          <div className="flex gap-x-3 items-center min-w-0">
                            <img
                              src={value?.user_id?.avatar}
                              referrerPolicy="no-referrer"
                              className="w-[60px] h-[60px] rounded-full object-cover shrink-0"
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                {value?.user_id?.full_name}
                              </p>
                              <p className="text-nav-muted text-body-lg wrap-break-word">
                                {value?.course_id?.course_name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-center text-body-md font-medium rounded-[8px] px-2.5 py-1 shrink-0 ${
                              value?.status
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}
                          >
                            {value?.status ? "Hiển thị" : "Đã ẩn"}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-surface-bg p-3 rounded-[12px]">
                          <p className="text-caption text-nav-muted mb-1 font-medium">
                            Nội dung bình luận:
                          </p>
                          <p className="text-surface-nav text-body-lg wrap-break-word">
                            {value?.comment}
                          </p>
                        </div>
                        <div className="flex justify-end items-center pt-2 border-t border-surface-bg font-medium">
                          <button
                            onClick={() => {
                              const commentId = value?._id;
                              const comment = comments?.items?.find(
                                (v) => v?._id === commentId
                              );
                              setComment(comment);
                              setMessage(
                                `Bạn có muốn ${
                                  value?.status ? "ẩn" : "hiện"
                                } bình luận này không ? `
                              );
                              confirmDialog?.current?.showModal();
                            }}
                            className={`px-3 py-1.5 rounded-[8px] text-body-lg text-surface-white ${
                              value?.status ? "bg-red-600" : "bg-green-600"
                            } hover:cursor-pointer transition-colors`}
                          >
                            {value?.status ? "Ẩn bình luận" : "Hiện bình luận"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-nav-muted border border-surface-bg rounded-[16px]">
                    Chưa có bình luận nào
                  </div>
                )}
              </div>
            </>
          )}
          {comments?.totalPages > 1 && (
            <PaginationButton totalPages={comments?.totalPages} />
          )}
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={handleUpdateStatusComment}
      />
    </>
  );
};
export default Comments;
