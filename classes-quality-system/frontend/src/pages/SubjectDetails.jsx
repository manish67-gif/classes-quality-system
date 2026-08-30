import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";

function SubjectDetails() {

    const { id } = useParams();

    const [subject, setSubject] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubjectDetails = async () => {

        try {

            setLoading(true);
            setError("");

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


    useEffect(() => {

        fetchSubjectDetails();

    }, [id]);


    const calculateAverage = (field) => {

        if (reviews.length === 0) {
            return "0.0";
        }

        const total = reviews.reduce(
            (sum, review) => {
                return sum + Number(review[field] || 0);
            },
            0
        );

        return (
            total / reviews.length
        ).toFixed(1);
    };


    if (loading) {

        return (
            <div className="message">
                <h1>Loading subject...</h1>
            </div>
        );
    }


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

            <div className="details-header">

                <div>
                    <h1>
                        {subject.name}
                    </h1>

                    <p>
                        {subject.description}
                    </p>
                </div>

            </div>


            <div className="details-card">

                <h2>
                    Ratings
                </h2>

                {reviews.length === 0 ? (

                    <p className="empty-state">
                        No reviews yet.
                    </p>

                ) : (

                    <div>

                        <div className="rating-box">
                            <h3>Overall Rating</h3>

                            <p className="big-rating">
                                ⭐ {calculateAverage("overallRating")} / 5
                            </p>

                            <p className="rating-count">
                                Based on {reviews.length} review
                                {reviews.length !== 1 ? "s" : ""}
                            </p>
                        </div>


                        <div className="rating-box">
                            <h3>Teaching Quality</h3>

                            <p>
                                ⭐ {calculateAverage("teachingQuality")} / 5
                            </p>
                        </div>


                        <div className="rating-box">
                            <h3>Concept Clarity</h3>

                            <p>
                                ⭐ {calculateAverage("conceptClarity")} / 5
                            </p>
                        </div>


                        <div className="rating-box">
                            <h3>Doubt Solving</h3>

                            <p>
                                ⭐ {calculateAverage("doubtSolving")} / 5
                            </p>
                        </div>


                        <div className="rating-box">
                            <h3>Study Material</h3>

                            <p>
                                ⭐ {calculateAverage("studyMaterial")} / 5
                            </p>
                        </div>

                    </div>
                )}

            </div>


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

                                <h3>
                                    {review.studentId?.name ||
                                        "Student"}
                                </h3>


                                <p className="review-rating">

                                    ⭐ {review.overallRating}/5

                                </p>


                                <p className="review-comment">

                                    {review.comment}

                                </p>


                                <hr />


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


            <div className="details-card">

                {localStorage.getItem("token") ? (
                    <ReviewForm
                        subjectId={id}
                        onReviewSubmitted={fetchSubjectDetails}
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