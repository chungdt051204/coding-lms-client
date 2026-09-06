import { useSearchParams } from "react-router-dom";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";

const PaginationButton = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page")) || 1;
  const currentPage = Math.min(Math.max(1, rawPage), Math.max(1, totalPages));
  // Tính toán dải 2 nút trang xoay quanh trang hiện tại
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage >= totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };
  const handleSetParams = ({ page }) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (page > 1) newParams.set("page", page);
      else newParams.delete("page");
      return newParams;
    });
  };
  return (
    <>
      <div className="flex justify-between">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            handleSetParams({ page: currentPage - 1 });
          }}
          className={`flex gap-x-2 items-center px-3 py-1 border border-gray-200 rounded-[8px] text-title-sm font-medium ${
            currentPage <= 1
              ? "text-nav-muted hover:cursor-not-allowed"
              : "text-surface-nav transition-transform duration-300 hover:cursor-pointer hover:bg-surface-bg"
          }`}
        >
          <p className="hidden md:block">Trang trước</p>
          <FaAnglesLeft className="block md:hidden" />
        </button>
        <div className="flex gap-x-2">
          {getVisiblePages()?.map((value, i) => {
            return (
              <button
                onClick={() => handleSetParams({ page: value })}
                key={i}
                className={`px-4 py-2 rounded-[8px] text-title-sm font-medium transition-transform duration-300 hover:cursor-pointer ${
                  currentPage == value
                    ? "bg-brand-blue text-surface-white"
                    : "bg-surface-bg hover:bg-gray-200"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => {
            handleSetParams({ page: currentPage + 1 });
          }}
          className={`flex gap-x-2 items-center px-3 py-1 rounded-[8px] text-title-sm text-surface-white font-medium ${
            currentPage == totalPages
              ? "bg-gray-400 hover:cursor-not-allowed"
              : "bg-surface-nav transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
          }`}
        >
          <p className="hidden md:block">Trang sau</p>
          <FaAnglesRight className="block md:hidden" />
        </button>
      </div>
    </>
  );
};
export default PaginationButton;
