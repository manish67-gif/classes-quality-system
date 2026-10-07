import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ClassCourseDetails.css";
import API from "../config/api";

function ClassCourseDetails() {
    const { classId, courseId } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [showSubjectForm, setShowSubjectForm] = useState(false);

    const [subjectForm, setSubjectForm] = useState({
        name: "",
        description: ""
    });

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    // --------------------------------------------------
    // LOAD COURSE
    // --------------------------------------------------

    const loadCourse = async () => {
        try {
            const response = await fetch(
                `${API}/courses/${courseId}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load course"
                );
            }

            setCourse(data.course);
        } catch (error) {
            console.error("Load course error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOAD SUBJECTS
    // --------------------------------------------------

    const loadSubjects = async () => {
        try {
            const response = await fetch(
                `${API}/subjects/course/${courseId}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load subjects"
                );
            }

            setSubjects(data.subjects || []);
        } catch (error) {
            console.error("Load subjects error:", error);
            setMessage(error.message);
        }
    };

    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);

            await loadCourse();
            await loadSubjects();

            setLoading(false);
        };

        loadPage();
    }, [courseId]);

    // --------------------------------------------------
    // SUBJECT FORM
    // --------------------------------------------------

    const handleSubjectChange = (event) => {
        const { name, value } = event.target;

        setSubjectForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const createSubject = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${API}/subjects`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    courseId,
                    name: subjectForm.name,
                    description: subjectForm.description
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create subject"
                );
            }

            setMessage("Subject added successfully.");

            setSubjectForm({
                name: "",
                description: ""
            });

            setShowSubjectForm(false);

            // Redirect to the newly created subject
            navigate(
                `/class/classes/${classId}/courses/${courseId}/subjects/${data.subject._id}`
            );

        } catch (error) {
            console.error("Create subject error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE SUBJECT
    // --------------------------------------------------

    const deleteSubject = async (subjectId) => {
        const confirmed = window.confirm(
            "Delete this subject and its reviews/demo lectures?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete subject"
                );
            }

            setMessage("Subject deleted successfully.");

            await loadSubjects();
        } catch (error) {
            console.error("Delete subject error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE COURSE
    // --------------------------------------------------

    const deleteCourse = async () => {
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

            navigate("/class/dashboard");
        } catch (error) {
            console.error("Delete course error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <main className="class-course-page">
                <div className="class-course-loading">
                    <h2>Loading Course...</h2>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="class-course-page">
                <div className="class-course-error">
                    <h2>Course Not Found</h2>

                    <button
                        type="button"
                        className="course-primary-button"
                        onClick={() =>
                            navigate("/class/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="class-course-page">

            {/* BACK */}

            <button
                type="button"
                className="course-back-button"
                onClick={() => navigate("/class/dashboard")}
            >
                ← Back to Dashboard
            </button>

            {/* HEADER */}

            <header className="class-course-header">

                <div>
                    <span className="course-page-label">
                        COURSE MANAGEMENT
                    </span>

                    <h1>{course.name}</h1>

                    <p>
                        Manage this course and its subjects.
                    </p>
                </div>

                <button
                    type="button"
                    className="course-danger-button"
                    onClick={deleteCourse}
                >
                    Delete Course
                </button>

            </header>

            {/* MESSAGE */}

            {message && (
                <div className="course-message">
                    {message}
                </div>
            )}

            {/* COURSE INFORMATION */}

            <section className="course-section">

                <div className="course-section-heading">
                    <span>COURSE</span>
                    <h2>Course Information</h2>
                </div>

                <div className="course-info-grid">

                    <div>
                        <span>Course Name</span>
                        <strong>{course.name}</strong>
                    </div>

                    <div>
                        <span>Fees</span>
                        <strong>₹{course.fees}</strong>
                    </div>

                    <div>
                        <span>Duration</span>
                        <strong>{course.duration}</strong>
                    </div>

                    {course.rating !== undefined &&
                        course.rating !== null && (
                            <div>
                                <span>Rating</span>
                                <strong>
                                    ⭐ {course.rating}
                                </strong>
                            </div>
                        )}

                </div>

                <div className="course-description">
                    <span>Description</span>

                    <p>
                        {course.description ||
                            "No description available."}
                    </p>
                </div>

            </section>

            {/* SUBJECTS */}

            <section className="course-section">

                <div className="course-section-header">

                    <div>
                        <span className="course-section-label">
                            SUBJECTS
                        </span>

                        <h2>Subjects</h2>

                        <p>
                            Manage subjects under this course.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="course-primary-button"
                        onClick={() =>
                            setShowSubjectForm(
                                (previous) => !previous
                            )
                        }
                    >
                        {showSubjectForm
                            ? "Cancel"
                            : "+ Add Subject"}
                    </button>

                </div>

                {/* ADD SUBJECT */}

                {showSubjectForm && (
                    <form
                        className="course-form-card"
                        onSubmit={createSubject}
                    >
                        <h3>Add Subject</h3>

                        <div className="course-form-group">
                            <label>
                                Subject Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={subjectForm.name}
                                onChange={handleSubjectChange}
                                placeholder="Enter subject name"
                                required
                            />
                        </div>

                        <div className="course-form-group">
                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={subjectForm.description}
                                onChange={handleSubjectChange}
                                placeholder="Enter subject description"
                                rows="4"
                            />
                        </div>

                        <button
                            type="submit"
                            className="course-primary-button"
                        >
                            Add Subject
                        </button>

                    </form>
                )}

                {/* SUBJECT LIST */}

                {subjects.length === 0 ? (
                    <div className="course-empty-card">
                        <h3>No Subjects Yet</h3>

                        <p>
                            Add subjects to this course.
                        </p>
                    </div>
                ) : (
                    <div className="course-subject-list">

                        {subjects.map((subject) => (
                            <article
                                className="course-subject-card"
                                key={subject._id}
                            >
                                <div>
                                    <span className="course-card-label">
                                        SUBJECT
                                    </span>

                                    <h3>{subject.name}</h3>

                                    <p>
                                        {subject.description ||
                                            "No description available."}
                                    </p>

                                    <div className="course-subject-meta">
                                        <span>
                                            Rating: ⭐{" "}
                                            {subject.rating || 0}
                                        </span>

                                        <span>
                                            Demo Lectures:{" "}
                                            {subject.demoLectures
                                                ?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="course-card-actions">

                                    <button
                                        type="button"
                                        className="course-primary-button"
                                        onClick={() =>
                                            navigate(
                                                `/class/classes/${classId}/courses/${courseId}/subjects/${subject._id}`
                                            )
                                        }
                                    >
                                        Manage Subject
                                    </button>

                                    <button
                                        type="button"
                                        className="course-danger-button"
                                        onClick={() =>
                                            deleteSubject(
                                                subject._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default ClassCourseDetails;