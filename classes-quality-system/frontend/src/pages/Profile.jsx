import { useEffect, useState } from "react";

function Profile() {

    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");


            if (!token) {
                setError(
                    "Please login to view your profile."
                );

                setLoading(false);
                return;
            }


            // =========================
            // GET PROFILE
            // =========================

            const response = await fetch(
                "http://localhost:8080/api/users/profile",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Profile API error:",
                    response.status,
                    errorText
                );

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    throw new Error(
                        "Your login session has expired. Please login again."
                    );
                }

                throw new Error(
                    `Profile request failed (${response.status})`
                );
            }


            const contentType =
                response.headers.get("content-type");


            if (
                !contentType ||
                !contentType.includes("application/json")
            ) {

                const text =
                    await response.text();

                console.error(
                    "Profile returned non-JSON:",
                    text
                );

                throw new Error(
                    "Profile API returned an invalid response."
                );
            }


            const data =
                await response.json();


            console.log(
                "PROFILE RESPONSE:",
                data
            );


            setUser(data.user);


            // =========================
            // GET MY REVIEWS
            // =========================

            const reviewResponse =
                await fetch(
                    "http://localhost:8080/api/reviews/my-reviews",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            if (!reviewResponse.ok) {

                const reviewError =
                    await reviewResponse.text();

                console.error(
                    "My reviews API error:",
                    reviewResponse.status,
                    reviewError
                );

                setReviews([]);

            } else {

                const reviewContentType =
                    reviewResponse.headers.get(
                        "content-type"
                    );


                if (
                    reviewContentType &&
                    reviewContentType.includes(
                        "application/json"
                    )
                ) {

                    const reviewData =
                        await reviewResponse.json();


                    console.log(
                        "MY REVIEWS RESPONSE:",
                        reviewData
                    );


                    setReviews(
                        reviewData.reviews || []
                    );

                } else {

                    console.error(
                        "My reviews API did not return JSON"
                    );

                    setReviews([]);
                }
            }


        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            setError(
                error.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="message">

                <h1>
                    Loading profile...
                </h1>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="profile-page">

                <h1>
                    Profile
                </h1>

                <p className="error-message">
                    {error}
                </p>

            </div>
        );
    }


    return (

        <div className="profile-page">

            {/* =========================
                PROFILE
            ========================= */}

            <h1>
                My Profile
            </h1>


            {user && (

                <div className="profile-card">

                    <div className="avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <h2>
                        {user.name}
                    </h2>


                    <p>
                        <strong>
                            Email:
                        </strong>{" "}
                        {user.email}
                    </p>


                    <p>
                        <strong>
                            Role:
                        </strong>{" "}
                        {user.role}
                    </p>


                    {user.createdAt && (

                        <p>
                            <strong>
                                Member since:
                            </strong>{" "}

                            {new Date(
                                user.createdAt
                            ).toLocaleDateString()}

                        </p>

                    )}

                </div>

            )}


            <hr />


            {/* =========================
                MY REVIEWS
            ========================= */}

            <h2>
                My Reviews
            </h2>


            {reviews.length === 0 ? (

                <div className="empty-state">

                    <p>
                        You have not submitted
                        any reviews yet.
                    </p>

                </div>

            ) : (

                <div>

                    {reviews.map((review) => (

                        <div
                            key={review._id}
                            className="profile-review-card"
                        >

                            <h3>
                                {review.subjectId?.name ||
                                    "Subject"}
                            </h3>


                            <p className="profile-review-rating">

                                ⭐{" "}
                                {review.overallRating}/5

                            </p>


                            <p className="profile-review-comment">
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
    );
}

export default Profile;