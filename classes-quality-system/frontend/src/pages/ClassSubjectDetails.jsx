import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ClassSubjectDetails.css";

const API = "http://localhost:8080/api";

function ClassSubjectDetails() {
    const { courseId, subjectId } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [subject, setSubject] = useState(null);
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [showLectureForm, setShowLectureForm] = useState(false);

    const [lectureForm, setLectureForm] = useState({
        title: "",
        duration: "",
        videoUrl: ""
    });

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    // --------------------------------------------------
    // LOAD SUBJECT
    // --------------------------------------------------

    const loadSubject = async () => {
        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load subject"
                );
            }

            setSubject(data.subject);
        } catch (error) {
            console.error("Load subject error:", error);
            setMessage(error.message);
        }
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

            if (response.ok) {
                setCourse(data.course);
            }
        } catch (error) {
            console.error("Load course error:", error);
        }
    };

    // --------------------------------------------------
    // LOAD REVIEWS
    // --------------------------------------------------

    const loadReviews = async () => {
        try {
            const response = await fetch(
                `${API}/reviews/subject/${subjectId}`,
                { headers }
            );

            const data = await response.json();

            if (response.ok) {
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error("Load reviews error:", error);
        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);

            await Promise.all([
                loadSubject(),
                loadCourse(),
                loadReviews()
            ]);

            setLoading(false);
        };

        loadPage();
    }, [subjectId, courseId]);

    // --------------------------------------------------
    // LECTURE FORM
    // --------------------------------------------------

    const handleLectureChange = (event) => {
        const { name, value } = event.target;

        setLectureForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // --------------------------------------------------
    // ADD LECTURE
    // --------------------------------------------------

    const createDemoLecture = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}/demos`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        title: lectureForm.title,
                        duration: lectureForm.duration,
                        videoUrl: lectureForm.videoUrl
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add demo lecture"
                );
            }

            setMessage("Demo lecture added successfully.");

            setLectureForm({
                title: "",
                duration: "",
                videoUrl: ""
            });

            setShowLectureForm(false);

            await loadSubject();
        } catch (error) {
            console.error(
                "Create demo lecture error:",
                error
            );

            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE LECTURE
    // --------------------------------------------------

    const deleteDemoLecture = async (lectureId) => {
        const confirmed = window.confirm(
            "Delete this demo lecture?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}/demos/${lectureId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete demo lecture"
                );
            }

            setMessage(
                "Demo lecture deleted successfully."
            );

            await loadSubject();
        } catch (error) {
            console.error(
                "Delete demo lecture error:",
                error
            );

            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE SUBJECT
    // --------------------------------------------------

    const deleteSubject = async () => {
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
                    data.message ||
                    "Failed to delete subject"
                );
            }

            navigate(
                `/class/courses/${courseId}`
            );
        } catch (error) {
            console.error(
                "Delete subject error:",
                error
            );

            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <main className="class-subject-page">
                <div className="class-subject-loading">
                    <h2>Loading Subject...</h2>
                </div>
            </main>
        );
    }

    if (!subject) {
        return (
            <main className="class-subject-page">
                <div className="class-subject-error">
                    <h2>Subject Not Found</h2>

                    <button
                        type="button"
                        className="subject-primary-button"
                        onClick={() =>
                            navigate(
                                `/class/courses/${courseId}`
                            )
                        }
                    >
                        Back to Course
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="class-subject-page">

            {/* BACK */}

            <button
                type="button"
                className="subject-back-button"
                onClick={() =>
                    navigate(
                        `/class/courses/${courseId}`
                    )
                }
            >
                ← Back to {course?.name || "Course"}
            </button>

            {/* HEADER */}

            <header className="class-subject-header">

                <div>
                    <span className="subject-page-label">
                        SUBJECT MANAGEMENT
                    </span>

                    <h1>{subject.name}</h1>

                    <p>
                        Manage demo lectures and view
                        student reviews.
                    </p>
                </div>

                <button
                    type="button"
                    className="subject-danger-button"
                    onClick={deleteSubject}
                >
                    Delete Subject
                </button>

            </header>

            {/* MESSAGE */}

            {message && (
                <div className="subject-message">
                    {message}
                </div>
            )}

            {/* SUBJECT INFORMATION */}

            <section className="subject-section">

                <div className="subject-section-heading">
                    <span>SUBJECT</span>

                    <h2>Subject Information</h2>
                </div>

                <div className="subject-info-grid">

                    <div>
                        <span>Subject Name</span>
                        <strong>{subject.name}</strong>
                    </div>

                    <div>
                        <span>Rating</span>
                        <strong>
                            ⭐ {subject.rating || 0}
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
                        <strong>
                            {reviews.length}
                        </strong>
                    </div>

                </div>

                <div className="subject-description">
                    <span>Description</span>

                    <p>
                        {subject.description ||
                            "No description available."}
                    </p>
                </div>

            </section>

            {/* DEMO LECTURES */}

            <section className="subject-section">

                <div className="subject-section-header">

                    <div>
                        <span className="subject-section-label">
                            DEMO LECTURES
                        </span>

                        <h2>Demo Lectures</h2>

                        <p>
                            Add video lectures that students
                            can preview.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="subject-primary-button"
                        onClick={() =>
                            setShowLectureForm(
                                (previous) => !previous
                            )
                        }
                    >
                        {showLectureForm
                            ? "Cancel"
                            : "+ Add Demo Lecture"}
                    </button>

                </div>

                {/* ADD LECTURE */}

                {showLectureForm && (
                    <form
                        className="subject-form-card"
                        onSubmit={createDemoLecture}
                    >
                        <h3>Add Demo Lecture</h3>

                        <div className="subject-form-group">
                            <label>
                                Lecture Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={lectureForm.title}
                                onChange={handleLectureChange}
                                placeholder="Enter lecture title"
                                required
                            />
                        </div>

                        <div className="subject-form-group">
                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={lectureForm.duration}
                                onChange={handleLectureChange}
                                placeholder="e.g. 20 min"
                            />
                        </div>

                        <div className="subject-form-group">
                            <label>
                                Video URL
                            </label>

                            <input
                                type="url"
                                name="videoUrl"
                                value={lectureForm.videoUrl}
                                onChange={handleLectureChange}
                                placeholder="YouTube Video URL"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="subject-primary-button"
                        >
                            Add Demo Lecture
                        </button>

                    </form>
                )}

                {/* LECTURE LIST */}

                {!subject.demoLectures ||
                    subject.demoLectures.length === 0 ? (
                    <div className="subject-empty-card">
                        <h3>No Demo Lectures Yet</h3>

                        <p>
                            Add a demo lecture so students
                            can preview this subject.
                        </p>
                    </div>
                ) : (
                    <div className="subject-lecture-list">

                        {subject.demoLectures.map(
                            (lecture) => (
                                <article
                                    className="subject-lecture-card"
                                    key={lecture._id}
                                >
                                    <div>
                                        <span className="subject-card-label">
                                            DEMO LECTURE
                                        </span>

                                        <h3>
                                            {lecture.title}
                                        </h3>

                                        {lecture.duration && (
                                            <p>
                                                Duration:{" "}
                                                {lecture.duration}
                                            </p>
                                        )}

                                        <a
                                            href={
                                                lecture.videoUrl
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Watch Lecture →
                                        </a>
                                    </div>

                                    <button
                                        type="button"
                                        className="subject-danger-button"
                                        onClick={() =>
                                            deleteDemoLecture(
                                                lecture._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </article>
                            )
                        )}

                    </div>
                )}

            </section>

            {/* REVIEWS */}

            <section className="subject-section">

                <div className="subject-section-heading">

                    <span>REVIEWS</span>

                    <h2>Student Reviews</h2>

                    <p>
                        Reviews submitted for this subject.
                    </p>

                </div>

                {reviews.length === 0 ? (
                    <div className="subject-empty-card">
                        <h3>No Reviews Yet</h3>

                        <p>
                            Students have not submitted any
                            reviews for this subject.
                        </p>
                    </div>
                ) : (
                    <div className="subject-review-list">

                        {reviews.map((review) => (
                            <article
                                className="subject-review-card"
                                key={review._id}
                            >
                                <div className="subject-review-header">
                                    <strong>
                                        {review.student?.name ||
                                            review.user?.name ||
                                            "Student"}
                                    </strong>

                                    <span>
                                        Overall: ⭐{" "}
                                        {review.overallRating}
                                    </span>
                                </div>

                                {review.comment && (
                                    <p>
                                        {review.comment}
                                    </p>
                                )}

                                <div className="subject-review-ratings">

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
                                        Study Material:{" "}
                                        {review.studyMaterial}/5
                                    </span>

                                    <span>
                                        Exam Preparation:{" "}
                                        {review.examPreparation}/5
                                    </span>

                                </div>
                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default ClassSubjectDetails;