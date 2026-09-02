import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { courseService } from "../services/courseService";
import { setCourses } from "../stores/features/courseSlice";
import { IoSearch } from "react-icons/io5";
import Select from "react-select";
import Navbar from "../components/Navbar";
import ListCourses from "../components/ListCourses";
import PaginationButton from "../components/PaginationButton";
import Footer from "../components/Footer";

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const { items: courses, isLoading } = useSelector((state) => state.courses);
  const [searchValue, setSearchValue] = useState("");
  let categoryOptions = [
    {
      label: "Tất cả danh mục",
      value: "",
    },
  ];
  categories?.forEach((value) => {
    categoryOptions.push({
      label: value?.item?.category_name,
      value: value?.item?._id,
    });
  });
  const options = [
    {
      label: "Tất cả khóa học",
      value: "",
    },
    {
      label: "Đánh giá cao đến thấp",
      value: "highest-rating",
    },
    {
      label: "Mới nhất đến cũ nhất",
      value: "newest",
    },
    {
      label: "Giá thấp đến cao",
      value: "price-asc",
    },
    {
      label: "Giá cao đến thấp",
      value: "price-desc",
    },
  ];
  const levels = [
    {
      label: "Tất cả cấp độ",
      value: "",
    },
    {
      label: "Cơ bản",
      value: "Cơ bản",
    },
    {
      label: "Trung bình",
      value: "Trung bình",
    },
    {
      label: "Nâng cao",
      value: "Nâng cao",
    },
  ];
  const [category, setCategory] = useState("");
  const [option, setOption] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const getApprovedCourses = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 6);
        if (page) params.append("page", page);
        if (category?.value) params.append("categoryId", category?.value);
        if (level?.value) params.append("level", level?.value);
        if (option?.value) params.append("option", option?.value);
        const result = await courseService.getApprovedCourses({
          params: params.toString(),
        });
        console.log(result.data);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    };
    getApprovedCourses();
  }, [dispatch, searchParams, page, category, level, option]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-y-6 md:gap-y-8 px-4 sm:px-8 md:px-16 xl:px-40 py-24">
        {/* Header Section */}
        <div className="flex flex-col gap-y-1 sm:gap-y-2">
          <p className="text-headline-md sm:text-display-sm text-surface-nav font-bold">
            Khám phá khóa học
          </p>
          <p className="text-body-md sm:text-title-lg text-nav-muted">
            Tìm khóa học phù hợp với bạn
          </p>
        </div>
        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-x-6 p-4 md:p-6 border border-gray-300 rounded-[8px] bg-surface-white">
          <div className="relative w-full lg:w-[55%]">
            <div className="flex gap-x-2 items-center py-2 px-4 bg-surface-bg rounded-[8px]">
              <IoSearch
                onClick={() => {
                  if (!searchValue?.trim()) {
                    setError("Vui lòng nhập từ khóa tìm kiếm!");
                    return;
                  }
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    if (searchValue) newParams.set("search", searchValue);
                    else newParams.delete("search");
                    return newParams;
                  });
                }}
                className="text-title-lg sm:text-headline-sm text-nav-muted font-medium hover:cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={searchValue}
                className="w-full bg-transparent outline-0 text-body-md sm:text-body-lg text-surface-nav placeholder:text-nav-muted"
                placeholder="Nhập tên khóa học, danh mục, giảng viên"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setError("");
                }}
              />
            </div>
            {error && (
              <span className="text-caption sm:text-body-md text-red-500 mt-1 block">
                {error}
              </span>
            )}
          </div>
          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-[45%]">
            <Select
              onChange={setCategory}
              defaultValue={categoryOptions[0]}
              className="w-full lg:w-[65%] text-title-sm text-nav-muted font-medium"
              options={categoryOptions}
            />
            <Select
              onChange={setLevel}
              defaultValue={levels[0]}
              className="w-full lg:w-[65%] text-title-sm text-nav-muted font-medium"
              options={levels}
            />
          </div>
        </div>
        {/* Course List & Sort Section */}
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-y-3 sm:gap-y-0">
            <p className="text-body-md sm:text-headline-sm text-surface-nav font-medium">
              Hiển thị {courses?.arrayCourse?.length || 0} khóa học
            </p>
            <Select
              onChange={setOption}
              defaultValue={options[0]}
              className="w-full sm:w-[40%] md:w-[30%] lg:w-[25%] text-title-sm text-nav-muted font-medium"
              options={options}
            />
          </div>
          <div className="w-full">
            <ListCourses courses={courses} isLoading={isLoading} />
          </div>
          {courses?.totalPages > 1 && (
            <PaginationButton totalPages={courses?.totalPages} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Courses;
