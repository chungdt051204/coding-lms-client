import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { cartItemService } from "../../services/cartItemService";
import {
  deleteCartItem,
  deleteCartItemsSelected,
} from "../../stores/features/cartSlice";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import logoZalo from "../../assets/zalo-pay-logo.png";
import { FaCheck } from "react-icons/fa6";
import { orderService } from "../../services/orderService";
import { LuInbox } from "react-icons/lu";
import { format } from "../../../helper/format";
import Footer from "../../components/Footer";
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const myCart = useSelector((state) => state.cart);
  const [cartItemIds, setCartItemIds] = useState([]);
  const cartItemsSelected = myCart?.items?.filter((value) =>
    cartItemIds?.includes(value._id)
  );
  const [paymentOptions, setPaymentOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef();
  const getHaftPrice = ({ price }) => {
    return (price * 50) / 100;
  };
  const totalAmount = () => {
    let sum = 0;
    myCart?.items?.forEach((value) => {
      if (cartItemIds.includes(value._id)) sum = sum + value?.course_id?.price;
    });
    return sum;
  };
  const appliedAmount = () => {
    let sum = 0;
    myCart?.items?.forEach((value) => {
      const price =
        paymentOptions[value._id] === "PARTIAL"
          ? (value?.course_id?.price * 50) / 100
          : value?.course_id?.price;
      if (cartItemIds.includes(value._id)) sum = sum + price;
    });
    return sum;
  };
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
    if (!isLoading && me?.role_id?.role !== "user") {
      navigate("/");
      return;
    }
  }, [isLoading, me, navigate]);
  const handleToggleAllCartItems = () => {
    if (cartItemIds?.length == myCart?.items?.length) setCartItemIds([]);
    else {
      const cartItemIds = myCart?.items?.map((value) => {
        return value._id;
      });
      setCartItemIds(cartItemIds);
    }
  };
  const handleToggleCartItemSelected = ({ cartItemId }) => {
    if (!cartItemIds.includes(cartItemId))
      setCartItemIds((prev) => [...prev, cartItemId]);
    else {
      const newCartItemIds = cartItemIds?.filter(
        (value) => value !== cartItemId
      );
      setCartItemIds(newCartItemIds);
    }
  };
  const handleDeleteCartItem = async ({ cartItemId }) => {
    try {
      const result = await cartItemService.deleteCartItem({ cartItemId });
      dispatch(deleteCartItem(cartItemId));
      toast.success(
        result.message || "Xóa khóa học ra khỏi giỏ hàng thành công"
      );
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleDeleteCartItemsSelected = async () => {
    if (cartItemIds?.length > 0) {
      try {
        const result = await cartItemService.deleteCartItemsSelected({
          cartItemIds,
        });
        dispatch(deleteCartItemsSelected(cartItemIds));
        setCartItemIds([]);
        toast.success(
          result.message ||
            `Đã xóa ${cartItemIds?.length} khóa học ra khỏi giỏ hàng thành công`
        );
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    }
  };
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    const orderItems = cartItemsSelected?.map((value) => {
      return {
        courseId: value?.course_id?._id,
        courseName: value?.course_id?.course_name,
        price: value?.course_id?.price,
        paymentOption:
          paymentOptions[value._id] === "PARTIAL" ? "PARTIAL" : "FULL",
      };
    });
    const formData = {
      userId: me?._id || "",
      fullName: me?.full_name || "",
      email: me?.email || "",
      paymentMethod: "ZALOPAY",
      totalAmount: totalAmount(),
      appliedAmount: appliedAmount(),
      cartItemIds,
      orderItems,
    };
    try {
      const result = await orderService.checkout({ formData });
      console.log(result.data.order_url);
      window.location.href = result.data.order_url;
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) return <div className="text-center">Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="py-24 px-32">
        <div className="flex flex-col gap-y-1">
          <p className="text-display-sm text-surface-nav font-bold">Giỏ hàng</p>
          <p className="text-body-lg text-nav-muted">
            {myCart?.items?.length} khóa học trong giỏ hàng
          </p>
        </div>
        {myCart?.items?.length == 0 ? (
          <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
            <LuInbox className="text-display-md text-gray-300" />
            <p>Giỏ hàng của bạn hiện tại đang trống</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between mt-8">
              <div className="flex gap-x-2 items-center">
                <input
                  checked={cartItemIds?.length == myCart?.items?.length}
                  onChange={handleToggleAllCartItems}
                  type="checkbox"
                />
                <p className="text-body-lg text-surface-nav font-medium">
                  Chọn tất cả ({myCart?.items?.length})
                </p>
              </div>
              <button
                onClick={handleDeleteCartItemsSelected}
                className={`flex gap-x-4 items-center text-body-lg text-surface-white font-medium py-2 px-3 bg-brand-primary ${
                  cartItemIds?.length === 0
                    ? "opacity-80 hover:cursor-not-allowed"
                    : "hover:cursor-pointer transition-transform duration-300 hover:bg-red-700 hover:text-surface-bg"
                } rounded-[8px]`}
              >
                <RiDeleteBinLine />
                <p> Xóa đã chọn ({cartItemIds?.length})</p>
              </button>
            </div>
            <div className="flex flex-col gap-y-4 mt-5">
              {myCart?.items?.map((value) => {
                return (
                  <div
                    key={value?._id}
                    className={`flex justify-between items-center ${
                      cartItemIds?.includes(value._id)
                        ? "border-2 border-brand-blue"
                        : "border border-gray-300"
                    } rounded-[16px] p-5`}
                  >
                    <div className="flex gap-x-8">
                      <div className="flex items-center gap-x-2">
                        <input
                          checked={cartItemIds.includes(value._id)}
                          onChange={() =>
                            handleToggleCartItemSelected({
                              cartItemId: value._id,
                            })
                          }
                          type="checkbox"
                        />
                        <img
                          src={value?.course_id?.image_url}
                          alt=""
                          width={100}
                          height={80}
                        />
                      </div>
                      <div className="flex flex-col gap-y-1 text-body-lg text-surface-nav font-medium">
                        <p className="text-headline-md text-brand-blue">
                          {value?.course_id?.course_name}
                        </p>
                        <div className="flex gap-x-8 text-body-lg">
                          <div className="flex flex-col gap-y-1">
                            <div className="flex gap-x-1">
                              <input
                                checked={
                                  paymentOptions[value._id] === "PARTIAL"
                                }
                                onChange={(e) =>
                                  setPaymentOptions((prev) => ({
                                    ...prev,
                                    [value._id]: e.target.value,
                                  }))
                                }
                                value="PARTIAL"
                                type="radio"
                                name={`paymentType-${value._id}`}
                              />
                              <p>Thanh toán 50%</p>
                            </div>
                            <p>
                              (
                              {format.formatPrice({
                                price: getHaftPrice({
                                  price: value?.course_id?.price,
                                }),
                              })}
                              đ)
                            </p>
                          </div>
                          <div className="flex flex-col gap-y-1">
                            <div className="flex gap-x-1">
                              <input
                                checked={
                                  paymentOptions[value._id] !== "PARTIAL"
                                }
                                onChange={(e) =>
                                  setPaymentOptions((prev) => ({
                                    ...prev,
                                    [value._id]: e.target.value,
                                  }))
                                }
                                value="FULL"
                                type="radio"
                                name={`paymentType-${value._id}`}
                              />
                              <p>Thanh toán 100%</p>
                            </div>
                            <p>
                              (
                              {format.formatPrice({
                                price: value?.course_id?.price,
                              })}
                              đ)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-4 text-headline-sm">
                      <p className="text-brand-blue font-bold">
                        {format.formatPrice({ price: value?.course_id?.price })}
                        đ
                      </p>
                      <button
                        onClick={() =>
                          handleDeleteCartItem({ cartItemId: value._id })
                        }
                      >
                        <RiDeleteBinLine className="text-red-500 hover:cursor-pointer" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center p-5 border border-gray-300 rounded-[16px] mt-5">
              <div className="flex flex-col gap-y-1">
                <p className="text-body-lg text-nav-muted">
                  Đã chọn {cartItemIds?.length} khóa học
                </p>
                <p className="text-headline-md text-brand-blue font-bold">
                  Tổng: {format.formatPrice({ price: appliedAmount() })}đ
                </p>
              </div>
              <button
                onClick={() => dialogRef.current?.showModal()}
                disabled={cartItemIds?.length === 0}
                className={`py-2 px-6 rounded-[8px] text-surface-white text-body-lg font-medium ${
                  cartItemIds?.length === 0
                    ? "bg-nav-muted hover:cursor-not-allowed"
                    : "bg-surface-nav transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
                }`}
              >
                Thanh toán ({cartItemIds?.length})
              </button>
            </div>
          </div>
        )}
      </div>
      <dialog
        className="w-[45%] h-[100vh] mx-auto mt-6 p-6 rounded-[16px]"
        ref={dialogRef}
      >
        <form onSubmit={handleCheckout} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-3 text-surface-nav font-medium">
            <div className="flex justify-between">
              <p className="text-headline-md">Xác nhận thanh toán</p>
              <button
                className="text-title-lg"
                onClick={() => dialogRef?.current?.close()}
                type="button"
              >
                X
              </button>
            </div>
            <p className="text-title-lg">Thông tin người mua</p>
          </div>
          <div className="flex flex-col gap-y-2 border border-gray-300 rounded-[16px] p-4 bg-gray-50">
            <div className="flex gap-x-3 items-center">
              <FiUser className="text-title-lg text-nav-muted" />
              <div className="flex flex-col text-title-sm">
                <p className="text-nav-muted">Họ tên</p>
                <p className="text-surface-nav font-medium">
                  {me?.full_name || ""}
                </p>
              </div>
            </div>
            <div className="flex gap-x-3 items-center">
              <MdOutlineEmail className="text-title-lg text-nav-muted" />
              <div className="flex flex-col text-title-sm">
                <p className="text-nav-muted">Email</p>
                <p className="text-surface-nav font-medium">
                  {me?.email || ""}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 border-y border-y-gray-300 py-6">
            <p className="text-title-lg text-surface-nav font-medium">
              Khóa học đã chọn
            </p>
            <div className="flex flex-col gap-y-4">
              {cartItemsSelected?.map((value) => {
                return (
                  <div
                    className="flex justify-between items-center py-3 px-4 rounded-[16px] bg-gray-50"
                    key={value?._id}
                  >
                    <div className="flex gap-x-4">
                      <img
                        src={value?.course_id?.image_url}
                        alt=""
                        className="w-[80px] h-[60px] object-contain"
                      />
                      <div className="flex flex-col">
                        <p className="text-title-sm text-surface-nav font-medium">
                          {value?.course_id?.course_name}
                        </p>
                        <p className="text-body-lg text-nav-muted">
                          {paymentOptions[value._id] == "PARTIAL"
                            ? "Thanh toán 50%"
                            : "Thanh toán 100%"}
                        </p>
                      </div>
                    </div>
                    <p className="text-title-lg text-brand-blue font-bold">
                      {format.formatPrice({ price: value?.course_id?.price })}đ
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-b border-b-gray-300 pb-6">
            <div className="flex flex-col gap-y-4">
              <p className="text-title-lg text-surface-nav font-medium">
                Phương thức thanh toán
              </p>
              <div className="flex gap-x-4 items-center p-4 border-2 border-brand-blue rounded-[16px] bg-blue-50">
                <input defaultChecked={true} type="radio" />
                <img
                  className="rounded-[16px]"
                  src={logoZalo}
                  alt=""
                  width={50}
                  height={50}
                />
                <div className="flex flex-col text-title-sm">
                  <p className="text-surface-nav font-medium">ZaloPay</p>
                  <p className="text-nav-muted">Thanh toán qua ví ZaloPay</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-[8px]">
            <div className="flex justify-between items-center">
              <p className="text-title-lg text-surface-nav font-medium">
                Tổng thanh toán
              </p>
              <p className="text-headline-md text-brand-blue font-bold">
                {format.formatPrice({ price: appliedAmount() })}đ
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-title-sm font-medium">
            <button
              onClick={() => dialogRef?.current?.close()}
              type="button"
              className="w-[48%] py-1 border border-gray-300 bg-surface-white rounded-[8px] transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
            >
              Hủy
            </button>
            <button
              disabled={loading}
              className="flex justify-evenly items-center w-[48%] py-2 bg-surface-nav rounded-[8px] text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
            >
              {!loading && <FaCheck />}
              <p>{loading ? "Đang xử lý..." : "Xác nhận thanh toán"}</p>
            </button>
          </div>
        </form>
      </dialog>
      <Footer />
    </>
  );
};
export default Cart;
