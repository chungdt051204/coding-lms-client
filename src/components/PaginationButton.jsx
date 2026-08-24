import { useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

const PaginationButton = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pages = Array.from({ length: totalPages });
  const currentPage = searchParams.get("page") || 1;
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
          disabled={currentPage == 1}
          onClick={() => {
            if (currentPage > 1) {
              handleSetParams({ page: Number(currentPage - 1) });
            }
          }}
          className={`flex gap-x-2 items-center px-4 py-1 border border-gray-200 rounded-[8px] text-title-sm font-medium ${
            currentPage == 1
              ? "text-nav-muted hover:cursor-not-allowed"
              : "text-surface-nav transition-transform duration-300 hover:cursor-pointer hover:bg-surface-bg"
          }`}
        >
          Trang trước
        </button>
        <div className="flex gap-x-2">
          {pages?.map((_, i) => {
            return (
              <button
                onClick={() => handleSetParams({ page: i + 1 })}
                key={i}
                className={`px-4 py-2 rounded-[8px] text-title-sm font-medium transition-transform duration-300 hover:cursor-pointer ${
                  currentPage == i + 1
                    ? "bg-brand-blue text-surface-white"
                    : "bg-surface-bg hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <button
          disabled={currentPage == totalPages}
          onClick={() => {
            if (currentPage < totalPages)
              handleSetParams({ page: Number(currentPage + 1) });
          }}
          className={`flex gap-x-2 items-center px-4 py-1 rounded-[8px] text-title-sm text-surface-white font-medium ${
            currentPage == totalPages
              ? "bg-gray-400 hover:cursor-not-allowed"
              : "bg-surface-nav transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
          }`}
        >
          Trang sau
        </button>
      </div>
    </>
  );
};
export default PaginationButton;
