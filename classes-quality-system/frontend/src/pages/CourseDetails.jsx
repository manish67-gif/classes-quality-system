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

            // Get course
            const courseResponse = await fetch(
                `http://localhost:8080/api/courses/${id}`
            );

            const courseResult =
                await courseResponse.json();

            if (!courseResponse.ok) {
                throw new Error(
                    courseResult.message ||
                    "Failed to fetch course"
                );
            }

            setCourse(courseResult.course);


            // Get subjects belonging to this course
            const subjectResponse = await fetch(
                `http://localhost:8080/api/subjects/course/${id}`
            );

            const subjectResult =
                await subjectResponse.json();

            if (!subjectResponse.ok) {
                throw new Error(
                    subjectResult.message ||
                    "Failed to fetch subjects"
                );
            }

            setSubjects(subjectResult.subjects);


        } catch (error) {

            console.error(error);

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="details-page">
                <h1>Loading...</h1>
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


    if (!course) {
        return (
            <div className="details-page">
                <h1>Course not found</h1>
            </div>
        );
    }


    return (
        <div className="details-page">

            <Link to="/classes" className="back-link">
                ← Back to Classes
            </Link>


            {/* COURSE DETAILS */}

            <div className="details-header">

                <div>

                    <h1>
                        {course.name}
                    </h1>

                    <p>
                        {course.description}
                    </p>

                </div>

            </div>


            <div className="details-card course-info">

                <div className="course-info-item">

                    <span>
                        Duration
                    </span>

                    <strong>
                        {course.duration}
                    </strong>

                </div>


                <div className="course-info-item">

                    <span>
                        Fees
                    </span>

                    <strong>
                        ₹{course.fees?.toLocaleString("en-IN")}
                    </strong>

                </div>

            </div>


            {/* SUBJECTS */}

            <div className="details-card">

                <h2>
                    Subjects
                </h2>

                {subjects.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No subjects available for this course.
                        </p>

                    </div>

                ) : (

                    <div className="subject-cards">

                        {subjects.map((subject) => (

                            <div
                                className="subject-card"
                                key={subject._id}
                            >

                                <h3>
                                    {subject.name}
                                </h3>

                                <p>
                                    {subject.description}
                                </p>


                                <Link
                                    to={`/subjects/${subject._id}`}
                                >
                                    <button className="view-btn">
                                        View Subject
                                    </button>
                                </Link>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default CourseDetails;