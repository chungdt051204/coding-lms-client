import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRouteInstructor = () => {
  const { item: me, isLoading } = useSelector((state) => state.me);
  if (!sessionStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (!isLoading && me?.verified_status !== "VERIFIED")
    return <Navigate to="/my-profile" replace />;
  if (me?.role_id.role === "instructor") return <Outlet />;
  if (isLoading) return <div>Loading...</div>;
  return <Navigate to="/" replace />;
};
export default ProtectedRouteInstructor;
