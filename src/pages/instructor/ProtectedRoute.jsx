import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";

const ProtectedRouteInstructor = () => {
  const { item: me, isLoading } = useSelector((state) => state.me);
  if (!sessionStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (
    !isLoading &&
    me?.role_id.role === "instructor" &&
    me?.verified_status !== "VERIFIED"
  )
    return <Navigate to="/my-profile" replace />;
  if (isLoading)
    return (
      <div className="my-[50vh] text-center">
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
  if (me?.role_id.role === "instructor") return <Outlet />;
  if (me?.role_id.role === "admin")
    return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/" replace />;
};
export default ProtectedRouteInstructor;
