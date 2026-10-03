import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [role, setRole] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));

            try {
                const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                setRole(
                    user?.role === "institute"
                        ? "class"
                        : user?.role || null
                );
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

    useEffect(() => {
        if (!menuOpen) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setRole(null);
        setMenuOpen(false);

        window.dispatchEvent(new Event("authChanged"));

        navigate("/");
    };

    return (
        <>
            <nav className="navbar">

                {/* LOGO */}

                <Link
                    to="/"
                    className="logo"
                    onClick={closeMenu}
                >
                    CQCS
                </Link>


                {/* DESKTOP NAVIGATION */}

                <div className="nav-links">

                    {role !== "admin" && (
                        <Link to="/">
                            Home
                        </Link>
                    )}

                    <Link to="/classes">
                        Classes
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/profile">
                                Profile
                            </Link>

                            {role === "class" && (
                                <Link to="/class/dashboard">
                                    My Institute
                                </Link>
                            )}

                            {role === "admin" && (
                                <>
                                    <Link to="/admin/dashboard">
                                        Admin Dashboard
                                    </Link>

                                    <Link to="/classes">
                                        Institutes
                                    </Link>
                                </>
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


                {/* MOBILE MENU BUTTON */}

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

            </nav>


            {/* MOBILE OVERLAY */}

            {menuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={closeMenu}
                ></div>
            )}


            {/* MOBILE SIDEBAR */}

            <aside
                className={`mobile-sidebar ${menuOpen ? "mobile-sidebar-open" : ""
                    }`}
                aria-hidden={!menuOpen}
            >

                <div className="mobile-sidebar-header">

                    <Link
                        to="/"
                        className="mobile-sidebar-logo"
                        onClick={closeMenu}
                    >
                        CQCS
                    </Link>

                    <button
                        type="button"
                        className="mobile-close-button"
                        onClick={closeMenu}
                        aria-label="Close navigation menu"
                    >
                        ×
                    </button>

                </div>


                <div className="mobile-sidebar-links">

                    {role !== "admin" && (
                        <Link
                            to="/"
                            onClick={closeMenu}
                        >
                            <span>⌂</span>
                            Home
                        </Link>
                    )}

                    <Link
                        to="/classes"
                        onClick={closeMenu}
                    >
                        <span>▣</span>
                        Classes
                    </Link>


                    {isLoggedIn && (
                        <>
                            <Link
                                to="/profile"
                                onClick={closeMenu}
                            >
                                <span>●</span>
                                Profile
                            </Link>


                            {role === "class" && (
                                <Link
                                    to="/class/dashboard"
                                    onClick={closeMenu}
                                    className="mobile-active-link"
                                >
                                    <span>▤</span>
                                    My Institute
                                </Link>
                            )}


                            {role === "admin" && (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={closeMenu}
                                    >
                                        <span>▦</span>
                                        Admin Dashboard
                                    </Link>

                                    <Link
                                        to="/classes"
                                        onClick={closeMenu}
                                    >
                                        <span>▣</span>
                                        Institutes
                                    </Link>
                                </>
                            )}


                            <div className="mobile-sidebar-divider"></div>

                            <button
                                type="button"
                                className="mobile-logout-button"
                                onClick={handleLogout}
                            >
                                <span>↪</span>
                                Logout
                            </button>
                        </>
                    )}


                    {!isLoggedIn && (
                        <>
                            <div className="mobile-sidebar-divider"></div>

                            <Link
                                to="/login"
                                onClick={closeMenu}
                            >
                                <span>→</span>
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                onClick={closeMenu}
                            >
                                <span>+</span>
                                Signup
                            </Link>
                        </>
                    )}

                </div>

            </aside>
        </>
    );
}

export default Navbar;