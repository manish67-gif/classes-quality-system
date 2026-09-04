import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setMessage(
                    data.message || "Login failed"
                );

                return;
            }


            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            window.dispatchEvent(
                new Event("authChanged")
            );


            setMessage(
                "Login successful!"
            );


            const role = data.user?.role === "institute" ? "class" : data.user?.role;
            setTimeout(() => navigate(role ? `/${role}/dashboard` : "/"), 500);


        } catch (error) {

            console.error(
                "Login error:",
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
                    Login
                </h1>


                <form onSubmit={handleSubmit}>

                    <div>

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div>

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                {message && (

                    <p className={
                        message.includes("successful")
                            ? "success-message"
                            : "error-message"
                    }>

                        {message}

                    </p>

                )}

            </div>

        </div>
    );
}

export default Login;