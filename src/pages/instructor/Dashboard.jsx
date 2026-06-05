import { useSelector } from "react-redux";

const InstructorDashboard = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);

  return (
    <>
      <div>{isLogin && me && <p>Xin chào {me.full_name}</p>}</div>
    </>
  );
};
export default InstructorDashboard;
