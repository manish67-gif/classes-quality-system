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

            // Get class details
            const classResponse = await fetch(
                `http://localhost:8080/api/classes/${id}`
            );

            const classResult =
                await classResponse.json();

            if (!classResponse.ok) {
                throw new Error(
                    classResult.message ||
                    "Failed to fetch class"
                );
            }

            setClassData(classResult.class);


            // Get courses belonging to this class
            const courseResponse = await fetch(
                `http://localhost:8080/api/courses/class/${id}`
            );

            const courseResult =
                await courseResponse.json();

            if (!courseResponse.ok) {
                throw new Error(
                    courseResult.message ||
                    "Failed to fetch courses"
                );
            }

            setCourses(courseResult.courses);

        } catch (error) {

            console.error(
                "Class details error:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="message">
                <h1>Loading...</h1>
                <p>Please wait while we load the class details.</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="details-page">
                <div className="error-message">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }


    if (!classData) {
        return (
            <div className="message">
                <h1>Class not found</h1>
                <p>The requested coaching class could not be found.</p>
            </div>
        );
    }


    return (
        <div className="details-page">

            {/* CLASS INFORMATION */}

            <div className="class-details-header">

                <div>
                    <span className="details-label">
                        COACHING INSTITUTE
                    </span>

                    <h1>
                        {classData.name}
                    </h1>

                    <p className="class-description">
                        {classData.description}
                    </p>
                </div>

            </div>


            {/* CONTACT INFORMATION */}

            <div className="class-info-grid">

                <div className="class-info-card">
                    <span className="info-icon">📍</span>

                    <div>
                        <h3>Location</h3>
                        <p>{classData.location}</p>
                    </div>
                </div>


                <div className="class-info-card">
                    <span className="info-icon">🏠</span>

                    <div>
                        <h3>Address</h3>
                        <p>{classData.address}</p>
                    </div>
                </div>


                <div className="class-info-card">
                    <span className="info-icon">📞</span>

                    <div>
                        <h3>Contact</h3>
                        <p>{classData.contactNumber}</p>
                    </div>
                </div>

            </div>


            {/* COURSES */}

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
                            Explore the courses available at this institute.
                        </p>
                    </div>

                    <span className="course-count">
                        {courses.length}{" "}
                        {courses.length === 1 ? "Course" : "Courses"}
                    </span>
                </div>


                {courses.length === 0 ? (

                    <div className="empty-state">
                        <h3>No courses available</h3>

                        <p>
                            This coaching class hasn't added any courses yet.
                        </p>
                    </div>

                ) : (

                    <div className="course-grid">

                        {courses.map((course) => (

                            <div
                                key={course._id}
                                className="course-card"
                            >

                                <div className="course-card-top">
                                    <div className="course-icon">
                                        📚
                                    </div>

                                    <span className="course-tag">
                                        COURSE
                                    </span>
                                </div>


                                <h3>
                                    {course.name}
                                </h3>


                                <p className="course-description">
                                    {course.description}
                                </p>


                                <div className="course-meta">

                                    <div>
                                        <span>Duration</span>
                                        <strong>
                                            ⏱ {course.duration}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Fees</span>
                                        <strong>
                                            ₹{course.fees?.toLocaleString("en-IN")}
                                        </strong>
                                    </div>

                                </div>


                                <Link
                                    to={`/courses/${course._id}`}
                                    className="course-btn"
                                >
                                    View Course
                                    <span>→</span>
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