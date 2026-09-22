import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "nanthakumar2006geetha02@gmail.com";

function AdminRoute({ children }) {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userStr);
    const userEmail = (user?.email || "").toLowerCase().trim();
    const isAdmin =
      userEmail === ADMIN_EMAIL.toLowerCase() || user?.role === "admin";

    if (!isAdmin) {
      return <Navigate to="/home" replace />;
    }

    return children;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
}

export default AdminRoute;
