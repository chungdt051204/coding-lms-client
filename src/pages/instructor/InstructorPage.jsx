import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
export const InstructorPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row lg:justify-between pt-20">
        <div className="w-full lg:w-[20%]">
          <Sidebar />
        </div>
        <div className="w-full lg:w-[78%]">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default InstructorPage;
