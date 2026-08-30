import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
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

            {/* LOGO */}
            <Link to="/" className="logo">
                CQCS
            </Link>

            {/* NAVIGATION */}
            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/classes">
                    Classes
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/profile">
                            Profile
                        </Link>

                        <Link to="/compare">
                            Compare
                        </Link>

                        <button
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