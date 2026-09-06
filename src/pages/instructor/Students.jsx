import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { IoEyeOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import PaginationButton from "../../components/PaginationButton";

const Students = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStudentsByInstructor = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        const result = await userService.getStudentsByInstructor({ params });
        console.log(result.data);
        setStudents(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getStudentsByInstructor();
  }, [searchParams]);

  return (
    <>
      <div className="w-[100%] px-6 md:px-8 py-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý học viên
          </p>
          <p className="text-title-lg text-nav-muted">
            Xem và quản lý học viên đã đăng ký khóa học
          </p>
        </div>
        <div className="flex flex-col gap-y-6">
          {isLoading ? (
            <p className="text-title-lg text-surface-nav text-center mt-2">
              Đang tải dữ liệu...
            </p>
          ) : students?.items?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có học viên nào</p>
            </div>
          ) : (
            <table className="border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
              <thead>
                <tr className="flex items-center justify-between text-surface-nav font-medium">
                  <td className="w-[50%] p-2">Học viên</td>
                  <td className="w-[30%] p-2 text-right">Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {students?.items?.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                      key={value._id}
                    >
                      <td className="flex items-center gap-x-2 w-[60%] p-2">
                        <img
                          className="w-[50px] h-[50px] rounded-[1000px] object-contain shrink-0"
                          src={value.avatar}
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-surface-nav text-title-lg font-medium wrap-break-word">
                            {value.full_name}
                          </p>
                          <p className="text-nav-muted text-body-lg wrap-break-word">
                            {value.email}
                          </p>
                        </div>
                      </td>
                      <td className="flex justify-end gap-x-2 items-center w-[25%] pe-2">
                        <IoEyeOutline
                          onClick={() =>
                            navigate(`/instructor/student/${value._id}`)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {students?.totalPages > 1 && (
            <PaginationButton totalPages={students?.totalPages} />
          )}
        </div>
      </div>
    </>
  );
};
export default Students;
