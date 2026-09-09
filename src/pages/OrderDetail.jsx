import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "../services/orderService";
import { FaArrowLeft } from "react-icons/fa6";
import { RiDraftLine } from "react-icons/ri";
import { format } from "../../helper/format";
import { FiUser } from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
import { BsCreditCard } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { item: me } = useSelector((state) => state.me);
  const currentStatus = me?.role_id?.role;
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      const getOrderById = async () => {
        try {
          const result = await orderService.getOrderbyId({ orderId: id });
          console.log(result.data);
          setOrder(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getOrderById();
    }
  }, [id]);
  const handleProcessPayment = async () => {
    try {
      const result = await orderService.processPayment({ orderId: id });
      console.log(result.data.order_url);
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = result.data.order_url;
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-y-6 py-24 px-4 sm:px-8 md:px-16 xl:px-24">
        <button
          onClick={() => navigate(-1)}
          className="flex gap-x-2 items-center text-body-md sm:text-title-lg text-brand-blue font-medium py-1 px-2 w-auto xl:w-[20%] transition-transform duration-300 hover:cursor-pointer self-start"
        >
          <FaArrowLeft />
          <p>Quay lại đơn hàng</p>
        </button>
        {/* Header Section */}
        <div className="flex flex-col gap-y-1 sm:gap-y-2">
          <p className="text-headline-md sm:text-display-sm text-surface-nav font-bold">
            Chi tiết đơn hàng
          </p>
          <p className="text-body-md sm:text-title-lg text-nav-muted break-all">
            Thông tin chi tiết về đơn hàng {order?.item?._id}
          </p>
        </div>
        {/* Order Overview Card */}
        <div className="flex flex-col gap-y-3 p-4 sm:p-5 border border-gray-300 rounded-[16px] bg-surface-white">
          <div className="flex gap-x-2 items-center">
            <RiDraftLine className="text-title-lg text-brand-blue shrink-0" />
            <p className="text-title-lg sm:text-headline-sm text-surface-nav font-medium">
              Thông tin đơn hàng
            </p>
          </div>
          <hr className="text-gray-300" />
          <div className="hidden lg:block w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-title-sm text-nav-muted font-medium text-left">
                  <td className="py-1">Mã đơn hàng</td>
                  <td className="py-1">Ngày tạo</td>
                  <td className="py-1">Phương thức thanh toán</td>
                  <td className="py-1">Trạng thái</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-title-sm text-surface-nav font-medium">
                  <td className="py-1">{order?.item?._id}</td>
                  <td className="py-1">
                    {format.formatDateTime({ date: order?.item?.createdAt })}
                  </td>
                  <td className="py-1">{order?.item?.payment_method}</td>
                  <td
                    className={`py-1 font-semibold ${
                      order?.item?.payment_status === "PENDING"
                        ? "text-yellow-600"
                        : order?.item?.payment_status === "PARTIAL_PAID"
                        ? "text-blue-600"
                        : order?.item?.payment_status === "PAID"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {order?.item?.payment_status === "PENDING"
                      ? "Chờ thanh toán"
                      : order?.item?.payment_status === "PARTIAL_PAID"
                      ? "Thanh toán một phần"
                      : order?.item?.payment_status === "PAID"
                      ? "Đã thanh toán"
                      : "Thất bại"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-y-2 lg:hidden text-body-md md:text-body-lg font-medium">
            <div className="flex justify-between items-start gap-x-2">
              <span className="text-nav-muted">Mã đơn hàng:</span>
              <span className="text-surface-nav text-right break-all">
                {order?.item?._id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-nav-muted">Ngày tạo:</span>
              <span className="text-surface-nav">
                {format.formatDateTime({ date: order?.item?.createdAt })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-nav-muted">Phương thức:</span>
              <span className="font-medium text-surface-nav">
                {order?.item?.payment_method}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-nav-muted">Trạng thái:</span>
              <span
                className={`font-semibold ${
                  order?.item?.payment_status === "PENDING"
                    ? "text-yellow-600"
                    : order?.item?.payment_status === "PARTIAL_PAID"
                    ? "text-blue-600"
                    : order?.item?.payment_status === "PAID"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {order?.item?.payment_status === "PENDING"
                  ? "Chờ thanh toán"
                  : order?.item?.payment_status === "PARTIAL_PAID"
                  ? "Thanh toán một phần"
                  : order?.item?.payment_status === "PAID"
                  ? "Đã thanh toán"
                  : "Thất bại"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row justify-between items-start gap-6">
          <div className="flex flex-col gap-y-6 w-full xl:w-[60%]">
            <div className="flex flex-col gap-y-3 p-4 sm:p-5 border border-gray-300 rounded-[16px] bg-surface-white">
              <div className="flex gap-x-2 items-center text-title-lg sm:text-headline-sm font-medium">
                <FiUser className="text-brand-blue shrink-0" />
                <p className="text-surface-nav">Thông tin người mua</p>
              </div>
              <hr className="text-gray-300" />
              <div className="hidden sm:block w-full">
                <table className="w-full">
                  <thead>
                    <tr className="text-title-sm text-nav-muted font-medium text-left">
                      <td className="w-[50%] py-1">Họ tên</td>
                      <td className="py-1">Email</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-title-sm text-surface-nav font-medium">
                      <td className="py-1 wrap-break-word">
                        {order?.item?.full_name}
                      </td>
                      <td className="py-1 wrap-break-word">
                        {order?.item?.email}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-y-2 sm:hidden text-body-md font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-nav-muted">Họ tên:</span>
                  <span className="font-medium text-surface-nav wrap-break-word">
                    {order?.item?.full_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-nav-muted">Email:</span>
                  <span className="text-surface-nav wrap-break-word">
                    {order?.item?.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-3 p-4 sm:p-5 border border-gray-300 rounded-[16px] bg-surface-white">
              <div className="flex gap-x-2 items-center text-title-lg font-medium">
                <BsCreditCard className="text-brand-blue shrink-0" />
                <p className="text-surface-nav">Tổng thanh toán</p>
              </div>
              <hr className="text-gray-300" />
              <div className="flex justify-between items-center">
                <p className="text-body-md sm:text-title-sm text-nav-muted font-medium">
                  Tổng tiền
                </p>
                <p className="text-surface-nav text-title-md sm:text-title-lg font-bold">
                  {format.formatPrice({ price: order?.item?.total_amount })}đ
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-body-md sm:text-title-sm text-nav-muted font-medium">
                  Đã trả
                </p>
                <p className="text-green-500 text-title-md sm:text-title-lg font-bold">
                  {format.formatPrice({ price: order?.item?.applied_amount })}đ
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-body-md sm:text-title-sm text-nav-muted font-medium">
                  Còn lại
                </p>
                <p className="text-red-500 text-title-md sm:text-title-lg font-bold">
                  {format.formatPrice({
                    price:
                      order?.item?.total_amount - order?.item?.applied_amount,
                  })}
                  đ
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-3 p-4 sm:p-5 border border-gray-300 rounded-[16px] w-full xl:w-[38%] bg-surface-white">
            <div className="flex gap-x-2 items-center text-title-lg font-medium">
              <IoBookOutline className="text-brand-blue shrink-0" />
              <p className="text-surface-nav text-title-sm md:text-title-lg">
                Các khóa học trong đơn hàng ({order?.orderItems?.length || 0})
              </p>
            </div>
            <hr className="text-gray-300" />
            <div className="flex flex-col divide-y divide-gray-200">
              {order?.orderItems?.map((value) => (
                <div
                  key={value._id}
                  className="flex gap-x-4 sm:gap-x-6 py-3 items-center first:pt-0 last:pb-0"
                >
                  <img
                    src={value?.course_id?.image_url}
                    alt=""
                    className="w-[80px] h-[60px] sm:w-[100px] sm:h-[80px] object-cover rounded-[8px] shrink-0"
                  />
                  <div className="flex flex-col gap-y-1 min-w-0">
                    <p className="text-headline-sm text-surface-nav font-medium wrap-break-word">
                      {value.course_name}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <span className="text-caption sm:text-title-sm text-nav-muted">
                        Giá:
                      </span>
                      <span className="text-title-sm sm:text-headline-sm text-brand-blue font-bold">
                        {format.formatPrice({ price: value.price })}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {currentStatus === "user" &&
          order?.item?.payment_status === "PARTIAL_PAID" && (
            <button
              onClick={handleProcessPayment}
              className="w-full sm:w-auto py-3 px-8 self-center xl:self-end bg-surface-nav text-title-sm md:text-title-lg text-surface-white font-medium rounded-[8px] transition-transform duration-300 hover:cursor-pointer hover:opacity-90 active:scale-[0.99]"
            >
              Thanh toán nốt số tiền còn lại
            </button>
          )}
      </div>
      {me?.role_id?.role === "user" && <Footer />}
    </>
  );
};
export default OrderDetail;
