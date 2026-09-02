import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { orderService } from "../../services/orderService";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoListOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoEyeOutline } from "react-icons/io5";
import { format } from "../../../helper/format";
import Navbar from "../../components/Navbar";
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
      <div className="py-24 px-4 sm:px-8 md:px-16 xl:px-24">
        {/* Header Section */}
        <div className="flex flex-col gap-y-1 sm:gap-y-2">
          <p className="text-headline-md sm:text-display-sm text-surface-nav font-bold">
            Đơn hàng của tôi
          </p>
          <p className="text-body-md sm:text-title-lg text-nav-muted">
            Danh sách các đơn hàng của người dùng
          </p>
        </div>
        {/* Filter Tabs */}
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-full overflow-x-auto no-scrollbar scroll-smooth">
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
                className={`flex py-3 sm:py-4 shrink-0 hover:cursor-pointer transition-colors ${
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
                  className={`flex gap-x-2 items-center px-4 sm:px-6 text-caption sm:text-title-sm font-medium whitespace-nowrap ${
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
        {/* Content Section */}
        <div className="flex flex-col gap-y-6 mt-6">
          {isLoading ? (
            <p className="text-body-lg sm:text-title-lg text-surface-nav text-center py-8">
              Đang tải dữ liệu...
            </p>
          ) : myOrders?.orders?.length === 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-full mt-6 py-12">
              <LuInbox className="text-display-md text-gray-300 text-5xl" />
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <>
              <div className="hidden xl:block w-full">
                <table className="w-full border-separate border-spacing-0 overflow-hidden border border-gray-300 rounded-[16px]">
                  <thead>
                    <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200 bg-gray-50/50">
                      <td className="w-[25%] py-3 px-4">Mã đơn hàng</td>
                      <td className="w-[20%] text-center">
                        Phương thức thanh toán
                      </td>
                      <td className="w-[10%]">Tổng tiền</td>
                      <td className="w-[10%]">Đã trả</td>
                      <td className="w-[16%] text-center">Trạng thái</td>
                      <td className="w-[15%] text-center">Ngày tạo</td>
                      <td className="px-4 text-right w-[10%]">Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders?.orders?.map((value) => (
                      <tr
                        className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg last:border-b-0"
                        key={value._id}
                      >
                        <td
                          className="w-[25%] px-4 py-3 text-surface-nav text-title-sm font-medium truncate"
                          title={value._id}
                        >
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
                        <td className="w-[16%] px-2">
                          <p
                            className={`text-body-md text-center font-medium rounded-[8px] py-1 ${
                              value.payment_status === "PENDING"
                                ? "text-yellow-700 bg-yellow-100"
                                : value.payment_status === "PARTIAL_PAID"
                                ? "text-brand-blue bg-blue-100"
                                : value.payment_status === "PAID"
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            }`}
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
                        <td className="w-[15%] text-center text-body-sm">
                          <p>
                            {format.formatDateTime({ date: value.createdAt })}
                          </p>
                        </td>
                        <td className="flex justify-end px-4 w-[10%]">
                          <IoEyeOutline
                            className="hover:cursor-pointer text-title-lg hover:text-brand-blue"
                            onClick={() => navigate(`/order/${value._id}`)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-y-4 xl:hidden w-full">
                {myOrders?.orders?.map((value) => (
                  <div
                    key={value._id}
                    onClick={() => navigate(`/order/${value._id}`)}
                    className="flex flex-col justify-between gap-y-3 p-4 bg-surface-white border border-gray-200 rounded-[12px] shadow-sm hover:cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex justify-between items-start gap-x-2 border-b border-gray-100 pb-2.5">
                      <div className="flex flex-col min-w-0">
                        <span className="text-title-lg text-nav-muted">
                          Mã đơn hàng
                        </span>
                        <span className="text-body-lg font-semibold text-surface-nav">
                          #{value._id}
                        </span>
                      </div>
                      <span
                        className={`text-title-lg font-medium rounded-full px-2.5 py-0.5 shrink-0 ${
                          value.payment_status === "PENDING"
                            ? "text-yellow-700 bg-yellow-100"
                            : value.payment_status === "PARTIAL_PAID"
                            ? "text-brand-blue bg-blue-100"
                            : value.payment_status === "PAID"
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {value.payment_status === "PENDING"
                          ? "Chờ thanh toán"
                          : value.payment_status === "PARTIAL_PAID"
                          ? "Một phần"
                          : value.payment_status === "PAID"
                          ? "Đã thanh toán"
                          : "Thất bại"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-1">
                      <div>
                        <p className="text-nav-muted text-title-lg">
                          Phương thức
                        </p>
                        <p className="font-medium text-surface-nav text-body-lg">
                          {value.payment_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-nav-muted text-title-lg">Ngày tạo</p>
                        <p className="text-surface-nav text-body-lg">
                          {format.formatDateTime({ date: value.createdAt })}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-[8px] mt-1">
                      <div className="flex flex-col">
                        <span className="text-title-lg text-nav-muted">
                          Tổng tiền
                        </span>
                        <span className="text-body-lg font-bold text-brand-blue">
                          {format.formatPrice({ price: value.total_amount })}đ
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-title-lg text-nav-muted">
                          Đã thanh toán
                        </span>
                        <span className="text-body-lg font-bold text-green-600">
                          {format.formatPrice({ price: value.applied_amount })}đ
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-1 text-body-lg font-medium text-brand-blue pt-1">
                      <span>Xem chi tiết đơn hàng</span>
                      <IoEyeOutline className="text-title-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {myOrders?.totalPages > 1 && (
            <div>
              <PaginationButton totalPages={myOrders?.totalPages} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default MyOrders;
