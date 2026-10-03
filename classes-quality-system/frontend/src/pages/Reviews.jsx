import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

function Reviews() {

    const { subjectId } = useParams();
    const location = useLocation();

    const isMyReviews =
        location.pathname === "/reviews/my-reviews";

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH REVIEWS
    // =========================================

    const fetchReviews = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");


            // =================================
            // MY REVIEWS
            // =================================

            const url = isMyReviews
                ? "http://localhost:8080/api/reviews/my-reviews"
                : `http://localhost:8080/api/reviews/subject/${subjectId}`;


            const response = await fetch(url, {
                headers: isMyReviews
                    ? {
                        Authorization: `Bearer ${token}`
                    }
                    : {}
            });


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch reviews"
                );

            }


            setReviews(
                data.reviews || []
            );


        } catch (error) {

            console.error(
                "Reviews page error:",
                error
            );

            setError(
                error.message ||
                "Failed to load reviews"
            );

        } finally {

            setLoading(false);

        }

    }, [isMyReviews, subjectId]);


    useEffect(() => {

        fetchReviews();

    }, [fetchReviews]);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="message">

                <h1>
                    Loading reviews...
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
                    Reviews
                </h1>

                <p className="error-message">
                    {error}
                </p>

            </div>
        );

    }


    // =========================================
    // NO REVIEWS
    // =========================================

    if (reviews.length === 0) {

        return (
            <div className="details-page">

                <div className="details-header">

                    <div>

                        <span className="details-label">
                            REVIEWS
                        </span>

                        <h1>
                            {isMyReviews
                                ? "My Reviews"
                                : "Student Reviews"}
                        </h1>

                        <p>
                            {isMyReviews
                                ? "You have not submitted any reviews yet."
                                : "No reviews have been submitted for this subject yet."}
                        </p>

                    </div>

                </div>

            </div>
        );

    }


    return (

        <div className="details-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="details-header">

                <div>

                    <span className="details-label">
                        REVIEWS
                    </span>

                    <h1>
                        {isMyReviews
                            ? "My Reviews"
                            : "Student Reviews"}
                    </h1>

                    <p>
                        {isMyReviews
                            ? "All reviews submitted by you."
                            : "See what students think about this subject and course."}
                    </p>

                </div>

            </div>


            {/* =========================================
                REVIEW COUNT
            ========================================= */}

            <div className="details-card">

                <h2>
                    All Reviews
                </h2>

                <p>

                    {reviews.length} review
                    {reviews.length !== 1
                        ? "s"
                        : ""}

                </p>

            </div>


            {/* =========================================
                REVIEWS
            ========================================= */}

            <div className="details-card">

                {reviews.map((review) => {

                    const subject =
                        review.subjectId;

                    const course =
                        subject?.courseId;

                    const classItem =
                        course?.classId;


                    return (

                        <div
                            key={review._id}
                            className="review-card"
                        >


                            {/* =================================
                                SUBJECT / COURSE / INSTITUTE
                            ================================= */}

                            <div className="review-tags">

                                <span className="review-tag">

                                    Subject:{" "}

                                    {subject?.name ||
                                        "Unknown Subject"}

                                </span>


                                <span className="review-tag">

                                    Course:{" "}

                                    {course?.name ||
                                        "Unknown Course"}

                                </span>


                                <span className="review-tag">

                                    Institute:{" "}

                                    {classItem?.name ||
                                        "Unknown Institute"}

                                </span>

                            </div>


                            {/* =================================
                                STUDENT
                            ================================= */}

                            <h3>

                                {review.studentId?.name ||
                                    "Student"}

                            </h3>


                            {/* =================================
                                OVERALL RATING
                            ================================= */}

                            <p className="review-rating">

                                ⭐{" "}

                                {Number(
                                    review.overallRating
                                ).toFixed(1)}

                                /5

                            </p>


                            {/* =================================
                                COMMENT
                            ================================= */}

                            {review.comment && (

                                <p className="review-comment">

                                    {review.comment}

                                </p>

                            )}


                            <hr />


                            {/* =================================
                                CATEGORY RATINGS
                            ================================= */}

                            <p>

                                <strong>
                                    Teaching Quality:
                                </strong>{" "}

                                {review.teachingQuality}/5

                            </p>


                            <p>

                                <strong>
                                    Concept Clarity:
                                </strong>{" "}

                                {review.conceptClarity}/5

                            </p>


                            <p>

                                <strong>
                                    Doubt Solving:
                                </strong>{" "}

                                {review.doubtSolving}/5

                            </p>


                            <p>

                                <strong>
                                    Study Material:
                                </strong>{" "}

                                {review.studyMaterial}/5

                            </p>


                            <p>

                                <strong>
                                    Exam Preparation:
                                </strong>{" "}

                                {review.examPreparation}/5

                            </p>


                            {/* =================================
                                DATE
                            ================================= */}

                            {review.createdAt && (

                                <small className="review-date">

                                    Submitted on{" "}

                                    {new Date(
                                        review.createdAt
                                    ).toLocaleDateString()}

                                </small>

                            )}

                        </div>

                    );

                })}

            </div>


            {/* =========================================
                BACK BUTTON
            ========================================= */}

            {isMyReviews ? (

                <Link
                    to="/profile"
                    className="demo-cta-btn"
                >
                    ← Back to Profile
                </Link>

            ) : (

                <Link
                    to={`/subjects/${subjectId}`}
                    className="demo-cta-btn"
                >
                    ← Back to Subject
                </Link>

            )}

        </div>

    );

}

export default Reviews;