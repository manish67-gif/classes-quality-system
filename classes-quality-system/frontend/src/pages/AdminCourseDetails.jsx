import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/AdminCourseDetails.css";
import API from "../config/api";

const AdminCourseDetails = () => {
    const { classId, courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        fees: "",
        duration: ""
    });

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [courseResponse, subjectsResponse] = await Promise.all([
                fetch(`${API}/courses/${courseId}`),
                fetch(`${API}/subjects/course/${courseId}`)
            ]);

            const courseData = await courseResponse.json();
            const subjectsData = await subjectsResponse.json();

            if (!courseResponse.ok) {
                throw new Error(courseData.message || "Failed to load course");
            }

            if (!subjectsResponse.ok) {
                throw new Error(
                    subjectsData.message || "Failed to load subjects"
                );
            }

            setCourse(courseData.course);
            setSubjects(subjectsData.subjects || []);

            setFormData({
                name: courseData.course.name || "",
                fees: courseData.course.fees ?? "",
                duration: courseData.course.duration || ""
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API}/courses/${courseId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        fees: Number(formData.fees),
                        duration: formData.duration
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update course");
            }

            setCourse(data.course || data);
            setEditing(false);

            await fetchData();
        } catch (err) {
            alert(err.message || "Failed to update course");
        }
    };

    const handleDeleteCourse = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course? Its subjects and reviews will also be deleted."
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API}/courses/${courseId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete course");
            }

            navigate(`/admin/classes/${classId}`);
        } catch (err) {
            alert(err.message || "Failed to delete course");
        }
    };

    if (loading) {
        return (
            <div className="admin-course-page">
                <div className="admin-course-loading">
                    Loading course...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-course-page">
                <div className="admin-course-error">
                    <h2>Unable to load course</h2>
                    <p>{error}</p>

                    <Link to={`/admin/classes/${classId}`}>
                        ← Back to Institute
                    </Link>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="admin-course-page">
                <div className="admin-course-error">
                    <h2>Course not found</h2>

                    <Link to={`/admin/classes/${classId}`}>
                        ← Back to Institute
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-course-page">
            <div className="admin-course-container">

                <div className="admin-course-breadcrumb">
                    <Link to="/admin/dashboard">
                        Admin Dashboard
                    </Link>

                    <span>→</span>

                    <Link to={`/admin/classes/${classId}`}>
                        Institute
                    </Link>

                    <span>→</span>

                    <span>Course</span>
                </div>

                <div className="admin-course-header">
                    <div>
                        <h1>{course.name}</h1>
                        <p>Course Management</p>
                    </div>

                    <button
                        className="admin-delete-btn"
                        onClick={handleDeleteCourse}
                    >
                        Delete Course
                    </button>
                </div>

                {/* COURSE INFORMATION */}

                <section className="admin-course-card">

                    <div className="admin-course-card-header">
                        <div>
                            <h2>Course Information</h2>
                            <p>Manage course details and fees.</p>
                        </div>

                        {!editing && (
                            <button
                                className="admin-edit-btn"
                                onClick={() => setEditing(true)}
                            >
                                Edit Course
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <form
                            className="admin-course-form"
                            onSubmit={handleUpdate}
                        >
                            <div className="admin-form-group">
                                <label>Course Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Fees</label>

                                <input
                                    type="number"
                                    name="fees"
                                    value={formData.fees}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Duration</label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="admin-form-actions">
                                <button
                                    type="submit"
                                    className="admin-save-btn"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    className="admin-cancel-btn"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="admin-course-info-grid">

                            <div>
                                <span>Course Name</span>
                                <strong>{course.name}</strong>
                            </div>

                            <div>
                                <span>Fees</span>
                                <strong>
                                    ₹{Number(course.fees || 0).toLocaleString()}
                                </strong>
                            </div>

                            <div>
                                <span>Duration</span>
                                <strong>
                                    {course.duration || "Not specified"}
                                </strong>
                            </div>

                            <div>
                                <span>Rating</span>
                                <strong>
                                    {course.rating
                                        ? `${Number(course.rating).toFixed(1)} / 5`
                                        : "Not rated"}
                                </strong>
                            </div>

                        </div>
                    )}
                </section>

                {/* SUBJECTS */}

                <section className="admin-course-card">

                    <div className="admin-course-card-header">
                        <div>
                            <h2>Subjects</h2>
                            <p>
                                Manage subjects, demo lectures and reviews.
                            </p>
                        </div>

                        <span className="admin-count-badge">
                            {subjects.length}
                        </span>
                    </div>

                    {subjects.length === 0 ? (
                        <div className="admin-empty-state">
                            <h3>No subjects found</h3>
                            <p>
                                This course does not have any subjects yet.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-subject-list">

                            {subjects.map((subject) => (
                                <div
                                    className="admin-subject-item"
                                    key={subject._id}
                                >
                                    <div className="admin-subject-info">
                                        <h3>{subject.name}</h3>

                                        <div className="admin-subject-meta">
                                            <span>
                                                Rating:{" "}
                                                {subject.rating
                                                    ? `${Number(
                                                        subject.rating
                                                    ).toFixed(1)} / 5`
                                                    : "Not rated"}
                                            </span>

                                            <span>
                                                Demos:{" "}
                                                {subject.demoLectures?.length ||
                                                    0}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/admin/classes/${classId}/courses/${courseId}/subjects/${subject._id}`}
                                        className="admin-view-btn"
                                    >
                                        Manage Subject →
                                    </Link>
                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </div>
    );
};

export default AdminCourseDetails;