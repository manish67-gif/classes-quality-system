import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";

function SubjectDetails() {

    const { id } = useParams();

    const [subject, setSubject] = useState(null);
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH SUBJECT + REVIEWS
    // =========================================

    const fetchSubjectDetails = async () => {

        try {

            setLoading(true);
            setError("");

            // =========================================
            // FETCH SUBJECT
            // =========================================

            const subjectResponse = await fetch(
                `http://localhost:8080/api/subjects/${id}`
            );

            const subjectData =
                await subjectResponse.json();

            console.log("SUBJECT:", subjectData);

            if (!subjectResponse.ok) {

                throw new Error(
                    subjectData.message ||
                    "Failed to fetch subject"
                );

            }

            setSubject(subjectData.subject);

            const courseResponse = await fetch(
                `http://localhost:8080/api/courses/${subjectData.subject.courseId}`
            );

            const courseData = await courseResponse.json();

            if (!courseResponse.ok) {
                throw new Error(
                    courseData.message ||
                    "Failed to fetch course"
                );
            }

            setCourse(courseData.course);


            // =========================================
            // FETCH REVIEWS
            // =========================================

            const reviewResponse = await fetch(
                `http://localhost:8080/api/reviews/subject/${id}`
            );

            const reviewData =
                await reviewResponse.json();

            console.log("REVIEWS:", reviewData);

            if (!reviewResponse.ok) {

                throw new Error(
                    reviewData.message ||
                    "Failed to fetch reviews"
                );

            }

            setReviews(
                reviewData.reviews || []
            );

        } catch (error) {

            console.error(
                "Subject details error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        fetchSubjectDetails();

    }, [id]);


    // =========================================
    // CALCULATE AVERAGE RATING
    // =========================================

    const calculateAverage = (field) => {

        if (reviews.length === 0) {
            return "0.0";
        }

        const total = reviews.reduce(
            (sum, review) => {

                return sum +
                    Number(review[field] || 0);

            },
            0
        );

        return (
            total / reviews.length
        ).toFixed(1);

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="message">

                <h1>
                    Loading subject...
                </h1>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="details-page">

                <h1>
                    Error
                </h1>

                <p className="error-message">
                    {error}
                </p>

            </div>

        );

    }


    // =========================================
    // SUBJECT NOT FOUND
    // =========================================

    if (!subject) {

        return (

            <div className="message">

                <h1>
                    Subject not found
                </h1>

            </div>

        );

    }


    return (

        <div className="details-page">


            {/* =========================================
                SUBJECT HEADER
            ========================================= */}

            <div className="details-header">

                <div>

                    <span className="details-label">
                        SUBJECT
                    </span>

                    <h1>
                        {subject.name}
                    </h1>

                    <p>
                        {subject.description ||
                            "Explore this subject and its learning resources."}
                    </p>

                </div>

            </div>


            {/* =========================================
                DEMO LECTURE CTA
            ========================================= */}

            {course && (

                <div className="demo-lectures-cta">

                    {/* LEFT SIDE */}

                    <div className="demo-cta-left">

                        <div className="demo-cta-icon">
                            ▶
                        </div>


                        <div className="demo-cta-content">

                            <span className="demo-cta-label">
                                FREE DEMO
                            </span>

                            <h3>
                                Try {subject.name} Demo Lectures
                            </h3>

                            <p>
                                Explore sample lectures for this subject.
                            </p>

                        </div>

                    </div>


                    {/* BUTTON */}

                    <Link
                        to={`/classes/${course.classId}/courses/${subject.courseId}/subjects/${id}/demos`}
                        className="demo-cta-btn"
                    >
                        Watch Demo
                        <span>→</span>
                    </Link>

                </div>

            )}


            {/* =========================================
                COMPACT RATINGS
            ========================================= */}

            <div className="details-card compact-ratings-card">

                <div className="ratings-header">

                    <div>

                        <h2>
                            Ratings
                        </h2>

                        <p>
                            Student feedback
                        </p>

                    </div>


                    {/* OVERALL RATING */}

                    {reviews.length > 0 && (

                        <div className="overall-rating-mini">

                            <span>
                                ⭐
                            </span>

                            <strong>
                                {calculateAverage(
                                    "overallRating"
                                )}
                            </strong>

                            <small>
                                / 5
                            </small>

                        </div>

                    )}

                </div>


                {/* =========================================
                    NO REVIEWS
                ========================================= */}

                {reviews.length === 0 ? (

                    <p className="no-rating-text">
                        No reviews yet.
                    </p>

                ) : (

                    <div className="rating-mini-grid">


                        {/* TEACHING QUALITY */}

                        <div className="rating-mini-item">

                            <span>
                                Teaching
                            </span>

                            <strong>
                                ⭐{" "}
                                {calculateAverage(
                                    "teachingQuality"
                                )}
                            </strong>

                        </div>


                        {/* CONCEPT CLARITY */}

                        <div className="rating-mini-item">

                            <span>
                                Concept Clarity
                            </span>

                            <strong>
                                ⭐{" "}
                                {calculateAverage(
                                    "conceptClarity"
                                )}
                            </strong>

                        </div>


                        {/* DOUBT SOLVING */}

                        <div className="rating-mini-item">

                            <span>
                                Doubt Solving
                            </span>

                            <strong>
                                ⭐{" "}
                                {calculateAverage(
                                    "doubtSolving"
                                )}
                            </strong>

                        </div>


                        {/* STUDY MATERIAL */}

                        <div className="rating-mini-item">

                            <span>
                                Study Material
                            </span>

                            <strong>
                                ⭐{" "}
                                {calculateAverage(
                                    "studyMaterial"
                                )}
                            </strong>

                        </div>

                    </div>

                )}

            </div>


            {/* =========================================
                STUDENT REVIEWS
            ========================================= */}

            <div className="details-card">

                <h2>
                    Student Reviews
                </h2>


                {reviews.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No reviews have been submitted
                            for this subject yet.
                        </p>

                    </div>

                ) : (

                    <div>

                        {reviews.map((review) => (

                            <div
                                key={review._id}
                                className="review-card"
                            >

                                {/* STUDENT NAME */}

                                <h3>
                                    {review.studentId?.name ||
                                        "Student"}
                                </h3>


                                {/* OVERALL RATING */}

                                <p className="review-rating">

                                    ⭐{" "}
                                    {review.overallRating}
                                    /5

                                </p>


                                {/* COMMENT */}

                                {review.comment && (

                                    <p className="review-comment">

                                        {review.comment}

                                    </p>

                                )}


                                <hr />


                                {/* TEACHING QUALITY */}

                                <p>

                                    <strong>
                                        Teaching Quality:
                                    </strong>{" "}

                                    {review.teachingQuality}
                                    /5

                                </p>


                                {/* CONCEPT CLARITY */}

                                <p>

                                    <strong>
                                        Concept Clarity:
                                    </strong>{" "}

                                    {review.conceptClarity}
                                    /5

                                </p>


                                {/* DOUBT SOLVING */}

                                <p>

                                    <strong>
                                        Doubt Solving:
                                    </strong>{" "}

                                    {review.doubtSolving}
                                    /5

                                </p>


                                {/* STUDY MATERIAL */}

                                <p>

                                    <strong>
                                        Study Material:
                                    </strong>{" "}

                                    {review.studyMaterial}
                                    /5

                                </p>


                                {/* DATE */}

                                {review.createdAt && (

                                    <small className="review-date">

                                        Submitted on{" "}

                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}

                                    </small>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =========================================
                REVIEW FORM
            ========================================= */}

            <div className="details-card">

                {localStorage.getItem("token") ? (

                    <ReviewForm
                        subjectId={id}
                        onReviewSubmitted={
                            fetchSubjectDetails
                        }
                    />

                ) : (

                    <p>
                        Please login to submit a review.
                    </p>

                )}

            </div>


        </div>

    );

}

export default SubjectDetails;