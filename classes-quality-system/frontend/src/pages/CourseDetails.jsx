import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CourseDetails() {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            setError("");

            // GET COURSE
            const courseResponse = await fetch(
                `http://localhost:8080/api/courses/${id}`
            );

            const courseResult = await courseResponse.json();

            if (!courseResponse.ok) {
                throw new Error(
                    courseResult.message || "Failed to fetch course"
                );
            }

            setCourse(courseResult.course);

            // GET SUBJECTS
            const subjectResponse = await fetch(
                `http://localhost:8080/api/subjects/course/${id}`
            );

            const subjectResult = await subjectResponse.json();

            if (!subjectResponse.ok) {
                throw new Error(
                    subjectResult.message || "Failed to fetch subjects"
                );
            }

            setSubjects(subjectResult.subjects || []);
        } catch (error) {
            console.error("Course details error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="details-page">
                <h1>Loading...</h1>
            </div>
        );
    }

    // ERROR
    if (error) {
        return (
            <div className="details-page">
                <h1>Error</h1>

                <p className="error-message">
                    {error}
                </p>
            </div>
        );
    }

    // COURSE NOT FOUND
    if (!course) {
        return (
            <div className="details-page">
                <h1>Course not found</h1>
            </div>
        );
    }

    // RATING
    const courseRating =
        course.rating !== undefined &&
            course.rating !== null &&
            course.rating !== ""
            ? Number(course.rating)
            : null;

    return (
        <div className="details-page">

            {/* BACK */}
            <Link
                to="/classes"
                className="back-link"
            >
                ← Back to Classes
            </Link>

            {/* COURSE HEADER */}
            <div className="details-header">
                <div>

                    <h1>
                        {course.name}
                    </h1>

                    <p>
                        {course.description ||
                            "Explore this course and its subjects."}
                    </p>

                    {/* COURSE RATING */}
                    {courseRating !== null && (
                        <div className="course-rating-details">

                            <span className="rating-star">
                                ⭐
                            </span>

                            <strong>
                                {courseRating.toFixed(1)}
                            </strong>

                            <span>
                                / 5
                            </span>

                        </div>
                    )}

                </div>
            </div>

            {/* COURSE INFORMATION */}
            <div className="details-card course-info">

                {/* DURATION */}
                <div className="course-info-item">

                    <span>
                        Duration
                    </span>

                    <strong>
                        {course.duration || "N/A"}
                    </strong>

                </div>

                {/* FEES */}
                <div className="course-info-item">

                    <span>
                        Fees
                    </span>

                    <strong>
                        {course.fees !== undefined &&
                            course.fees !== null
                            ? `₹${Number(course.fees).toLocaleString("en-IN")}`
                            : "N/A"}
                    </strong>

                </div>

                {/* RATING */}
                <div className="course-info-item">

                    <span>
                        Rating
                    </span>

                    <strong className="rating-value">

                        {courseRating !== null
                            ? `⭐ ${courseRating.toFixed(1)} / 5`
                            : "Not rated"}

                    </strong>

                </div>

            </div>

            {/* SUBJECTS */}
            <div className="details-card">

                <div className="subjects-heading">

                    <div>

                        <h2>
                            Subjects
                        </h2>

                        <p>
                            Explore subjects included in this course.
                        </p>

                    </div>

                    <span className="subject-count">

                        {subjects.length}{" "}

                        {subjects.length === 1
                            ? "Subject"
                            : "Subjects"}

                    </span>

                </div>

                {/* NO SUBJECTS */}
                {subjects.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No subjects available for this course.
                        </p>

                    </div>

                ) : (

                    <div className="subject-cards">

                        {subjects.map((subject) => {

                            const subjectRating =
                                subject.rating !== undefined &&
                                    subject.rating !== null &&
                                    subject.rating !== ""
                                    ? Number(subject.rating)
                                    : null;

                            return (
                                <div
                                    className="subject-card"
                                    key={subject._id}
                                >

                                    {/* SUBJECT HEADER */}
                                    <div className="subject-card-top">

                                        <h3>
                                            {subject.name}
                                        </h3>

                                        {/* SUBJECT RATING */}
                                        {subjectRating !== null ? (

                                            <div className="subject-rating">

                                                <span>
                                                    ⭐
                                                </span>

                                                <strong>
                                                    {subjectRating.toFixed(1)}
                                                </strong>

                                            </div>

                                        ) : (

                                            <div className="subject-rating not-rated">
                                                Not rated
                                            </div>

                                        )}

                                    </div>

                                    {/* DESCRIPTION */}
                                    <p>
                                        {subject.description ||
                                            "Explore this subject and its learning resources."}
                                    </p>

                                    {/* VIEW SUBJECT */}
                                    <Link
                                        to={`/subjects/${subject._id}`}
                                    >
                                        <button
                                            className="view-btn"
                                            type="button"
                                        >
                                            View Subject
                                        </button>
                                    </Link>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
}

export default CourseDetails;