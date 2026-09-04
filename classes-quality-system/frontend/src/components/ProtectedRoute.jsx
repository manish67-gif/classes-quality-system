import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.role === "institute" ? "class" : user?.role;

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to={role ? `/${role}/dashboard` : "/login"} replace />;
    }

    return children;
}

export default ProtectedRoute;