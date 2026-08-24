import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoListOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import PaginationButton from "../../components/PaginationButton";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { ratingService } from "../../services/ratingService";
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
      <div className="w-[100%] py-8">
        <div className="h-[70px] flex flex-col justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý bình luận
          </p>
          <p className="text-title-lg text-nav-muted">
            Quản lý tất cả bình luận trên nền tảng
          </p>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[95%]">
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
                className={`flex py-4 ${
                  idx == index && borderBottomColors[index]
                }`}
                onClick={() => {
                  setIdx(index);
                  setStatus(value.status);
                }}
                key={index}
              >
                <div
                  className={`flex gap-x-2 items-center px-6 text-title-sm font-medium ${
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
        <div className="flex flex-col gap-y-6 w-[95%]">
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : comments?.items?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có bình luận nào</p>
            </div>
          ) : (
            <table className="border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
              <thead>
                <tr className="flex items-center justify-between text-surface-nav font-medium">
                  <td className="w-[25%] p-2">Người dùng</td>
                  <td className="w-[15%]">Khóa học</td>
                  <td className="w-[25%]">Bình luận</td>
                  <td className="w-[15%] text-center">Trạng thái</td>
                  <td className="w-[20%] p-2 text-right">Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {comments?.items?.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                      key={value?._id}
                    >
                      <td className="flex items-center gap-x-2 w-[25%] p-2">
                        <img
                          className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                          src={value?.user_id?.avatar}
                          referrerPolicy="no-referrer"
                        />
                        <p className="text-surface-nav text-title-lg font-medium">
                          {value?.user_id?.full_name}
                        </p>
                      </td>
                      <td className="w-[15%] text-title-sm text-surface-nav">
                        <p>{value?.course_id?.course_name}</p>
                      </td>
                      <td className="w-[25%] text-title-sm text-surface-nav">
                        <p>{value?.comment}</p>
                      </td>
                      <td className="w-[15%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value?.status
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value?.status ? "Hiển thị" : "Đã ẩn"}
                        </p>
                      </td>
                      <td className="flex justify-end w-[20%] pe-2">
                        <button
                          onClick={() => {
                            const commentId = value?._id;
                            const comment = comments?.items?.find(
                              (value) => value?._id === commentId
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
                          {value?.status ? "Ẩn bình luận" : "Hiện bình luận"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
