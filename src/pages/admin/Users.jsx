import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import { format } from "../../../helper/format";
import { IoListOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { IoBan } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import PaginationButton from "../../components/PaginationButton";
import ConfirmDialog from "../../components/ConfirmDialog";

const Users = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả người dùng",
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
  const confirmDialog = useRef();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await userService.getUsers({
          params: params.toString(),
        });
        console.log(result.data);
        setUsers(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, [refresh, searchParams, status]);

  const handleUpdateStatusUser = async () => {
    try {
      const result = await userService.updateStatusUser({ userId: user?._id });
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
  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex flex-col gap-y-1">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý người dùng
          </p>
          <p className="text-title-lg text-nav-muted">
            Xem và quản lý tất cả học viên trên nền tảng
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
          ) : users?.arrayUser?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có người dùng nào</p>
            </div>
          ) : (
            <>
              <div className="hidden xl:block w-full overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 overflow-hidden border border-surface-bg rounded-[16px] mt-6">
                  <thead>
                    <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-surface-bg">
                      <td className="w-[30%] p-2">Người dùng</td>
                      <td className="w-[15%]">Khóa học đã mua</td>
                      <td className="w-[15%]">Tổng chi tiêu</td>
                      <td className="w-[15%] text-center">Trạng thái</td>
                      <td className="w-[20%] p-2 text-right">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.arrayUser?.map((value) => {
                      return (
                        <tr
                          className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                          key={value?.item?._id}
                        >
                          <td className="flex items-center gap-x-2 w-[30%] p-2">
                            <img
                              className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                              src={value?.item?.avatar}
                              referrerPolicy="no-referrer"
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-lg font-medium truncate">
                                {value?.item?.full_name}
                              </p>
                              <p className="text-nav-muted text-body-lg">
                                {value?.item?.email}
                              </p>
                            </div>
                          </td>
                          <td className="w-[15%] text-title-sm text-surface-nav">
                            {value?.numberPurchasedCourse}
                          </td>
                          <td className="w-[15%] text-title-sm text-surface-nav">
                            <p>
                              {format.formatPrice({ price: value?.totalSpent })}
                              đ
                            </p>
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
                          <td className="flex justify-end gap-x-2 items-center w-[20%] pe-2">
                            <IoEyeOutline
                              className="hover:cursor-pointer text-title-lg"
                              onClick={() =>
                                navigate(`/admin/user/${value?.item?._id}`)
                              }
                            />
                            <button
                              onClick={() => {
                                const userId = value?.item?._id;
                                const user = users?.arrayUser?.find(
                                  (v) => v?.item?._id === userId
                                );
                                setUser(user?.item);
                                setMessage(
                                  `Bạn có muốn ${
                                    value?.item?.status
                                      ? "vô hiệu hóa"
                                      : "kích hoạt"
                                  } tài khoản người dùng này không ? `
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-4 mt-6 xl:hidden w-full">
                {users?.arrayUser?.length > 0 ? (
                  users?.arrayUser?.map((value) => {
                    return (
                      <div
                        key={value?.item?._id}
                        className="flex flex-col gap-y-3 p-4 border border-surface-bg rounded-[16px] bg-surface-white shadow-sm"
                      >
                        <div className="flex justify-between items-start gap-x-3">
                          <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-3 md:items-center min-w-0">
                            <img
                              src={value?.item?.avatar}
                              referrerPolicy="no-referrer"
                              className="w-[60px] h-[60px] rounded-full object-cover shrink-0"
                              alt=""
                            />
                            <div>
                              <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                                {value?.item?.full_name}
                              </p>
                              <p className="text-nav-muted text-body-lg">
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
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-bg text-body-lg">
                          <div>
                            <p className="text-nav-muted text-caption">
                              Khóa học đã mua
                            </p>
                            <p className="font-semibold text-surface-nav text-title-lg">
                              {value?.numberPurchasedCourse || 0} khóa
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-nav-muted text-caption">
                              Tổng chi tiêu
                            </p>
                            <p className="font-bold text-brand-blue text-title-lg">
                              {format.formatPrice({ price: value?.totalSpent })}
                              đ
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-surface-bg font-medium">
                          <div
                            onClick={() =>
                              navigate(`/admin/user/${value?.item?._id}`)
                            }
                            className="flex gap-x-1 items-center text-body-lg text-brand-blue hover:cursor-pointer"
                          >
                            <IoEyeOutline />
                            <span>Xem chi tiết</span>
                          </div>
                          <button
                            onClick={() => {
                              const userId = value?.item?._id;
                              const user = users?.arrayUser?.find(
                                (v) => v?.item?._id === userId
                              );
                              setUser(user?.item);
                              setMessage(
                                `Bạn có muốn ${
                                  value?.item?.status
                                    ? "vô hiệu hóa"
                                    : "kích hoạt"
                                } tài khoản người dùng này không ? `
                              );
                              confirmDialog?.current?.showModal();
                            }}
                            className={`px-3 py-1 rounded-[8px] text-body-lg text-surface-white ${
                              value?.item?.status
                                ? "bg-red-600"
                                : "bg-green-600"
                            } hover:cursor-pointer transition-colors`}
                          >
                            {value?.item?.status ? "Vô hiệu hóa" : "Kích hoạt"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-nav-muted border border-surface-bg rounded-[16px]">
                    Chưa có người dùng nào
                  </div>
                )}
              </div>
            </>
          )}
          {users?.totalPages > 1 && (
            <PaginationButton totalPages={users?.totalPages} />
          )}
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={handleUpdateStatusUser}
      />
    </>
  );
};
export default Users;
