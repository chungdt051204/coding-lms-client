import { useEffect, useState } from "react";
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
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const myCart = useSelector((state) => state.cart);
  const [cartItemIds, setCartItemIds] = useState([]);
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
  useEffect(() => {
    if (!localStorage.getItem("token")) {
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
  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="py-8 px-32">
        <div className="flex flex-col gap-y-1">
          <p className="text-display-sm text-surface-nav font-bold">Giỏ hàng</p>
          <p className="text-body-lg text-nav-muted">
            {myCart?.items?.length} khóa học trong giỏ hàng
          </p>
        </div>
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
          {myCart?.items?.length ? (
            myCart?.items?.map((value) => {
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
                            <input type="radio" />
                            <p>Thanh toán 50%</p>
                          </div>
                          <p>
                            ({getHaftPrice({ price: value?.course_id?.price })}
                            đ)
                          </p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <div className="flex gap-x-1">
                            <input type="radio" />
                            <p>Thanh toán 100%</p>
                          </div>
                          <p>({value?.course_id?.price}đ)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-x-4 text-headline-sm">
                    <p className="text-brand-blue font-bold">
                      {value?.course_id?.price}đ
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
            })
          ) : (
            <p>Giỏ hàng của bạn hiện tại đang trống</p>
          )}
        </div>
        <div className="flex justify-between items-center p-5 border border-gray-300 rounded-[16px] mt-5">
          <div className="flex flex-col gap-y-1">
            <p className="text-body-lg text-nav-muted">
              Đã chọn {cartItemIds?.length} khóa học
            </p>
            <p className="text-headline-md text-brand-blue font-bold">
              Tổng: {totalAmount()}đ
            </p>
          </div>
          <button
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
    </>
  );
};
export default Cart;
