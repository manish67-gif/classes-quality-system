import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/AdminDashboard.css";

import API from "../config/api";

function AdminDashboard() {
    const token = localStorage.getItem("token");

    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const loadStudents = async () => {
        try {
            const response = await fetch(
                `${API}/users?role=student`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load students"
                );
            }

            setStudents(data.users || []);

        } catch (error) {
            console.error("Load students error:", error);
            setMessage(error.message);
        }
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
            console.error("Load classes error:", error);
            setMessage(error.message);
        }
    };

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            setMessage("");

            await Promise.all([
                loadStudents(),
                loadClasses()
            ]);

            setLoading(false);
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <div className="admin-loading">
                    Loading Admin Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">

            {/* HEADER */}

            <div className="admin-dashboard-header">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage students, classes and academic content.
                    </p>
                </div>

            </div>


            {/* MESSAGE */}

            {message && (
                <div className="admin-dashboard-error">
                    {message}
                </div>
            )}


            {/* USER MANAGEMENT */}

            <section className="admin-dashboard-section">

                <div className="admin-section-heading">

                    <h2>User Management</h2>

                    <p>
                        Select a user role to view registered users.
                    </p>

                </div>


                <div className="admin-role-grid">

                    {/* STUDENTS */}

                    <Link
                        to="/admin/students"
                        className="admin-role-card"
                    >

                        <div className="admin-role-icon">
                            👨‍🎓
                        </div>

                        <div className="admin-role-content">

                            <h3>
                                Students
                            </h3>

                            <p>
                                Registered student accounts
                            </p>

                            <strong>
                                {students.length}
                            </strong>

                            <span>
                                View Students →
                            </span>

                        </div>

                    </Link>


                    {/* CLASSES */}

                    <Link
                        to="/admin/classes"
                        className="admin-role-card"
                    >

                        <div className="admin-role-icon">
                            🏫
                        </div>

                        <div className="admin-role-content">

                            <h3>
                                Classes
                            </h3>

                            <p>
                                Registered coaching classes
                            </p>

                            <strong>
                                {classes.length}
                            </strong>

                            <span>
                                View Classes →
                            </span>

                        </div>

                    </Link>

                </div>

            </section>


            {/* PLATFORM OVERVIEW */}

            <section className="admin-dashboard-section">

                <div className="admin-section-heading">

                    <h2>
                        Platform Overview
                    </h2>

                </div>


                <div className="admin-overview-grid">

                    <div className="admin-overview-card">

                        <span>
                            {students.length}
                        </span>

                        <p>
                            Students
                        </p>

                    </div>


                    <div className="admin-overview-card">

                        <span>
                            {classes.length}
                        </span>

                        <p>
                            Classes
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;