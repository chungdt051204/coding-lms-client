import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { testService } from "../../services/testService";
import { deleteTest, setTests } from "../../stores/features/testSlice";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { RxPeople } from "react-icons/rx";

const Tests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.tests.items);
  const getDate = ({ date }) => {
    const d = new Date(date);
    const day = d.getDay();
    const month = d.getMonth();
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const getTestsByInstructor = async () => {
      try {
        const result = await testService.getTestsByInstructor();
        console.log(result.data);
        dispatch(setTests(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getTestsByInstructor();
  }, [dispatch]);
  const handleDeleteTest = async ({ testId }) => {
    try {
      const result = await testService.deleteTest({ testId });
      dispatch(deleteTest(testId));
      toast.success(result.message || "Xóa bài kiểm tra thành công");
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
        <br />
        <div className="flex flex-col gap-y-3 border w-[95%] p-6 border-gray-300 rounded-[16px]">
          <div className="flex flex-col">
            <p className="text-title-lg text-surface-nav font-medium">
              Danh sách bài kiểm tra
            </p>
            <p className="text-body-lg text-nav-muted">{`${tests.length} bài kiểm tra`}</p>
          </div>
          <table>
            <thead>
              <tr className="text-title-sm text-surface-nav font-medium border-b border-b-gray-300">
                <td className="py-2 ps-2">Tên bài kiểm tra</td>
                <td>Khóa học</td>
                <td>Số câu hỏi</td>
                <td>Thời gian</td>
                <td>Lượt làm</td>
                <td>Trạng thái</td>
                <td className="text-right pe-2">Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {tests?.map((value) => {
                return (
                  <tr
                    className="border-b border-b-gray-300 hover:bg-surface-bg"
                    key={value.test._id}
                  >
                    <td className="flex flex-col py-2 ps-2">
                      <p className="text-body-lg text-surface-nav font-medium">
                        {value.test.test_name}
                      </p>
                      <p className="text-nav-muted text-body-md">
                        Ngày tạo: {getDate({ date: value.test.createdAt })}
                      </p>
                    </td>
                    <td className="text-body-lg text-surface-nav">
                      {value.test.course_id.course_name}
                    </td>
                    <td>
                      <p className="text-body-md text-surface-nav font-medium text-center border border-gray-300 rounded-[8px] w-[75%]">
                        {value.numberQuestion} câu
                      </p>
                    </td>
                    <td>
                      <div className="flex gap-x-1 items-center">
                        <IoMdTime />
                        <p className="text-body-lg text-surface-nav">
                          {value.test.duration_minutes} phút
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-x-1 items-center w-[50%] mx-auto">
                        <RxPeople />
                        <p>0</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-body-md text-surface-nav font-medium text-center border border-gray-300 rounded-[8px] w-[75%]">
                        {value.test.status ? "Hoạt động" : "Nháp"}
                      </p>
                    </td>
                    <td className="pe-2">
                      {!value.test.status && (
                        <div className="flex gap-x-1 justify-end items-center">
                          <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                            <LuSquarePen
                              onClick={() =>
                                navigate(
                                  `/instructor/test/${value.test._id}/edit`
                                )
                              }
                            />
                          </div>
                          <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                            <RiDeleteBinLine
                              className="text-brand-primary"
                              onClick={() =>
                                handleDeleteTest({ testId: value.test._id })
                              }
                            />
                          </div>
                          <button className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer">
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
        </div>
      </div>
    </>
  );
};
export default Tests;
