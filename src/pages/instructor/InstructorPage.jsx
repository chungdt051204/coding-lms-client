import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
export const InstructorPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-between">
        <div className="w-[20%]">
          <Sidebar />
        </div>
        <div className="w-[78%]">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default InstructorPage;
