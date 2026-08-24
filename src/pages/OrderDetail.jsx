import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "../services/orderService";
import Navbar from "../components/Navbar";
import { FaArrowLeft } from "react-icons/fa6";
import { RiDraftLine } from "react-icons/ri";
import { format } from "../../helper/format";
import { FiUser } from "react-icons/fi";
import { IoBookOutline } from "react-icons/io5";
import { BsCreditCard } from "react-icons/bs";
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
      <div className="flex flex-col gap-y-6 p-24">
        <button
          onClick={() => navigate(-1)}
          className="flex gap-x-2 items-center text-title-lg text-brand-blue font-medium py-1 px-2 w-[20%] transition-transform duration-300 hover:cursor-pointer"
        >
          <FaArrowLeft />
          <p>Quay lại đơn hàng</p>
        </button>
        <div className="flex flex-col gap-y-2">
          <p className="text-display-sm text-surface-nav font-bold">
            Chi tiết đơn hàng
          </p>
          <p className="text-title-lg text-nav-muted">
            Thông tin chi tiết về đơn hàng {order?.item?._id}
          </p>
        </div>
        <div className="flex flex-col gap-y-3 p-5 border border-gray-300 rounded-[16px]">
          <div className="flex gap-x-2 items-center">
            <RiDraftLine className="text-title-lg text-brand-blue" />
            <p className="text-headline-sm text-surface-nav font-medium">
              Thông tin đơn hàng
            </p>
          </div>
          <hr className="text-gray-300" />
          <table>
            <thead>
              <tr className="text-title-sm text-nav-muted font-medium">
                <td>Mã đơn hàng</td>
                <td>Ngày tạo</td>
                <td>Phương thức thanh toán</td>
                <td>Trạng thái</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-title-sm text-surface-nav font-medium">
                <td>{order?.item?._id}</td>
                <td>
                  {format.formatDateTime({ date: order?.item?.createdAt })}
                </td>
                <td>{order?.item?.payment_method}</td>
                <td
                  className={`${
                    order?.item?.payment_status === "PENDING"
                      ? "text-yellow-600"
                      : order?.item?.payment_status === "PARTIAL_PAID"
                      ? "text-blue-600"
                      : order?.item?.payment_status === "PAID"
                      ? "text-green-600"
                      : "text-red-600"
                  } `}
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
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-y-6 w-[60%]">
            <div className="flex flex-col gap-y-3 p-5 border border-gray-300 rounded-[16px]">
              <div className="flex gap-x-2 items-center text-headline-sm font-medium">
                <FiUser className="text-brand-blue" />
                <p className="text-surface-nav">Thông tin người mua</p>
              </div>
              <hr className="text-gray-300" />
              <table>
                <thead>
                  <tr className="text-title-sm text-nav-muted font-medium">
                    <td className="w-[50%]">Họ tên</td>
                    <td>Email</td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-title-sm text-surface-nav font-medium">
                    <td>{order?.item?.full_name}</td>
                    <td>{order?.item?.email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-y-3 p-5 border border-gray-300 rounded-[16px]">
              <div className="flex gap-x-2 items-center text-title-lg font-medium">
                <BsCreditCard className="text-brand-blue" />
                <p className="text-surface-nav">Tổng thanh toán</p>
              </div>
              <hr className="text-gray-300" />
              <div className="flex justify-between">
                <p className="text-title-sm text-nav-muted font-medium">
                  Tổng tiền
                </p>
                <p className="text-surface-nav text-title-lg font-bold">
                  {format.formatPrice({ price: order?.item?.total_amount })}đ
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-title-sm text-nav-muted font-medium">
                  Đã trả
                </p>
                <p className="text-green-500 text-title-lg font-bold">
                  {format.formatPrice({ price: order?.item?.applied_amount })}đ
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-title-sm text-nav-muted font-medium">
                  Còn lại
                </p>
                <p className="text-red-500 text-title-lg font-bold">
                  {format.formatPrice({
                    price:
                      order?.item?.total_amount - order?.item?.applied_amount,
                  })}
                  đ
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-3 p-5 border border-gray-300 rounded-[16px] w-[38%]">
            <div className="flex gap-x-2 items-center text-title-lg font-medium">
              <IoBookOutline className="text-brand-blue" />
              <p className="text-surface-nav">
                Các khóa học trong đơn hàng ({order?.orderItems?.length})
              </p>
            </div>
            <hr className="text-gray-300" />
            {order?.orderItems?.map((value) => {
              return (
                <div
                  key={value._id}
                  className="flex gap-x-8 border-b border-b-gray-300 py-2"
                >
                  <img
                    src={value?.course_id?.image_url}
                    alt=""
                    className="w-[100px] h-[80px] object-fill"
                  />
                  <div className="flex flex-col gap-y-2">
                    <p className="text-headline-sm text-surface-nav font-medium">
                      {value.course_name}
                    </p>
                    <div className="flex flex-col gap-y-1">
                      <p className="text-title-lg text-nav-muted font-medium">
                        Giá khóa học
                      </p>
                      <p className="text-headline-sm text-brand-blue font-bold">
                        {format.formatPrice({ price: value.price })}đ
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {currentStatus == "user" &&
          order?.item?.payment_status === "PARTIAL_PAID" && (
            <button
              onClick={handleProcessPayment}
              className="py-2 bg-surface-nav text-title-lg text-surface-white font-medium rounded-[8px] transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
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
