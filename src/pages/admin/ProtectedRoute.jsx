import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

const ProtectedRouteAdmin = () => {
  const { item: me, isLoading } = useSelector((state) => state.me);
  if (!sessionStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (isLoading)
    return (
      <div className="my-[50vh] h-[100vh] text-center">
        <Ring2
          size="40"
          stroke="5"
          strokeLength="0.25"
          bgOpacity="0.1"
          speed="0.8"
          color="blue"
        />
      </div>
    );
  if (me?.role_id.role === "admin") return <Outlet />;
  if (me?.role_id?.role === "instructor")
    return <Navigate to="/instructor/dashboard" replace />;
  return <Navigate to="/" replace />;
};
export default ProtectedRouteAdmin;
