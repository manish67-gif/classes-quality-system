import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* HERO */}
            <section className="home-hero">

                <div className="home-hero-content">

                    <span className="hero-badge">
                        🎓 Smart Coaching Search
                    </span>

                    <h1>
                        Find the
                        <span> Right Coaching Class </span>
                        for Your Future
                    </h1>

                    <p>
                        Compare coaching classes, courses, fees,
                        teaching quality and student reviews —
                        all in one place.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/classes"
                            className="primary-btn hero-btn"
                        >
                            Explore Classes →
                        </Link>

                        <Link
                            to="/classes"
                            className="secondary-btn"
                        >
                            Compare Classes
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="hero-card main-stat-card">
                        <div className="stat-icon">🏫</div>
                        <div>
                            <strong>Find Better</strong>
                            <span>Coaching Classes</span>
                        </div>
                    </div>

                    <div className="hero-card rating-stat-card">
                        <span className="stat-stars">★★★★★</span>
                        <strong>Student Reviews</strong>
                        <span>Make informed decisions</span>
                    </div>

                    <div className="floating-circle circle-one">
                        🎯
                    </div>

                    <div className="floating-circle circle-two">
                        📚
                    </div>

                </div>

            </section>


            {/* FEATURES */}
            <section className="home-features">

                <div className="section-heading">

                    <span>WHY CQCS?</span>

                    <h2>
                        Everything You Need Before Choosing a Class
                    </h2>

                    <p>
                        Don't choose a coaching class blindly.
                        Get the information you need to make the right decision.
                    </p>

                </div>


                <div className="home-feature-grid">

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            💰
                        </div>

                        <h3>
                            Compare Fees
                        </h3>

                        <p>
                            Compare course fees and duration
                            before spending your money.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            🎥
                        </div>

                        <h3>
                            Demo Lectures
                        </h3>

                        <p>
                            Explore demo lectures and get a
                            feel for the teaching style.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            ⭐
                        </div>

                        <h3>
                            Student Reviews
                        </h3>

                        <p>
                            Read genuine student experiences
                            and ratings before deciding.
                        </p>

                    </div>


                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            📊
                        </div>

                        <h3>
                            Easy Comparison
                        </h3>

                        <p>
                            Compare different coaching options
                            in one convenient place.
                        </p>

                    </div>

                </div>

            </section>


            {/* HOW IT WORKS */}
            <section className="how-section">

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Choose Your Coaching in 3 Simple Steps
                    </h2>

                </div>


                <div className="steps-grid">

                    <div className="step-card">

                        <div className="step-number">
                            01
                        </div>

                        <h3>
                            Explore Classes
                        </h3>

                        <p>
                            Browse coaching institutes,
                            courses and subjects available near you.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            02
                        </div>

                        <h3>
                            Compare
                        </h3>

                        <p>
                            Check fees, duration, ratings,
                            teaching quality and other details.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            03
                        </div>

                        <h3>
                            Make Your Choice
                        </h3>

                        <p>
                            Use student reviews and course
                            information to choose confidently.
                        </p>

                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="home-cta">

                <div>

                    <span>
                        READY TO START?
                    </span>

                    <h2>
                        Find a Coaching Class That Fits You
                    </h2>

                    <p>
                        Explore available classes and start
                        comparing your options today.
                    </p>

                </div>

                <Link
                    to="/classes"
                    className="cta-btn"
                >
                    Explore Classes →
                </Link>

            </section>

        </div>
    );
}

export default Home;