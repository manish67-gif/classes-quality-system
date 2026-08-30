import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {

    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            const profileResponse = await fetch(
                "http://localhost:8080/api/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (profileResponse.ok) {
                const profileData =
                    await profileResponse.json();

                setUser(profileData.user);
            }


            const reviewResponse = await fetch(
                "http://localhost:8080/api/reviews/my-reviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (reviewResponse.ok) {

                const reviewData =
                    await reviewResponse.json();

                setReviews(
                    reviewData.reviews || []
                );
            }

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="message">
                    <h2>Loading dashboard...</h2>
                </div>
            </div>
        );
    }


    const userName = user?.name || "Student";


    return (
        <div className="dashboard-page">

            {/* HERO */}

            <section className="dashboard-welcome">

                <div>
                    <span className="small-title">
                        STUDENT DASHBOARD
                    </span>

                    <h1>
                        Welcome back, {userName} 👋
                    </h1>

                    <p>
                        Manage your profile, explore coaching
                        classes and keep track of your reviews.
                    </p>
                </div>

                <div className="dashboard-avatar">
                    {userName.charAt(0).toUpperCase()}
                </div>

            </section>


            {/* STATS */}

            <section className="dashboard-stats">

                <div className="dashboard-stat-card">
                    <span className="stat-icon">⭐</span>

                    <div>
                        <h3>{reviews.length}</h3>
                        <p>Reviews Submitted</p>
                    </div>
                </div>


                <div className="dashboard-stat-card">
                    <span className="stat-icon">🏫</span>

                    <div>
                        <h3>Explore</h3>
                        <p>Coaching Classes</p>
                    </div>
                </div>


                <div className="dashboard-stat-card">
                    <span className="stat-icon">🎓</span>

                    <div>
                        <h3>Learn</h3>
                        <p>Courses & Subjects</p>
                    </div>
                </div>

            </section>


            {/* QUICK ACTIONS */}

            <section className="dashboard-section">

                <div className="dashboard-section-heading">
                    <h2>Quick Actions</h2>

                    <p>
                        Get where you need to go quickly.
                    </p>
                </div>


                <div className="dashboard-actions">

                    <Link
                        to="/classes"
                        className="dashboard-action-card"
                    >
                        <span>🏫</span>

                        <div>
                            <h3>Explore Classes</h3>

                            <p>
                                Find coaching institutes,
                                courses and subjects.
                            </p>
                        </div>

                        <strong>→</strong>
                    </Link>


                    <Link
                        to="/profile"
                        className="dashboard-action-card"
                    >
                        <span>👤</span>

                        <div>
                            <h3>My Profile</h3>

                            <p>
                                View your account and
                                submitted reviews.
                            </p>
                        </div>

                        <strong>→</strong>
                    </Link>


                    <Link
                        to="/demo-lectures"
                        className="dashboard-action-card"
                    >
                        <span>▶️</span>

                        <div>
                            <h3>Demo Lectures</h3>

                            <p>
                                Watch sample lectures before
                                choosing a class.
                            </p>
                        </div>

                        <strong>→</strong>
                    </Link>


                    <Link
                        to="/compare"
                        className="dashboard-action-card"
                    >
                        <span>📊</span>

                        <div>
                            <h3>Compare Fees</h3>

                            <p>
                                Compare courses and coaching
                                fees easily.
                            </p>
                        </div>

                        <strong>→</strong>
                    </Link>

                </div>

            </section>


            {/* RECENT REVIEWS */}

            <section className="dashboard-section">

                <div className="dashboard-section-heading">

                    <h2>
                        My Recent Reviews
                    </h2>

                    <p>
                        Your latest feedback on coaching subjects.
                    </p>

                </div>


                {reviews.length === 0 ? (

                    <div className="dashboard-empty">

                        <div className="empty-icon">
                            ⭐
                        </div>

                        <h3>
                            No reviews yet
                        </h3>

                        <p>
                            Explore classes and share your
                            experience with other students.
                        </p>

                        <Link
                            to="/classes"
                            className="primary-btn dashboard-btn"
                        >
                            Explore Classes
                        </Link>

                    </div>

                ) : (

                    <div className="dashboard-reviews">

                        {reviews.slice(0, 3).map((review) => (

                            <div
                                className="dashboard-review-card"
                                key={review._id}
                            >

                                <div className="review-card-header">

                                    <h3>
                                        {review.subjectId?.name ||
                                            "Subject"}
                                    </h3>

                                    <span>
                                        ⭐ {review.overallRating}/5
                                    </span>

                                </div>

                                <p>
                                    {review.comment}
                                </p>

                                {review.createdAt && (
                                    <small>
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </small>
                                )}

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default Dashboard;