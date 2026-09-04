import { useState } from "react";

function ReviewForm({ subjectId, onReviewSubmitted }) {
    const [formData, setFormData] = useState({
        teachingQuality: 5,
        conceptClarity: 5,
        doubtSolving: 5,
        studyMaterial: 5,
        overallRating: 5,
        comment: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "comment" ? value : Number(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login before submitting a review.");
            return;
        }

        if (!subjectId) {
            setError("Subject information is missing.");
            return;
        }

        if (!formData.comment.trim()) {
            setError("Please write a comment.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/reviews",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        subjectId,
                        teachingQuality: formData.teachingQuality,
                        conceptClarity: formData.conceptClarity,
                        doubtSolving: formData.doubtSolving,
                        studyMaterial: formData.studyMaterial,
                        overallRating: formData.overallRating,
                        comment: formData.comment.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.dispatchEvent(new Event("authChanged"));

                    throw new Error(
                        "Your session has expired. Please login again."
                    );
                }

                throw new Error(
                    data.message || "Failed to submit review"
                );
            }

            setMessage("Review submitted successfully!");

            setFormData({
                teachingQuality: 5,
                conceptClarity: 5,
                doubtSolving: 5,
                studyMaterial: 5,
                overallRating: 5,
                comment: ""
            });

            if (onReviewSubmitted) {
                onReviewSubmitted(data.review);
            }
        } catch (error) {
            console.error("Review submission error:", error);
            setError(error.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form-card">

            <div className="review-form-header">
                <span className="details-label">
                    SHARE YOUR EXPERIENCE
                </span>

                <h2>
                    Write a Review
                </h2>

                <p>
                    Help other students choose the right
                    coaching class by sharing your experience.
                </p>
            </div>

            {message && (
                <p className="review-success">
                    ✓ {message}
                </p>
            )}

            {error && (
                <p className="review-error">
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="review-form"
            >
                <div className="rating-fields">

                    <div className="rating-field">
                        <label>
                            Teaching Quality
                        </label>

                        <select
                            name="teachingQuality"
                            value={formData.teachingQuality}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="1">1 - Poor</option>
                            <option value="2">2</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <div className="rating-field">
                        <label>
                            Concept Clarity
                        </label>

                        <select
                            name="conceptClarity"
                            value={formData.conceptClarity}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="1">1 - Poor</option>
                            <option value="2">2</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <div className="rating-field">
                        <label>
                            Doubt Solving
                        </label>

                        <select
                            name="doubtSolving"
                            value={formData.doubtSolving}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="1">1 - Poor</option>
                            <option value="2">2</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <div className="rating-field">
                        <label>
                            Study Material
                        </label>

                        <select
                            name="studyMaterial"
                            value={formData.studyMaterial}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="1">1 - Poor</option>
                            <option value="2">2</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <div className="rating-field overall-rating-field">
                        <label>
                            Overall Rating
                        </label>

                        <select
                            name="overallRating"
                            value={formData.overallRating}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="1">1 - Poor</option>
                            <option value="2">2</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                </div>

                <div className="comment-field">
                    <label>
                        Your Experience
                    </label>

                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Describe your experience..."
                        rows="5"
                        maxLength="2000"
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="review-submit-btn"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Submit Review →"}
                </button>

            </form>
        </div>
    );
}

export default ReviewForm;