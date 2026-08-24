import { PiWarningCircle } from "react-icons/pi";
const ConfirmDialog = ({ message, ref, handleClick }) => {
  return (
    <>
      <dialog
        ref={ref}
        className="w-[480px] p-4 m-auto rounded-[8px] shadow-lg"
      >
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col items-center">
            <PiWarningCircle className="text-display-lg text-yellow-300" />
            <p className="text-title-sm text-surface-nav font-medium">
              {message}
            </p>
          </div>
          <hr className="text-gray-300" />
          <div className="flex flex-col items-end">
            <div className="flex gap-x-4 text-title-sm">
              <button
                className="px-6 py-2 border border-gray-300 rounded-[8px] transition-transform duration-300 hover:cursor-pointer"
                onClick={() => ref?.current?.close()}
              >
                Hủy
              </button>
              <button
                className="px-6 py-2 bg-blue-600 rounded-[8px] text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                onClick={handleClick}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default ConfirmDialog;
