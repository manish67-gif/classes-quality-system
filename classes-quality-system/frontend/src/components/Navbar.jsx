import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    const [role, setRole] = useState(null);

    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            try {
                const user = JSON.parse(localStorage.getItem("user") || "null");
                setRole(user?.role === "institute" ? "class" : user?.role || null);
            } catch {
                setRole(null);
            }
        };

        checkLogin();

        window.addEventListener("authChanged", checkLogin);
        window.addEventListener("storage", checkLogin);

        return () => {
            window.removeEventListener("authChanged", checkLogin);
            window.removeEventListener("storage", checkLogin);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);

        window.dispatchEvent(new Event("authChanged"));

        navigate("/");
    };

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                CQCS
            </Link>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/classes">
                    Classes
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/profile">
                            Profile
                        </Link>

                        <Link to={`/${role || "student"}/dashboard`}>
                            Dashboard
                        </Link>

                        {role === "class" && (
                            <Link to="/classes">My Institute</Link>
                        )}

                        {role === "admin" && (
                            <Link to="/classes">Institutes</Link>
                        )}

                        <button
                            type="button"
                            className="nav-logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/signup">
                            Signup
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;