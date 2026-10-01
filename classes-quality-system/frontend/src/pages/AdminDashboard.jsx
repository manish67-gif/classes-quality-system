import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

function AdminDashboard() {
    const token = localStorage.getItem("token");

    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    // --------------------------------------------------
    // LOAD INSTITUTES
    // --------------------------------------------------

    const loadClasses = async () => {
        try {
            const response = await fetch(`${API}/classes`, {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load institutes"
                );
            }

            setClasses(data.classes || []);
        } catch (error) {
            console.error("Load institutes error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOAD COURSES
    // --------------------------------------------------

    const loadCourses = async () => {
        try {
            const response = await fetch(`${API}/courses`, {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load courses"
                );
            }

            setCourses(data.courses || []);
        } catch (error) {
            console.error("Load courses error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOAD SUBJECTS
    // --------------------------------------------------

    const loadSubjects = async () => {
        try {
            const response = await fetch(`${API}/subjects`, {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load subjects"
                );
            }

            setSubjects(data.subjects || []);
        } catch (error) {
            console.error("Load subjects error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                loadClasses(),
                loadCourses(),
                loadSubjects()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // --------------------------------------------------
    // DELETE INSTITUTE
    // --------------------------------------------------

    const deleteClass = async (classId) => {
        const confirmDelete = window.confirm(
            "Delete this institute? Its courses, subjects and reviews will also be deleted."
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API}/classes/${classId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete institute"
                );
            }

            setMessage("Institute deleted successfully.");

            await loadClasses();
            await loadCourses();
            await loadSubjects();
        } catch (error) {
            console.error("Delete institute error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE COURSE
    // --------------------------------------------------

    const deleteCourse = async (courseId) => {
        const confirmDelete = window.confirm(
            "Delete this course? Its subjects and reviews will also be deleted."
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API}/courses/${courseId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete course"
                );
            }

            setMessage("Course deleted successfully.");

            await loadCourses();
            await loadSubjects();
        } catch (error) {
            console.error("Delete course error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="management-dashboard">
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="management-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage and monitor institutes,
                        courses and academic content.
                    </p>
                </div>
            </div>

            {message && (
                <div className="dashboard-message">
                    {message}
                </div>
            )}

            {/* =================================================
                OVERVIEW
            ================================================= */}

            <section className="management-section">

                <div className="section-header">
                    <div>
                        <h2>Overview</h2>

                        <p>
                            Platform statistics
                        </p>
                    </div>
                </div>

                <div className="course-list">

                    <div className="course-card">
                        <div className="course-content">
                            <h3>
                                {classes.length}
                            </h3>

                            <p>
                                Total Institutes
                            </p>
                        </div>
                    </div>

                    <div className="course-card">
                        <div className="course-content">
                            <h3>
                                {courses.length}
                            </h3>

                            <p>
                                Total Courses
                            </p>
                        </div>
                    </div>

                    <div className="course-card">
                        <div className="course-content">
                            <h3>
                                {subjects.length}
                            </h3>

                            <p>
                                Total Subjects
                            </p>
                        </div>
                    </div>

                </div>

            </section>

            {/* =================================================
                INSTITUTES
            ================================================= */}

            <section className="management-section">

                <div className="section-header">

                    <div>
                        <h2>Institutes</h2>

                        <p>
                            All registered institutes
                        </p>
                    </div>

                </div>

                <div className="course-list">

                    {classes.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                No institutes registered.
                            </p>
                        </div>
                    ) : (
                        classes.map((classItem) => (

                            <div
                                className="course-card"
                                key={classItem._id}
                            >

                                <div className="course-content">

                                    <h3>
                                        {classItem.name}
                                    </h3>

                                    <p>
                                        {classItem.description ||
                                            "No description"}
                                    </p>

                                    <div className="course-info">

                                        {classItem.location && (
                                            <span>
                                                📍{" "}
                                                {
                                                    classItem.location
                                                }
                                            </span>
                                        )}

                                        {classItem.contactNumber && (
                                            <span>
                                                📞{" "}
                                                {
                                                    classItem.contactNumber
                                                }
                                            </span>
                                        )}

                                        {classItem.rating !==
                                            null &&
                                            classItem.rating !==
                                            undefined && (
                                                <span>
                                                    ⭐{" "}
                                                    {
                                                        classItem.rating
                                                    }
                                                </span>
                                            )}

                                    </div>

                                </div>

                                <button
                                    className="danger-button"
                                    onClick={() =>
                                        deleteClass(
                                            classItem._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))
                    )}

                </div>

            </section>

            {/* =================================================
                COURSES
            ================================================= */}

            <section className="management-section">

                <div className="section-header">

                    <div>
                        <h2>Courses</h2>

                        <p>
                            All courses across institutes
                        </p>
                    </div>

                </div>

                <div className="course-list">

                    {courses.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                No courses available.
                            </p>
                        </div>
                    ) : (
                        courses.map((course) => (

                            <div
                                className="course-card"
                                key={course._id}
                            >

                                <div className="course-content">

                                    <h3>
                                        {course.name}
                                    </h3>

                                    <p>
                                        {course.description ||
                                            "No description"}
                                    </p>

                                    <div className="course-info">

                                        <span>
                                            💰 ₹{course.fees}
                                        </span>

                                        <span>
                                            ⏱{" "}
                                            {course.duration}
                                        </span>

                                        {course.rating !==
                                            null &&
                                            course.rating !==
                                            undefined && (
                                                <span>
                                                    ⭐{" "}
                                                    {
                                                        course.rating
                                                    }
                                                </span>
                                            )}

                                    </div>

                                    {course.classId && (
                                        <p>
                                            🏫{" "}
                                            {
                                                course.classId.name
                                            }
                                        </p>
                                    )}

                                </div>

                                <button
                                    className="danger-button"
                                    onClick={() =>
                                        deleteCourse(
                                            course._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))
                    )}

                </div>

            </section>

            {/* =================================================
                SUBJECTS
            ================================================= */}

            <section className="management-section">

                <div className="section-header">

                    <div>
                        <h2>Subjects</h2>

                        <p>
                            All subjects across courses
                        </p>
                    </div>

                </div>

                <div className="subject-list">

                    {subjects.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                No subjects available.
                            </p>
                        </div>
                    ) : (
                        subjects.map((subject) => (

                            <div
                                className="subject-card"
                                key={subject._id}
                            >

                                <div className="subject-content">

                                    <h3>
                                        {subject.name}
                                    </h3>

                                    <p>
                                        {subject.description ||
                                            "No description"}
                                    </p>

                                    <div className="subject-info">

                                        <span>
                                            ⭐{" "}
                                            {subject.rating ||
                                                0}
                                        </span>

                                        <span>
                                            🎥{" "}
                                            {
                                                subject
                                                    .demoLectures
                                                    ?.length || 0
                                            }{" "}
                                            Demo Lectures
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))
                    )}

                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;