import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ClassDetails() {

    const { id } = useParams();

    const [classData, setClassData] = useState(null);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        fetchClassDetails();
    }, [id]);


    const fetchClassDetails = async () => {

        try {

            setLoading(true);
            setError("");

            // =========================================
            // FETCH INSTITUTE
            // =========================================

            const classResponse = await fetch(
                `http://localhost:8080/api/classes/${id}`
            );

            const classResult = await classResponse.json();

            if (!classResponse.ok) {
                throw new Error(
                    classResult.message ||
                    "Failed to fetch institute"
                );
            }

            setClassData(classResult.class);


            // =========================================
            // FETCH COURSES
            // =========================================

            const courseResponse = await fetch(
                `http://localhost:8080/api/courses/class/${id}`
            );

            const courseResult = await courseResponse.json();

            if (!courseResponse.ok) {
                throw new Error(
                    courseResult.message ||
                    "Failed to fetch courses"
                );
            }

            setCourses(courseResult.courses || []);

        } catch (error) {

            console.error(
                "Institute details error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="message">

                <h1>
                    Loading...
                </h1>

                <p>
                    Please wait while we load the institute details.
                </p>

            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <div className="details-page">

                <div className="error-message">

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    // =========================================
    // NOT FOUND
    // =========================================

    if (!classData) {
        return (
            <div className="message">

                <h1>
                    Institute not found
                </h1>

                <p>
                    The requested coaching institute
                    could not be found.
                </p>

            </div>
        );
    }


    return (
        <div className="details-page">


            {/* =========================================
                INSTITUTE HEADER
            ========================================= */}

            <div className="class-details-header">

                <div>

                    <span className="details-label">
                        COACHING INSTITUTE
                    </span>

                    <h1>
                        {classData.name}
                    </h1>

                    <p className="class-description">
                        {classData.description ||
                            "Explore courses and subjects offered by this institute."}
                    </p>


                    {/* INSTITUTE RATING */}

                    {classData.rating !== undefined &&
                        classData.rating !== null && (
                            <div className="details-rating">

                                <span className="rating-star">
                                    ★
                                </span>

                                <strong>
                                    {Number(classData.rating).toFixed(1)}
                                </strong>

                                <span>
                                    / 5
                                </span>

                                <span className="rating-text">
                                    Institute Rating
                                </span>

                            </div>
                        )}

                </div>

            </div>


            {/* =========================================
                INSTITUTE INFORMATION
            ========================================= */}

            <div className="class-info-grid">


                <div className="class-info-card">

                    <span className="info-icon">
                        📍
                    </span>

                    <div>

                        <h3>
                            Location
                        </h3>

                        <p>
                            {classData.location || "Not available"}
                        </p>

                    </div>

                </div>


                <div className="class-info-card">

                    <span className="info-icon">
                        🏠
                    </span>

                    <div>

                        <h3>
                            Address
                        </h3>

                        <p>
                            {classData.address || "Not available"}
                        </p>

                    </div>

                </div>


                <div className="class-info-card">

                    <span className="info-icon">
                        📞
                    </span>

                    <div>

                        <h3>
                            Contact
                        </h3>

                        <p>
                            {classData.contactNumber || "Not available"}
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                COURSES
            ========================================= */}

            <div className="courses-section">


                <div className="section-heading">

                    <div>

                        <span className="details-label">
                            AVAILABLE PROGRAMS
                        </span>

                        <h2>
                            Courses Offered
                        </h2>

                        <p>
                            Choose a course to explore its
                            subjects and demo lectures.
                        </p>

                    </div>


                    <span className="course-count">

                        {courses.length}

                        {" "}

                        {courses.length === 1
                            ? "Course"
                            : "Courses"}

                    </span>

                </div>


                {/* =========================================
                    NO COURSES
                ========================================= */}

                {courses.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No courses available
                        </h3>

                        <p>
                            This institute hasn't added
                            any courses yet.
                        </p>

                    </div>

                ) : (


                    /* =====================================
                       COURSE GRID
                    ===================================== */

                    <div className="course-grid">

                        {courses.map((course) => (

                            <div
                                key={course._id}
                                className="course-card"
                            >


                                {/* COURSE TOP */}

                                <div className="course-card-top">

                                    <div className="course-icon">
                                        📚
                                    </div>

                                    <span className="course-tag">
                                        COURSE
                                    </span>

                                </div>


                                {/* COURSE NAME */}

                                <h3>
                                    {course.name}
                                </h3>

                                <div className="course-rating">
                                    <span className="course-rating-star">
                                        ★
                                    </span>

                                    <strong>
                                        {course.rating !== undefined && course.rating !== null
                                            ? Number(course.rating).toFixed(1)
                                            : "N/A"}
                                    </strong>

                                    <span className="course-rating-max">
                                        / 5
                                    </span>
                                </div>


                                {/* DESCRIPTION */}

                                <p className="course-description">

                                    {course.description ||
                                        "Explore subjects, learning resources and demo lectures available for this course."}

                                </p>


                                {/* COURSE META */}

                                <div className="course-meta">


                                    <div>

                                        <span>
                                            Duration
                                        </span>

                                        <strong>
                                            ⏱ {course.duration || "N/A"}
                                        </strong>

                                    </div>


                                    <div>

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

                                </div>


                                {/* VIEW COURSE */}

                                <Link
                                    to={`/courses/${course._id}`}
                                    className="course-btn"
                                >

                                    <span>
                                        Explore Course
                                    </span>

                                    <span>
                                        →
                                    </span>

                                </Link>


                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default ClassDetails;