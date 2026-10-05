import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/AdminStudents.css";

import API from "../config/api";

function AdminStudents() {
    const token = localStorage.getItem("token");

    const [students, setStudents] = useState([]);
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
            console.error(error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const deleteStudent = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this student account? Their reviews will also be deleted."
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/users/${id}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete student"
                );
            }

            setStudents((current) =>
                current.filter(
                    (student) => student.id !== id
                )
            );

            setMessage(
                "Student deleted successfully."
            );

        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return (
            <div className="admin-students-page">
                <div className="admin-students-loading">
                    Loading Students...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-students-page">

            <Link
                to="/admin/dashboard"
                className="admin-students-back"
            >
                ← Back to Admin Dashboard
            </Link>


            <div className="admin-students-header">

                <h1>
                    Students
                </h1>

                <p>
                    Manage registered student accounts.
                </p>

            </div>


            {message && (
                <div className="admin-students-message">
                    {message}
                </div>
            )}


            <div className="admin-students-count">

                <strong>
                    {students.length}
                </strong>

                <span>
                    Registered Students
                </span>

            </div>


            {students.length === 0 ? (

                <div className="admin-students-empty">
                    No students registered.
                </div>

            ) : (

                <div className="admin-students-list">

                    {students.map((student) => (

                        <div
                            key={student.id}
                            className="admin-student-card"
                        >

                            <div className="admin-student-info">

                                <h3>
                                    {student.name}
                                </h3>

                                <p>
                                    {student.email}
                                </p>

                                <span>
                                    Student
                                </span>

                            </div>


                            <div className="admin-student-actions">

                                <Link
                                    to={`/admin/students/${student.id}`}
                                    className="admin-student-view"
                                >
                                    View Details
                                </Link>

                                <button
                                    onClick={() =>
                                        deleteStudent(
                                            student.id
                                        )
                                    }
                                    className="admin-student-delete"
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

export default AdminStudents;