import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import { socket } from "../../../socket";
import { IoListOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { IoBan } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import PaginationButton from "../../components/PaginationButton";
import ConfirmDialog from "../../components/ConfirmDialog";

const Instructors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [instructors, setInstructors] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả giảng viên",
      icon: <IoListOutline />,
    },
    {
      status: "active",
      title: "Đang hoạt động",
      icon: <CiCircleCheck />,
    },
    {
      status: "inactive",
      title: "Ngừng hoạt động",
      icon: <IoBan />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  const [message, setMessage] = useState("");
  const confirmDialog = useRef(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [reason, setReason] = useState("");
  const verifiedStatus = isApproved ? "VERIFIED" : "REJECTED";
  const rejectDialog = useRef();
  useEffect(() => {
    socket.on("account-review", () => {
      setRefresh((prev) => prev + 1);
    });
  }, []);
  useEffect(() => {
    const getInstructors = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await userService.getInstructors({
          params: params.toString(),
        });
        console.log(result.data);
        setInstructors(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getInstructors();
  }, [refresh, searchParams, status]);
  const handleUpdateStatusInstructor = async () => {
    try {
      const result = await userService.updateStatusUser({
        userId: instructor?._id,
      });
      console.log(result);
      confirmDialog?.current?.close();
      setRefresh((prev) => prev + 1);
      toast.success(
        result?.message || "Vô hiệu hóa/Kích hoạt tài khoản thành công"
      );
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleApprovedOrRejectedInstructor = async () => {
    if (isRejected) {
      confirmDialog?.current?.close();
      rejectDialog?.current?.showModal();
    } else if (isApproved) {
      try {
        const result = await userService.approvedOrRejectedInstructor({
          instructorId: instructor?._id,
          status: verifiedStatus,
          message: { message: reason },
        });
        toast.success(result?.message || "Duyệt tài khoản thành công");
        confirmDialog?.current?.close();
        setRefresh((prev) => prev + 1);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    }
  };
  const handleRejectedInstructor = async () => {
    try {
      const result = await userService.approvedOrRejectedInstructor({
        instructorId: instructor?._id,
        status: verifiedStatus,
        message: { message: reason },
      });
      toast.success(result?.message || "Từ chối tài khoản thành công");
      rejectDialog?.current?.close();
      setIsRejected(false);
      setReason("");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="h-[70px] flex flex-col justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý giảng viên
          </p>
          <p className="text-title-lg text-nav-muted">
            Xem và quản lý tất cả giảng viên trên nền tảng
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
            <p>Đang tải dữ liệu...</p>
          ) : instructors?.arrayInstructor?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có giảng viên nào</p>
            </div>
          ) : (
            <>
              <div className="hidden xl:block w-full overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
                  <thead>
                    <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-surface-bg">
                      <td className="w-[25%] p-2">Giảng viên</td>
                      <td className="w-[18%] text-center">
                        Trạng thái xác thực
                      </td>
                      <td className="w-[15%] text-center">Trạng thái</td>
                      <td className="w-[30%] p-2 text-right">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors?.arrayInstructor?.map((value) => {
                      return (
                        <tr
                          className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                          key={value?.item?._id}
                        >
                          <td className="flex items-center gap-x-2 w-[25%] p-2">
                            <img
                              className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                              src={value?.item?.avatar}
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-lg font-medium">
                                {value?.item?.full_name}
                              </p>
                              <p className="text-nav-muted text-body-lg">
                                {value?.item?.email}
                              </p>
                            </div>
                          </td>
                          <td
                            className={`w-[18%] text-body-md text-center font-medium rounded-[8px] py-1 ${
                              value?.item?.verified_status === "NOT_VERIFIED"
                                ? "bg-orange-100 text-orange-700"
                                : value?.item?.verified_status === "PENDING"
                                ? "bg-gray-100 text-gray-700"
                                : value?.item?.verified_status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {value?.item?.verified_status === "NOT_VERIFIED"
                              ? "Chưa xác thực"
                              : value?.item?.verified_status === "PENDING"
                              ? "Chờ xác thực"
                              : value?.item?.verified_status === "REJECTED"
                              ? "Bị từ chối"
                              : "Đã xác thực"}
                          </td>
                          <td className="w-[15%] px-2">
                            <p
                              className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                                value?.item?.status
                                  ? "text-green-700 bg-green-100"
                                  : "text-red-700 bg-red-100"
                              }`}
                            >
                              {value?.item?.status
                                ? "Đang hoạt động"
                                : "Ngừng hoạt động"}
                            </p>
                          </td>
                          <td className="flex justify-end gap-x-2 items-center w-[30%] pe-2">
                            {value?.item?.verified_status === "PENDING" && (
                              <div className="flex gap-x-2">
                                <button
                                  onClick={() => {
                                    const instructorId = value?.item?._id;
                                    const instructor =
                                      instructors?.arrayInstructor?.find(
                                        (v) => v?.item?._id == instructorId
                                      );
                                    setIsApproved(true);
                                    setInstructor(instructor?.item);
                                    setMessage(
                                      "Bạn có muốn duyệt tài khoản giảng viên này không ?"
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                  className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => {
                                    const instructorId = value?.item?._id;
                                    const instructor =
                                      instructors?.arrayInstructor?.find(
                                        (v) => v?.item?._id == instructorId
                                      );
                                    setIsApproved(false);
                                    setIsRejected(true);
                                    setInstructor(instructor?.item);
                                    setMessage(
                                      "Bạn có muốn từ chối tài khoản giảng viên này không ?"
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                  className="px-2 py-1 bg-brand-primary text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                                >
                                  Từ chối
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => {
                                const instructorId = value?.item?._id;
                                const instructor =
                                  instructors?.arrayInstructor?.find(
                                    (v) => v?.item?._id === instructorId
                                  );
                                setInstructor(instructor?.item);
                                setMessage(
                                  `Bạn có muốn ${
                                    value?.item?.status
                                      ? "vô hiệu hóa"
                                      : "kích hoạt"
                                  } tài khoản giảng viên này không ? `
                                );
                                confirmDialog?.current?.showModal();
                              }}
                              className={`px-2 py-1 rounded-[8px] text-title-sm text-surface-white ${
                                value?.item?.status
                                  ? "bg-red-600"
                                  : "bg-green-600"
                              } transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer`}
                            >
                              {value?.item?.status
                                ? "Vô hiệu hóa"
                                : "Kích hoạt"}
                            </button>
                            <IoEyeOutline
                              className="hover:cursor-pointer text-title-lg"
                              onClick={() =>
                                navigate(
                                  `/admin/instructor/${value?.item?._id}`
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 mt-6 xl:hidden w-full">
                {instructors?.arrayInstructor?.length > 0 ? (
                  instructors?.arrayInstructor?.map((value) => {
                    return (
                      <div
                        key={value?.item?._id}
                        className="flex flex-col gap-y-3 p-4 border border-surface-bg rounded-[16px] bg-surface-white shadow-sm"
                      >
                        <div className="flex justify-between items-start gap-x-3">
                          <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-3 md:items-center min-w-0">
                            <img
                              src={value?.item?.avatar}
                              className="w-[60px] h-[60px] rounded-full object-cover shrink-0"
                              alt=""
                            />
                            <div className="min-w-0">
                              <p className="text-surface-nav text-title-lg font-medium break-words">
                                {value?.item?.full_name}
                              </p>
                              <p className="text-nav-muted text-body-lg break-all">
                                {value?.item?.email}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-body-md font-medium rounded-[8px] px-2.5 py-1 shrink-0 ${
                              value?.item?.status
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}
                          >
                            {value?.item?.status
                              ? "Đang hoạt động"
                              : "Ngừng hoạt động"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-title-sm text-surface-nav pt-2 border-t border-surface-bg">
                          <p className="text-nav-muted">Trạng thái xác thực:</p>
                          <span
                            className={`text-body-md font-medium rounded-[8px] px-2 py-0.5 ${
                              value?.item?.verified_status === "NOT_VERIFIED"
                                ? "bg-orange-100 text-orange-700"
                                : value?.item?.verified_status === "PENDING"
                                ? "bg-gray-100 text-gray-700"
                                : value?.item?.verified_status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {value?.item?.verified_status === "NOT_VERIFIED"
                              ? "Chưa xác thực"
                              : value?.item?.verified_status === "PENDING"
                              ? "Chờ xác thực"
                              : value?.item?.verified_status === "REJECTED"
                              ? "Bị từ chối"
                              : "Đã xác thực"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-y-2 md:flex-row md:justify-between md:items-center pt-2 border-t border-surface-bg">
                          <div
                            onClick={() =>
                              navigate(`/admin/instructor/${value?.item?._id}`)
                            }
                            className="flex gap-x-1 items-center text-body-lg text-brand-blue hover:cursor-pointer font-medium"
                          >
                            <IoEyeOutline />
                            <span>Xem chi tiết</span>
                          </div>
                          <div className="flex gap-x-2 items-center font-medium">
                            {value?.item?.verified_status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => {
                                    const instructorId = value?.item?._id;
                                    const instructor =
                                      instructors?.arrayInstructor?.find(
                                        (v) => v?.item?._id == instructorId
                                      );
                                    setIsApproved(true);
                                    setInstructor(instructor?.item);
                                    setMessage(
                                      "Bạn có muốn duyệt tài khoản giảng viên này không ?"
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                  className="px-3 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] hover:cursor-pointer"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => {
                                    const instructorId = value?.item?._id;
                                    const instructor =
                                      instructors?.arrayInstructor?.find(
                                        (v) => v?.item?._id == instructorId
                                      );
                                    setIsApproved(false);
                                    setIsRejected(true);
                                    setInstructor(instructor?.item);
                                    setMessage(
                                      "Bạn có muốn từ chối tài khoản giảng viên này không ?"
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                  className="px-3 py-1 bg-brand-primary text-body-lg text-surface-white rounded-[8px] hover:cursor-pointer"
                                >
                                  Từ chối
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                const instructorId = value?.item?._id;
                                const instructor =
                                  instructors?.arrayInstructor?.find(
                                    (v) => v?.item?._id === instructorId
                                  );
                                setInstructor(instructor?.item);
                                setMessage(
                                  `Bạn có muốn ${
                                    value?.item?.status
                                      ? "vô hiệu hóa"
                                      : "kích hoạt"
                                  } tài khoản giảng viên này không ? `
                                );
                                confirmDialog?.current?.showModal();
                              }}
                              className={`px-3 py-1 rounded-[8px] text-body-lg text-surface-white ${
                                value?.item?.status
                                  ? "bg-red-600"
                                  : "bg-green-600"
                              } hover:cursor-pointer`}
                            >
                              {value?.item?.status
                                ? "Vô hiệu hóa"
                                : "Kích hoạt"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-nav-muted border border-surface-bg rounded-[16px]">
                    Chưa có giảng viên nào
                  </div>
                )}
              </div>
            </>
          )}
          {instructors?.totalPages > 1 && (
            <PaginationButton totalPages={instructors?.totalPages} />
          )}
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={
          isApproved || isRejected
            ? handleApprovedOrRejectedInstructor
            : handleUpdateStatusInstructor
        }
      />
      <dialog
        ref={rejectDialog}
        className="w-[480px] p-4 m-auto rounded-[8px] shadow-lg"
      >
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full outline-none p-2 rounded-[8px] text-body-lg border border-gray-300"
          type="text"
          placeholder="Nhập lý do từ chối"
        />
        <div className="flex flex-col items-end mt-4">
          <div className="flex gap-x-4 text-title-sm">
            <button
              className="px-6 py-2 border border-gray-300 rounded-[8px] transition-transform duration-300 hover:cursor-pointer"
              onClick={() => {
                setIsRejected(false);
                rejectDialog?.current?.close();
                confirmDialog?.current?.showModal();
              }}
            >
              Hủy
            </button>
            <button
              className="px-6 py-2 bg-blue-600 rounded-[8px] text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              onClick={handleRejectedInstructor}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default Instructors;
