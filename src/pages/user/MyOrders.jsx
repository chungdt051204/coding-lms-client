import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoListOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import Navbar from "../../components/Navbar";
import { orderService } from "../../services/orderService";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { format } from "../../../helper/format";
import { useSelector } from "react-redux";
import PaginationButton from "../../components/PaginationButton";
import Footer from "../../components/Footer";
const MyOrders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderStatus = searchParams.get("status");
  const { item: me, isLoading: loading } = useSelector((state) => state.me);
  const [isLoading, setIsLoading] = useState(true);
  const [myOrders, setMyOrders] = useState([]);
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
  const currentIndex = filterTabs?.findIndex(
    (value) => value.status == orderStatus
  );
  const [idx, setIdx] = useState(currentIndex != -1 ? currentIndex : 0);

  useEffect(() => {
    console.log(loading);
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
    if (!loading && me?.role_id?.role !== "user") {
      navigate("/");
      return;
    }
  }, [loading, me, navigate]);

  useEffect(() => {
    const getOrdersByUser = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await orderService.getOrdersByUser({
          params: params.toString(),
        });
        console.log(result.data);
        setMyOrders(result.data);
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
  if (loading) return <div className="text-center">Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="py-24 px-24">
        <div className="flex flex-col gap-y-2">
          <p className="text-display-sm text-surface-nav font-bold">
            Đơn hàng của tôi
          </p>
          <p className="text-title-lg text-nav-muted">
            Danh sách các đơn hàng của người dùng
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
                  setSearchParams("");
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
        <div className="flex flex-col gap-y-6">
          {isLoading ? (
            <p className="text-title-lg text-surface-nav text-center">
              Đang tải dữ liệu...
            </p>
          ) : myOrders?.orders?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-gray-300 rounded-[16px] mt-6">
              <thead>
                <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                  <td className="w-[25%] py-2 px-4">Mã đơn hàng</td>
                  <td className="w-[20%]">Phương thức thanh toán</td>
                  <td className="w-[10%]">Tổng tiền</td>
                  <td className="w-[10%]">Đã trả</td>
                  <td className="w-[16%] text-center">Trạng thái</td>
                  <td className="w-[15%] text-center">Ngày tạo</td>
                  <td className="px-4 text-right w-[10%]">Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {myOrders?.orders?.length > 0 &&
                  myOrders?.orders?.map((value) => {
                    return (
                      <tr
                        className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg"
                        key={value._id}
                      >
                        <td className="w-[25%] px-4 py-2 text-surface-nav text-title-sm font-medium">
                          {value._id}
                        </td>
                        <td className="text-surface-nav text-title-sm font-medium w-[20%] text-center">
                          {value.payment_method}
                        </td>
                        <td className="text-brand-blue font-bold text-body-lg w-[10%]">
                          {format.formatPrice({ price: value.total_amount })}đ
                        </td>
                        <td className="w-[10%] text-body-lg text-green-500 font-bold">
                          {format.formatPrice({ price: value.applied_amount })}đ
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
                        <td className="flex justify-end px-4 w-[10%]">
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
          {myOrders?.totalPages > 1 && (
            <PaginationButton totalPages={myOrders?.totalPages} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default MyOrders;
