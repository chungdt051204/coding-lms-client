import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoListOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import { orderService } from "../../services/orderService";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { format } from "../../../helper/format";
import PaginationButton from "../../components/PaginationButton";
const Orders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả",
      icon: <IoListOutline />,
    },
    {
      status: "PENDING",
      title: "Chờ thanh toán",
      icon: <GoClock />,
    },
    {
      status: "PARTIAL_PAID",
      title: "Thanh toán một phần",
      icon: <LuCircleDollarSign />,
    },
    {
      status: "PAID",
      title: "Đã thanh toán",
      icon: <CiCircleCheck />,
    },
    {
      status: "FAILED",
      title: "Thất bại",
      icon: <RiDeleteBinLine />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const getOrdersByUser = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await orderService.getOrders({
          params: params.toString(),
        });
        console.log(result.data);
        setOrders(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getOrdersByUser();
  }, [searchParams, status]);
  return (
    <>
      <div className="py-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý đơn hàng
          </p>
          <p className="text-title-lg text-nav-muted">
            Xem danh sách đơn hàng của tất cả người dùng trong hệ thống
          </p>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[95%]">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-gray-600",
              "border-b-2 border-b-yellow-600",
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-green-600",
              "border-b-2 border-b-red-600",
            ];
            const textColors = [
              "text-gray-600",
              "text-yellow-600",
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
            <p className="text-title-lg text-surface-nav text-center">
              Đang tải dữ liệu...
            </p>
          ) : orders?.items?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <table className="border-separate border-spacing-0 overflow-hidden border-1 border-gray-300 rounded-[16px] mt-6">
              <thead>
                <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                  <td className="w-[20%] py-2 px-4">Người dùng</td>
                  <td className="w-[20%]">Phương thức thanh toán</td>
                  <td className="w-[10%]">Tổng tiền</td>
                  <td className="w-[16%] text-center">Trạng thái</td>
                  <td className="w-[15%] text-center">Ngày tạo</td>
                  <td className="px-4 text-right w-[12%]">Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {orders?.items?.length > 0 &&
                  orders?.items?.map((value) => {
                    return (
                      <tr
                        className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg"
                        key={value._id}
                      >
                        <td className="flex items-center gap-x-2 w-[20%] p-2">
                          <img
                            className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                            src={value?.user_id?.avatar}
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-surface-nav text-title-lg font-medium">
                            {value?.user_id?.full_name}
                          </p>
                        </td>
                        <td className="text-surface-nav text-title-sm font-medium w-[20%]">
                          {value.payment_method}
                        </td>
                        <td className="text-brand-blue font-bold text-body-lg w-[10%]">
                          {format.formatPrice({ price: value.total_amount })}đ
                        </td>
                        <td className="w-[16%]">
                          <p
                            className={`text-body-md text-center font-medium rounded-[8px] px-1 ${
                              value.payment_status === "PENDING"
                                ? "text-yellow-700 bg-yellow-100"
                                : value.payment_status === "PARTIAL_PAID"
                                ? "text-brand-blue bg-blue-100"
                                : value.payment_status === "PAID"
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            } `}
                          >
                            {value.payment_status === "PENDING"
                              ? "Chờ thanh toán"
                              : value.payment_status === "PARTIAL_PAID"
                              ? "Thanh toán một phần"
                              : value.payment_status === "PAID"
                              ? "Đã thanh toán"
                              : "Thất bại"}
                          </p>
                        </td>
                        <td className="w-[15%] text-center">
                          <p>
                            {format.formatDateTime({ date: value.createdAt })}
                          </p>
                        </td>
                        <td className="flex justify-end px-4 w-[12%]">
                          <IoEyeOutline
                            onClick={() => navigate(`/order/${value._id}`)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
          {orders?.totalPages > 1 && (
            <PaginationButton totalPages={orders?.totalPages} />
          )}
        </div>
      </div>
    </>
  );
};
export default Orders;
