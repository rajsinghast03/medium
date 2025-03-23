import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";

export default function PrivateRoute() {
  const user = useAuth();
  if (!user.token) return <Navigate to="/login" />;
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
