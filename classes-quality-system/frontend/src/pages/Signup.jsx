import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setMessage(
                    data.message || "Signup failed"
                );

                return;
            }


            setMessage(
                data.message || "Account created successfully!"
            );


            setFormData({
                name: "",
                email: "",
                password: "",
                role: "student"
            });


            // Signup ke baad login page
            setTimeout(() => {
                navigate("/login");
            }, 800);


        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            setMessage(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Create your CQCS student or institute account
                </p>


                <form onSubmit={handleSubmit}>

                    <div>
                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div>
                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div>
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label>
                            Account type
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="student">Student</option>
                            <option value="class">Institute / Class</option>
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {message && (

                    <p
                        className={
                            message.toLowerCase().includes("success")
                                ? "success-message"
                                : "error-message"
                        }
                    >
                        {message}
                    </p>

                )}

            </div>

        </div>
    );
}

export default Signup;