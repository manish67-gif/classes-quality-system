import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/AdminSubjectDetails.css";
import API from "../config/api";

const AdminSubjectDetails = () => {
    const { classId, courseId, subjectId } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);
    const [subjectName, setSubjectName] = useState("");

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [subjectResponse, reviewsResponse] = await Promise.all([
                fetch(`${API}/subjects/${subjectId}`),
                fetch(`${API}/reviews/subject/${subjectId}`)
            ]);

            const subjectData = await subjectResponse.json();
            const reviewsData = await reviewsResponse.json();

            if (!subjectResponse.ok) {
                throw new Error(
                    subjectData.message || "Failed to load subject"
                );
            }

            if (!reviewsResponse.ok) {
                throw new Error(
                    reviewsData.message || "Failed to load reviews"
                );
            }

            setSubject(subjectData.subject);
            setSubjectName(subjectData.subject.name || "");
            setReviews(reviewsData.reviews || []);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load subject");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [subjectId]);

    const handleUpdateSubject = async (e) => {
        e.preventDefault();

        if (!subjectName.trim()) {
            alert("Subject name is required");
            return;
        }

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: subjectName.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update subject"
                );
            }

            setEditing(false);
            await fetchData();
        } catch (err) {
            alert(err.message || "Failed to update subject");
        }
    };

    const handleDeleteSubject = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this subject? Its demo lectures and reviews will also be deleted."
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete subject"
                );
            }

            navigate(
                `/admin/classes/${classId}/courses/${courseId}`
            );
        } catch (err) {
            alert(err.message || "Failed to delete subject");
        }
    };

    const handleDeleteDemo = async (lectureId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this demo lecture?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}/demos/${lectureId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete demo lecture"
                );
            }

            await fetchData();
        } catch (err) {
            alert(err.message || "Failed to delete demo lecture");
        }
    };

    if (loading) {
        return (
            <div className="admin-subject-page">
                <div className="admin-subject-loading">
                    Loading subject...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-subject-page">
                <div className="admin-subject-error">
                    <h2>Unable to load subject</h2>
                    <p>{error}</p>

                    <Link
                        to={`/admin/classes/${classId}/courses/${courseId}`}
                    >
                        ← Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="admin-subject-page">
                <div className="admin-subject-error">
                    <h2>Subject not found</h2>

                    <Link
                        to={`/admin/classes/${classId}/courses/${courseId}`}
                    >
                        ← Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-subject-page">
            <div className="admin-subject-container">

                {/* BREADCRUMB */}

                <div className="admin-subject-breadcrumb">
                    <Link to="/admin/dashboard">
                        Admin Dashboard
                    </Link>

                    <span>→</span>

                    <Link to={`/admin/classes/${classId}`}>
                        Institute
                    </Link>

                    <span>→</span>

                    <Link
                        to={`/admin/classes/${classId}/courses/${courseId}`}
                    >
                        Course
                    </Link>

                    <span>→</span>

                    <span>Subject</span>
                </div>

                {/* HEADER */}

                <div className="admin-subject-header">
                    <div>
                        <h1>{subject.name}</h1>
                        <p>Subject Management</p>
                    </div>

                    <button
                        className="admin-subject-delete-btn"
                        onClick={handleDeleteSubject}
                    >
                        Delete Subject
                    </button>
                </div>

                {/* SUBJECT INFORMATION */}

                <section className="admin-subject-card">

                    <div className="admin-subject-card-header">
                        <div>
                            <h2>Subject Information</h2>
                            <p>Manage the subject details.</p>
                        </div>

                        {!editing && (
                            <button
                                className="admin-subject-edit-btn"
                                onClick={() => setEditing(true)}
                            >
                                Edit Subject
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <form
                            className="admin-subject-form"
                            onSubmit={handleUpdateSubject}
                        >
                            <div className="admin-subject-form-group">
                                <label>Subject Name</label>

                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={(e) =>
                                        setSubjectName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="admin-subject-form-actions">
                                <button
                                    type="submit"
                                    className="admin-subject-save-btn"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    className="admin-subject-cancel-btn"
                                    onClick={() => {
                                        setEditing(false);
                                        setSubjectName(subject.name);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="admin-subject-info-grid">

                            <div>
                                <span>Subject Name</span>
                                <strong>{subject.name}</strong>
                            </div>

                            <div>
                                <span>Rating</span>
                                <strong>
                                    {subject.rating
                                        ? `${Number(subject.rating).toFixed(1)} / 5`
                                        : "Not rated"}
                                </strong>
                            </div>

                            <div>
                                <span>Demo Lectures</span>
                                <strong>
                                    {subject.demoLectures?.length || 0}
                                </strong>
                            </div>

                            <div>
                                <span>Reviews</span>
                                <strong>{reviews.length}</strong>
                            </div>

                        </div>
                    )}
                </section>

                {/* DEMO LECTURES */}

                <section className="admin-subject-card">

                    <div className="admin-subject-card-header">
                        <div>
                            <h2>Demo Lectures</h2>
                            <p>
                                Manage demo lectures for this subject.
                            </p>
                        </div>

                        <span className="admin-subject-count">
                            {subject.demoLectures?.length || 0}
                        </span>
                    </div>

                    {!subject.demoLectures ||
                        subject.demoLectures.length === 0 ? (
                        <div className="admin-subject-empty">
                            <h3>No demo lectures</h3>
                            <p>
                                No demo lectures have been added to this
                                subject.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-demo-list">

                            {subject.demoLectures.map((lecture) => (
                                <div
                                    className="admin-demo-item"
                                    key={lecture._id}
                                >
                                    <div className="admin-demo-info">
                                        <h3>
                                            {lecture.title ||
                                                "Untitled Demo Lecture"}
                                        </h3>

                                        {lecture.description && (
                                            <p>
                                                {lecture.description}
                                            </p>
                                        )}

                                        {lecture.url && (
                                            <a
                                                href={lecture.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Open Demo Lecture ↗
                                            </a>
                                        )}
                                    </div>

                                    <button
                                        className="admin-demo-delete-btn"
                                        onClick={() =>
                                            handleDeleteDemo(lecture._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}
                </section>

                {/* REVIEWS */}

                <section className="admin-subject-card">

                    <div className="admin-subject-card-header">
                        <div>
                            <h2>Reviews</h2>
                            <p>
                                Reviews submitted by students for this
                                subject.
                            </p>
                        </div>

                        <span className="admin-subject-count">
                            {reviews.length}
                        </span>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="admin-subject-empty">
                            <h3>No reviews</h3>
                            <p>
                                No student reviews have been submitted
                                for this subject.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-review-list">

                            {reviews.map((review) => (
                                <div
                                    className="admin-review-item"
                                    key={review._id}
                                >
                                    <div className="admin-review-header">
                                        <strong>
                                            {review.student?.name ||
                                                "Student"}
                                        </strong>

                                        <span>
                                            Overall:{" "}
                                            {review.overallRating
                                                ? Number(
                                                    review.overallRating
                                                ).toFixed(1)
                                                : "N/A"}{" "}
                                            / 5
                                        </span>
                                    </div>

                                    <div className="admin-review-ratings">
                                        <span>
                                            Teaching:{" "}
                                            {review.teachingQuality}/5
                                        </span>

                                        <span>
                                            Concept Clarity:{" "}
                                            {review.conceptClarity}/5
                                        </span>

                                        <span>
                                            Doubt Solving:{" "}
                                            {review.doubtSolving}/5
                                        </span>

                                        <span>
                                            Exam Preparation:{" "}
                                            {review.examPreparation}/5
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p className="admin-review-comment">
                                            "{review.comment}"
                                        </p>
                                    )}

                                    <small>
                                        {review.createdAt
                                            ? new Date(
                                                review.createdAt
                                            ).toLocaleDateString()
                                            : ""}
                                    </small>
                                </div>
                            ))}

                        </div>
                    )}
                </section>

            </div>
        </div>
    );
};

export default AdminSubjectDetails;