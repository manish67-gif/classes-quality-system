import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import "../styles/signup.css";

const initialForm = {
    name: "",
    email: "",
    password: "",
    role: "student",
    className: "",
    description: "",
    location: "",
    address: "",
    contactNumber: "",
    website: "",
};

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleChange = (role) => {
        setFormData({
            ...formData,
            role,
        });

        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Signup failed");
                return;
            }

            setMessage(
                data.message || "Account created successfully!"
            );

            setFormData(initialForm);

            setTimeout(() => {
                navigate("/login");
            }, 800);
        } catch (error) {
            console.error("Signup error:", error);

            setMessage("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-shell">

                {/* LEFT BRAND PANEL */}
                <aside className="signup-intro">

                    <div className="signup-brand-mark">
                        CQ
                    </div>

                    <span className="signup-label">
                        CLASSES QUALITY CHECKING SYSTEM
                    </span>

                    <h1>
                        Find the right
                        <span> learning experience.</span>
                    </h1>

                    <p>
                        Create your account to explore coaching
                        classes, compare teaching quality, read
                        student reviews and make better decisions.
                    </p>

                    <div className="signup-benefits">

                        <div className="signup-benefit">
                            <span>✓</span>
                            <div>
                                <strong>Compare classes</strong>
                                <small>
                                    Compare fees, quality and reviews.
                                </small>
                            </div>
                        </div>

                        <div className="signup-benefit">
                            <span>✓</span>
                            <div>
                                <strong>Read real reviews</strong>
                                <small>
                                    Understand the student experience.
                                </small>
                            </div>
                        </div>

                        <div className="signup-benefit">
                            <span>✓</span>
                            <div>
                                <strong>Explore demo lectures</strong>
                                <small>
                                    See how subjects are taught.
                                </small>
                            </div>
                        </div>

                    </div>

                </aside>

                {/* FORM PANEL */}
                <main className="signup-form-panel">

                    <div className="signup-heading">
                        <span>Create Account</span>

                        <h2>
                            Join CQCS
                        </h2>

                        <p>
                            Choose your account type and enter
                            your details below.
                        </p>
                    </div>

                    {/* ACCOUNT TYPE */}
                    <div className="signup-role">

                        <label>
                            Account type
                        </label>

                        <div className="signup-role-switch">

                            <button
                                type="button"
                                className={
                                    formData.role === "student"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleRoleChange("student")
                                }
                            >
                                <span className="role-icon">
                                    👤
                                </span>

                                <span>
                                    <strong>Student</strong>
                                    <small>
                                        Find and review classes
                                    </small>
                                </span>
                            </button>

                            <button
                                type="button"
                                className={
                                    formData.role === "class"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleRoleChange("class")
                                }
                            >
                                <span className="role-icon">
                                    🏫
                                </span>

                                <span>
                                    <strong>Institute</strong>
                                    <small>
                                        Manage your class profile
                                    </small>
                                </span>
                            </button>

                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className={
                            formData.role === "class"
                                ? "signup-form institute-form"
                                : "signup-form"
                        }
                    >

                        {/* BASIC INFORMATION */}
                        <div className="signup-section">

                            <div className="signup-section-title">
                                <span>01</span>

                                <div>
                                    <strong>Account information</strong>
                                    <small>
                                        Your basic login details
                                    </small>
                                </div>
                            </div>

                            <div className="signup-grid">

                                <div className="signup-field">
                                    <label>Full name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="signup-field">
                                    <label>Email address</label>

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="signup-field signup-full">
                                    <label>Password</label>

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />

                                    <small className="signup-hint">
                                        Minimum 6 characters
                                    </small>
                                </div>

                            </div>

                        </div>

                        {/* INSTITUTE INFORMATION */}
                        {formData.role === "class" && (
                            <div className="signup-section">

                                <div className="signup-section-title">
                                    <span>02</span>

                                    <div>
                                        <strong>
                                            Institute information
                                        </strong>

                                        <small>
                                            Help students understand your institute
                                        </small>
                                    </div>
                                </div>

                                <div className="signup-grid">

                                    <div className="signup-field signup-full">
                                        <label>
                                            Institute name
                                        </label>

                                        <input
                                            type="text"
                                            name="className"
                                            placeholder="e.g. Bright Future Academy"
                                            value={formData.className}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="signup-field signup-full">
                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            placeholder="Briefly describe your institute, courses and teaching approach..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                        />
                                    </div>

                                    <div className="signup-field">
                                        <label>Location</label>

                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="e.g. Bhiwandi"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="signup-field">
                                        <label>Contact number</label>

                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            placeholder="Enter contact number"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="signup-field signup-full">
                                        <label>Full address</label>

                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Enter complete institute address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="signup-field signup-full">
                                        <label>
                                            Website
                                            <span className="optional">
                                                Optional
                                            </span>
                                        </label>

                                        <input
                                            type="url"
                                            name="website"
                                            placeholder="https://example.com"
                                            value={formData.website}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>

                            </div>
                        )}

                        {/* STUDENT MESSAGE */}
                        {formData.role === "student" && (
                            <div className="signup-student-note">
                                <span>✓</span>

                                <div>
                                    <strong>
                                        You're signing up as a student
                                    </strong>

                                    <p>
                                        After creating your account,
                                        you can explore classes, compare
                                        courses and submit reviews.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="signup-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    {message && (
                        <div
                            className={
                                message
                                    .toLowerCase()
                                    .includes("success")
                                    ? "signup-success"
                                    : "signup-error"
                            }
                        >
                            {message}
                        </div>
                    )}

                    <p className="signup-login">
                        Already have an account?
                        {" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </p>

                </main>

            </div>

        </div>
    );
}

export default Signup;