import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/AdminStudentDetails.css";
import API from "../config/api";

const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const Rating = ({ value }) => (
    <span className="asd-rating">
        <span>★</span> {Number(value || 0).toFixed(1)}
    </span>
);

function AdminStudentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const response = await fetch(`${API}/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to load student"
                    );
                }

                setData(result);
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [id, token]);

    const deleteStudent = async () => {
        const confirmed = window.confirm(
            "Delete this student account and all submitted reviews?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`${API}/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete student"
                );
            }

            navigate("/admin/students");
        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return (
            <div className="asd-page">
                <div className="asd-state">
                    Loading student details...
                </div>
            </div>
        );
    }

    if (!data?.user) {
        return (
            <div className="asd-page">
                <Link to="/admin/students" className="asd-back">
                    ← Students
                </Link>

                <div className="asd-state asd-error">
                    {message || "Student not found."}
                </div>
            </div>
        );
    }

    const student = data.user;
    const reviews = data.reviews || [];

    return (
        <div className="asd-page">

            {/* Top Navigation */}
            <div className="asd-topbar">
                <Link to="/admin/students" className="asd-back">
                    ← Students
                </Link>

                <button
                    className="asd-delete"
                    onClick={deleteStudent}
                >
                    Delete Student
                </button>
            </div>

            {/* Page Header */}
            <header className="asd-header">
                <div>
                    <div className="asd-eyebrow">
                        ADMIN • STUDENT DETAILS
                    </div>

                    <h1>{student.name}</h1>

                    <p>
                        Student account and review activity
                    </p>
                </div>

                <span className="asd-role">
                    Student
                </span>
            </header>

            {message && (
                <div className="asd-message">
                    {message}
                </div>
            )}

            {/* Student Identity */}
            <section className="asd-identity-card">

                <div className="asd-avatar">
                    {(student.name || "S")
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div className="asd-identity-main">
                    <h2>{student.name}</h2>
                    <p>{student.email}</p>
                </div>

                <div className="asd-meta">

                    <div>
                        <span>Registered</span>
                        <strong>
                            {formatDate(student.createdAt)}
                        </strong>
                    </div>

                    <div>
                        <span>Last updated</span>
                        <strong>
                            {formatDate(student.updatedAt)}
                        </strong>
                    </div>

                </div>
            </section>

            {/* Statistics */}
            <section className="asd-stats">

                <div className="asd-stat-card">
                    <span>Total Reviews</span>

                    <strong>
                        {reviews.length}
                    </strong>
                </div>

                <div className="asd-stat-card">
                    <span>Average Rating</span>

                    <strong>
                        {Number(
                            data.averageRating || 0
                        ).toFixed(1)}

                        <small> / 5</small>
                    </strong>
                </div>

                <div className="asd-stat-card">
                    <span>Account Role</span>

                    <strong className="asd-stat-role">
                        Student
                    </strong>
                </div>

            </section>

            {/* Reviews */}
            <section className="asd-section">

                <div className="asd-section-head">

                    <div>
                        <h2>Review History</h2>

                        <p>
                            Ratings and feedback submitted by this student.
                        </p>
                    </div>

                    <span>
                        {reviews.length} reviews
                    </span>

                </div>

                {reviews.length === 0 ? (
                    <div className="asd-empty">
                        No reviews submitted by this student yet.
                    </div>
                ) : (

                    <div className="asd-review-grid">

                        {reviews.map((review) => (

                            <article
                                className="asd-review-card"
                                key={review._id}
                            >

                                <div className="asd-review-head">

                                    <div>
                                        <h3>
                                            {review.subject?.name ||
                                                "Subject"}
                                        </h3>

                                        <p>
                                            {review.course?.name ||
                                                "Course"}

                                            {review.class?.name
                                                ? ` • ${review.class.name}`
                                                : ""}
                                        </p>
                                    </div>

                                    <Rating
                                        value={review.overallRating}
                                    />

                                </div>

                                {/* Rating Breakdown */}
                                <div className="asd-rating-grid">

                                    <div>
                                        <span>Teaching</span>
                                        <b>
                                            {review.teachingQuality}/5
                                        </b>
                                    </div>

                                    <div>
                                        <span>Clarity</span>
                                        <b>
                                            {review.conceptClarity}/5
                                        </b>
                                    </div>

                                    <div>
                                        <span>Doubts</span>
                                        <b>
                                            {review.doubtSolving}/5
                                        </b>
                                    </div>

                                    <div>
                                        <span>Material</span>
                                        <b>
                                            {review.studyMaterial}/5
                                        </b>
                                    </div>

                                    <div>
                                        <span>Exam Prep</span>
                                        <b>
                                            {review.examPreparation}/5
                                        </b>
                                    </div>

                                </div>

                                {/* Comment */}
                                {review.comment && (
                                    <p className="asd-comment">
                                        “{review.comment}”
                                    </p>
                                )}

                                <div className="asd-review-footer">
                                    <span>
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>

                            </article>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default AdminStudentDetails;