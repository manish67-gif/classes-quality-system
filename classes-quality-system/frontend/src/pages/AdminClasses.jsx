import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/AdminClasses.css";

import API from "../config/api";

function AdminClasses() {
    const token = localStorage.getItem("token");

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const loadClasses = async () => {
        try {
            const response = await fetch(
                `${API}/classes`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load classes"
                );
            }

            setClasses(data.classes || []);

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const deleteClass = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this institute? Its courses, subjects and reviews will also be deleted."
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/classes/${id}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete institute"
                );
            }

            setClasses((current) =>
                current.filter(
                    (item) => item._id !== id
                )
            );

            setMessage(
                "Institute deleted successfully."
            );

        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return (
            <div className="admin-classes-page">
                <div className="admin-classes-loading">
                    Loading Classes...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-classes-page">

            <Link
                to="/admin/dashboard"
                className="admin-classes-back"
            >
                ← Back to Admin Dashboard
            </Link>


            <div className="admin-classes-header">

                <h1>
                    Classes
                </h1>

                <p>
                    Manage registered coaching institutes.
                </p>

            </div>


            {message && (
                <div className="admin-classes-message">
                    {message}
                </div>
            )}


            <div className="admin-classes-count">

                <strong>
                    {classes.length}
                </strong>

                <span>
                    Registered Classes
                </span>

            </div>


            {classes.length === 0 ? (

                <div className="admin-classes-empty">
                    No classes registered.
                </div>

            ) : (

                <div className="admin-classes-list">

                    {classes.map((item) => (

                        <div
                            key={item._id}
                            className="admin-class-card"
                        >

                            <div className="admin-class-info">

                                <h2>
                                    {item.name}
                                </h2>

                                <p>
                                    {item.description ||
                                        "No description available."}
                                </p>


                                <div className="admin-class-meta">

                                    {item.location && (
                                        <span>
                                            📍 {item.location}
                                        </span>
                                    )}

                                    {item.contactNumber && (
                                        <span>
                                            📞 {item.contactNumber}
                                        </span>
                                    )}

                                    {item.rating !== null &&
                                        item.rating !== undefined && (
                                            <span>
                                                ⭐ {item.rating}
                                            </span>
                                        )}

                                </div>

                            </div>


                            <div className="admin-class-actions">

                                <Link
                                    to={`/admin/classes/${item._id}`}
                                    className="admin-class-view"
                                >
                                    Manage Institute →
                                </Link>

                                <button
                                    onClick={() =>
                                        deleteClass(
                                            item._id
                                        )
                                    }
                                    className="admin-class-delete"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminClasses;