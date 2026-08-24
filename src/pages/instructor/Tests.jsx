import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { testService } from "../../services/testService";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { RxPeople } from "react-icons/rx";
import { IoListOutline } from "react-icons/io5";
import { RiDraftLine } from "react-icons/ri";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import PaginationButton from "../../components/PaginationButton";
import ConfirmDialog from "../../components/ConfirmDialog";

const Tests = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [myTests, setMyTests] = useState([]);
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const getDate = ({ date }) => {
    const d = new Date(date);
    const day = d.getDay();
    const month = d.getMonth();
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const filterTabs = [
    {
      status: "",
      title: "Tất cả bài kiểm tra",
      icon: <IoListOutline />,
    },
    {
      status: "draft",
      title: "Bản nháp",
      icon: <RiDraftLine />,
    },
    {
      status: "active",
      title: "Đang hoạt động",
      icon: <CiCircleCheck />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  const [message, setMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const confirmDialog = useRef();

  useEffect(() => {
    const getTestsByInstructor = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await testService.getTestsByInstructor({
          params: params.toString(),
        });
        console.log(result.data);
        setMyTests(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getTestsByInstructor();
  }, [searchParams, status, refresh]);
  const handleDeleteTest = async () => {
    try {
      const result = await testService.deleteTest({ testId: test?._id });
      toast.success(result.message || "Xóa bài kiểm tra thành công");
      confirmDialog?.current?.close();
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleActiveTest = async () => {
    try {
      const result = await testService.activeTest({ testId: test?._id });
      toast.success(result.message || "Kích hoạt bài kiểm tra thành công");
      confirmDialog?.current?.close();
      setRefresh((prev) => prev + 1);
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] py-8">
        <div className="flex justify-between items-center w-[95%]">
          <div className="h-[70px] flex flex-col justify-between">
            <p className="text-display-sm text-surface-nav font-bold">
              Quản lý bài kiểm tra
            </p>
            <p className="text-title-lg text-nav-muted">
              Tạo và quản lý các bài kiểm tra trắc nghiệm
            </p>
          </div>
          <button
            onClick={() => navigate("/instructor/test/create")}
            className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
          >
            <FaPlus />
            Tạo bài kiểm tra
          </button>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[64%]">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-gray-600",
              "border-b-2 border-b-green-600",
            ];
            const textColors = [
              "text-blue-600",
              "text-gray-600",
              "text-green-600",
            ];
            return (
              <div
                className={`flex py-4 ${
                  idx == index && borderBottomColors[index]
                }`}
                onClick={() => {
                  setIdx(index);
                  setStatus(value.status);
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
          <div className="flex flex-col gap-y-3 border w-[95%] p-6 border-gray-300 rounded-[16px] mt-6">
            <div className="flex flex-col">
              <p className="text-title-lg text-surface-nav font-medium">
                Danh sách bài kiểm tra
              </p>
              <p className="text-body-lg text-nav-muted">{`${myTests?.arrayTest?.length} bài kiểm tra`}</p>
            </div>
            {isLoading ? (
              <p className="text-title-lg text-surface-nav text-center">
                Đang tải dữ liệu...
              </p>
            ) : myTests?.arrayTest?.length == 0 ? (
              <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
                <LuInbox className="text-display-md text-gray-300" />
                <p>Chưa có bài kiểm tra nào</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr className="text-title-sm text-surface-nav font-medium border-b border-b-gray-300">
                    <td className="py-2 ps-2">Tên bài kiểm tra</td>
                    <td>Khóa học</td>
                    <td>Số câu hỏi</td>
                    <td>Thời gian</td>
                    <td>Lượt làm</td>
                    <td className="text-center">Trạng thái</td>
                    <td className="text-right pe-2">Thao tác</td>
                  </tr>
                </thead>
                <tbody>
                  {myTests?.arrayTest?.map((value) => {
                    return (
                      <tr
                        className="border-b border-b-gray-300 hover:bg-surface-bg"
                        key={value?.test?._id}
                      >
                        <td className="flex flex-col py-2 ps-2">
                          <p className="text-body-lg text-surface-nav font-medium">
                            {value?.test?.test_name}
                          </p>
                          <p className="text-nav-muted text-body-md">
                            Ngày tạo:{" "}
                            {getDate({ date: value?.test?.createdAt })}
                          </p>
                        </td>
                        <td className="text-body-lg text-surface-nav">
                          {value?.test?.course_id?.course_name}
                        </td>
                        <td>
                          <p className="text-body-md text-surface-nav font-medium text-center border border-gray-300 rounded-[8px] w-[75%]">
                            {value?.numberQuestion} câu
                          </p>
                        </td>
                        <td>
                          <div className="flex gap-x-1 items-center">
                            <IoMdTime />
                            <p className="text-body-lg text-surface-nav">
                              {value?.test?.duration_minutes} phút
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-x-1 items-center w-[50%] mx-auto">
                            <RxPeople />
                            <p>{value?.numberAttempt}</p>
                          </div>
                        </td>
                        <td>
                          <p
                            className={`text-body-md font-medium text-center border border-gray-300 rounded-[8px] ${
                              value?.test?.is_active
                                ? "bg-green-700 text-surface-white"
                                : "text-surface-nav"
                            }`}
                          >
                            {value?.test?.is_active ? "Hoạt động" : "Nháp"}
                          </p>
                        </td>
                        <td className="pe-2">
                          {!value?.test?.is_active && (
                            <div className="flex gap-x-1 justify-end items-center">
                              <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                <LuSquarePen
                                  onClick={() =>
                                    navigate(
                                      `/instructor/test/${value?.test?._id}/edit`
                                    )
                                  }
                                />
                              </div>
                              <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                <RiDeleteBinLine
                                  className="text-brand-primary"
                                  onClick={() => {
                                    const testId = value?.test?._id;
                                    const item = myTests?.arrayTest?.find(
                                      (value) => value?.test?._id == testId
                                    );
                                    setTest(item?.test);
                                    setIsDeleted(true);
                                    setMessage(
                                      "Bạn có muốn xóa bài kiểm tra này không ?"
                                    );
                                    confirmDialog?.current?.showModal();
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const testId = value?.test?._id;
                                  const item = myTests?.arrayTest?.find(
                                    (value) => value?.test?._id == testId
                                  );
                                  if (item?.numberQuestion == 0) {
                                    toast.error(
                                      "Bài kiểm tra này chưa có câu hỏi, không thể kích hoạt!"
                                    );
                                    return;
                                  }
                                  setTest(item?.test);
                                  setIsDeleted(false);
                                  setMessage(
                                    "Bạn có muốn kích hoạt bài kiểm tra này không ?"
                                  );
                                  confirmDialog?.current?.showModal();
                                }}
                                className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                              >
                                Kích hoạt
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {myTests?.totalPages > 1 && (
              <PaginationButton totalPages={myTests?.totalPages} />
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={isDeleted ? handleDeleteTest : handleActiveTest}
      />
    </>
  );
};
export default Tests;
