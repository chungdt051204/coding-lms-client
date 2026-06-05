import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRouteAdmin = () => {
  const { item: me, isLoading } = useSelector((state) => state.me);
  if (isLoading) return <div>Loading...</div>;
  if (!localStorage.getItem("token")) return <Navigate to="/" replace />;
  if (me?.role_id.role === "admin") return <Outlet />;
  return <Navigate to="/" replace />;
};
export default ProtectedRouteAdmin;
