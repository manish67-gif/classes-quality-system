import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../styles/AdminClassDetails.css";

import API from "../config/api";

function AdminClassDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [classData, setClassData] = useState(null);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };


    // =========================================
    // LOAD INSTITUTE
    // =========================================

    const loadClass = async () => {
        try {
            const response = await fetch(
                `${API}/classes/${id}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load institute"
                );
            }

            setClassData(data.class);

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        }
    };


    // =========================================
    // LOAD COURSES
    // =========================================

    const loadCourses = async () => {
        try {
            const response = await fetch(
                `${API}/courses/class/${id}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load courses"
                );
            }

            setCourses(data.courses || []);

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);

            await Promise.all([
                loadClass(),
                loadCourses()
            ]);

            setLoading(false);
        };

        loadPage();
    }, [id]);


    // =========================================
    // DELETE COURSE
    // =========================================

    const deleteCourse = async (courseId) => {

        const confirmed = window.confirm(
            "Delete this course? Its subjects and reviews will also be deleted."
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/courses/${courseId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete course"
                );
            }

            setCourses((current) =>
                current.filter(
                    (course) => course._id !== courseId
                )
            );

            setMessage(
                "Course deleted successfully."
            );

        } catch (error) {
            setMessage(error.message);
        }
    };


    // =========================================
    // DELETE INSTITUTE
    // =========================================

    const deleteInstitute = async () => {

        const confirmed = window.confirm(
            "Delete this institute? All courses, subjects and reviews will also be deleted."
        );

        if (!confirmed) {
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

            navigate("/admin/classes");

        } catch (error) {
            setMessage(error.message);
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="admin-class-details-page">
                <div className="admin-class-details-loading">
                    Loading Institute...
                </div>
            </div>
        );
    }


    if (!classData) {
        return (
            <div className="admin-class-details-page">

                <Link
                    to="/admin/classes"
                    className="admin-class-details-back"
                >
                    ← Back to Classes
                </Link>

                <div className="admin-class-details-error">
                    {message || "Institute not found."}
                </div>

            </div>
        );
    }


    return (
        <div className="admin-class-details-page">

            {/* BACK */}

            <Link
                to="/admin/classes"
                className="admin-class-details-back"
            >
                ← Back to Classes
            </Link>


            {/* HEADER */}

            <div className="admin-class-details-header">

                <div>

                    <span className="admin-class-details-label">
                        Institute Management
                    </span>

                    <h1>
                        {classData.name}
                    </h1>

                    <p>
                        {classData.description ||
                            "No description available."}
                    </p>

                </div>

                <button
                    onClick={deleteInstitute}
                    className="admin-class-details-delete"
                >
                    Delete Institute
                </button>

            </div>


            {/* MESSAGE */}

            {message && (
                <div className="admin-class-details-message">
                    {message}
                </div>
            )}


            {/* INSTITUTE INFORMATION */}

            <section className="admin-class-details-section">

                <h2>
                    Institute Information
                </h2>

                <div className="admin-class-details-info-grid">

                    <div>
                        <span>Location</span>
                        <strong>
                            {classData.location || "Not provided"}
                        </strong>
                    </div>

                    <div>
                        <span>Address</span>
                        <strong>
                            {classData.address || "Not provided"}
                        </strong>
                    </div>

                    <div>
                        <span>Contact Number</span>
                        <strong>
                            {classData.contactNumber || "Not provided"}
                        </strong>
                    </div>

                    <div>
                        <span>Website</span>
                        <strong>
                            {classData.website || "Not provided"}
                        </strong>
                    </div>

                    <div>
                        <span>Rating</span>
                        <strong>
                            {classData.rating !== null &&
                                classData.rating !== undefined
                                ? `⭐ ${classData.rating}`
                                : "No rating"}
                        </strong>
                    </div>

                </div>

            </section>


            {/* COURSES */}

            <section className="admin-class-details-section">

                <div className="admin-class-details-section-header">

                    <div>
                        <h2>
                            Courses
                        </h2>

                        <p>
                            Courses offered by this institute.
                        </p>
                    </div>

                    <span className="admin-class-details-count">
                        {courses.length}
                    </span>

                </div>


                {courses.length === 0 ? (

                    <div className="admin-class-details-empty">
                        No courses registered for this institute.
                    </div>

                ) : (

                    <div className="admin-class-details-course-list">

                        {courses.map((course) => (

                            <div
                                key={course._id}
                                className="admin-course-card"
                            >

                                <div>

                                    <h3>
                                        {course.name}
                                    </h3>

                                    <div className="admin-course-meta">

                                        <span>
                                            💰 ₹{course.fees}
                                        </span>

                                        <span>
                                            ⏱️ {course.duration || "Not specified"}
                                        </span>

                                        <span>
                                            ⭐{" "}
                                            {course.rating !== null &&
                                                course.rating !== undefined
                                                ? course.rating
                                                : "No rating"}
                                        </span>

                                    </div>

                                </div>


                                <div className="admin-course-actions">

                                    <Link
                                        to={`/admin/classes/${id}/courses/${course._id}`}
                                        className="admin-course-view"
                                    >
                                        Manage Course →
                                    </Link>

                                    <button
                                        onClick={() =>
                                            deleteCourse(course._id)
                                        }
                                        className="admin-course-delete"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default AdminClassDetails;