import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase";

const PrivateRoute = () => {
  const [user] = useAuthState(auth);
  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
