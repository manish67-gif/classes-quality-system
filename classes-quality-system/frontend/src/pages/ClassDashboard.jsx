import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ClassDashboard.css";

const API = "http://localhost:8080/api";

function ClassDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [institute, setInstitute] = useState(null);
    const [courses, setCourses] = useState([]);

    const [stats, setStats] = useState({
        courses: 0,
        subjects: 0,
        demoLectures: 0
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [showCourseForm, setShowCourseForm] = useState(false);

    const [courseForm, setCourseForm] = useState({
        name: "",
        description: "",
        fees: "",
        duration: ""
    });

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    // --------------------------------------------------
    // LOAD INSTITUTE
    // --------------------------------------------------

    const loadInstitute = async () => {
        try {
            const response = await fetch(`${API}/classes`, {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load institute"
                );
            }

            const currentUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const ownedClass = (data.classes || []).find(
                (item) =>
                    String(item.ownerId?._id || item.ownerId) ===
                    String(currentUser.id)
            );

            setInstitute(ownedClass || null);

            return ownedClass || null;
        } catch (error) {
            console.error("Load institute error:", error);
            setMessage(error.message);
            return null;
        }
    };

    // --------------------------------------------------
    // LOAD COURSES
    // --------------------------------------------------

    const loadCourses = async (classId) => {
        if (!classId) {
            setCourses([]);
            return;
        }

        try {
            const response = await fetch(
                `${API}/courses/class/${classId}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load courses"
                );
            }

            const loadedCourses = data.courses || [];

            setCourses(loadedCourses);

            return loadedCourses;
        } catch (error) {
            console.error("Load courses error:", error);
            setCourses([]);
            setMessage(error.message);
            return [];
        }
    };

    // --------------------------------------------------
    // LOAD STATS
    // --------------------------------------------------

    const loadStats = async (classId, loadedCourses) => {
        if (!classId || !loadedCourses.length) {
            setStats({
                courses: loadedCourses.length,
                subjects: 0,
                demoLectures: 0
            });
            return;
        }

        try {
            const subjectResponses = await Promise.all(
                loadedCourses.map(async (course) => {
                    const response = await fetch(
                        `${API}/subjects/course/${course._id}`,
                        { headers }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        return [];
                    }

                    return data.subjects || [];
                })
            );

            const allSubjects = subjectResponses.flat();

            const demoLectures = allSubjects.reduce(
                (total, subject) =>
                    total + (subject.demoLectures?.length || 0),
                0
            );

            setStats({
                courses: loadedCourses.length,
                subjects: allSubjects.length,
                demoLectures
            });
        } catch (error) {
            console.error("Load statistics error:", error);

            setStats({
                courses: loadedCourses.length,
                subjects: 0,
                demoLectures: 0
            });
        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);

            const loadedInstitute = await loadInstitute();

            if (loadedInstitute) {
                const loadedCourses = await loadCourses(
                    loadedInstitute._id
                );

                await loadStats(
                    loadedInstitute._id,
                    loadedCourses
                );
            }

            setLoading(false);
        };

        loadDashboard();
    }, []);

    // --------------------------------------------------
    // COURSE FORM
    // --------------------------------------------------

    const handleCourseChange = (event) => {
        const { name, value } = event.target;

        setCourseForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const createCourse = async (event) => {
        event.preventDefault();

        if (!institute) {
            setMessage("Your institute profile is not available.");
            return;
        }

        try {
            const response = await fetch(`${API}/courses`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    classId: institute._id,
                    name: courseForm.name,
                    description: courseForm.description,
                    fees: Number(courseForm.fees),
                    duration: courseForm.duration
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create course"
                );
            }

            setMessage("Course added successfully.");

            setCourseForm({
                name: "",
                description: "",
                fees: "",
                duration: ""
            });

            setShowCourseForm(false);

            const loadedCourses = await loadCourses(
                institute._id
            );

            await loadStats(
                institute._id,
                loadedCourses
            );
        } catch (error) {
            console.error("Create course error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE COURSE
    // --------------------------------------------------

    const deleteCourse = async (courseId) => {
        const confirmed = window.confirm(
            "Delete this course? Its subjects and reviews will also be deleted."
        );

        if (!confirmed) {
            return;
        }

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

            const loadedCourses = await loadCourses(
                institute._id
            );

            await loadStats(
                institute._id,
                loadedCourses
            );
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
            <main className="class-dashboard-page">
                <div className="class-dashboard-loading">
                    <h2>Loading Dashboard...</h2>
                    <p>
                        Please wait while your institute data loads.
                    </p>
                </div>
            </main>
        );
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <main className="class-dashboard-page">

            {/* HEADER */}

            <header className="class-dashboard-header">
                <div>
                    <span className="class-dashboard-label">
                        CLASS DASHBOARD
                    </span>

                    <h1>My Institute</h1>

                    <p>
                        Manage your institute and courses.
                    </p>
                </div>
            </header>

            {/* MESSAGE */}

            {message && (
                <div className="class-dashboard-message">
                    {message}
                </div>
            )}

            {/* STATS */}

            <section className="class-dashboard-stats">

                <div className="class-stat-card">
                    <span className="class-stat-label">
                        Courses
                    </span>

                    <strong>{stats.courses}</strong>
                </div>

                <div className="class-stat-card">
                    <span className="class-stat-label">
                        Subjects
                    </span>

                    <strong>{stats.subjects}</strong>
                </div>

                <div className="class-stat-card">
                    <span className="class-stat-label">
                        Demo Lectures
                    </span>

                    <strong>{stats.demoLectures}</strong>
                </div>

            </section>

            {/* INSTITUTE */}

            <section className="class-dashboard-section">

                <div className="class-section-header">
                    <div>
                        <span className="class-section-label">
                            INSTITUTE
                        </span>

                        <h2>Institute Information</h2>

                        <p>
                            Your registered institute details.
                        </p>
                    </div>
                </div>

                {!institute ? (
                    <div className="class-empty-card">
                        <h3>No Institute Found</h3>

                        <p>
                            Your institute profile is not available.
                        </p>
                    </div>
                ) : (
                    <div className="class-institute-card">

                        <h3>{institute.name}</h3>

                        <p>
                            {institute.description ||
                                "No description available."}
                        </p>

                        <div className="class-institute-details">

                            {institute.location && (
                                <span>
                                    📍 {institute.location}
                                </span>
                            )}

                            {institute.address && (
                                <span>
                                    🏠 {institute.address}
                                </span>
                            )}

                            {institute.contactNumber && (
                                <span>
                                    📞 {institute.contactNumber}
                                </span>
                            )}

                            {institute.website && (
                                <span>
                                    🌐 {institute.website}
                                </span>
                            )}

                            {institute.rating !== null &&
                                institute.rating !== undefined && (
                                    <span>
                                        ⭐ {institute.rating}
                                    </span>
                                )}

                        </div>

                    </div>
                )}

            </section>

            {/* COURSES */}

            <section className="class-dashboard-section">

                <div className="class-section-header class-courses-header">

                    <div>
                        <span className="class-section-label">
                            COURSES
                        </span>

                        <h2>Courses</h2>

                        <p>
                            Manage the courses offered by your
                            institute.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="class-primary-button"
                        onClick={() =>
                            setShowCourseForm(
                                (previous) => !previous
                            )
                        }
                    >
                        {showCourseForm
                            ? "Cancel"
                            : "+ Add Course"}
                    </button>

                </div>

                {/* ADD COURSE */}

                {showCourseForm && (
                    <form
                        className="class-form-card"
                        onSubmit={createCourse}
                    >
                        <h3>Add Course</h3>

                        <div className="class-form-grid">

                            <div className="class-form-group">
                                <label>
                                    Course Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={courseForm.name}
                                    onChange={handleCourseChange}
                                    placeholder="Enter course name"
                                    required
                                />
                            </div>

                            <div className="class-form-group">
                                <label>
                                    Fees
                                </label>

                                <input
                                    type="number"
                                    name="fees"
                                    value={courseForm.fees}
                                    onChange={handleCourseChange}
                                    placeholder="Enter fees"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="class-form-group">
                                <label>
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={courseForm.duration}
                                    onChange={handleCourseChange}
                                    placeholder="e.g. 1 Year"
                                    required
                                />
                            </div>

                        </div>

                        <div className="class-form-group">
                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={courseForm.description}
                                onChange={handleCourseChange}
                                placeholder="Enter course description"
                                rows="4"
                            />
                        </div>

                        <button
                            type="submit"
                            className="class-primary-button"
                        >
                            Add Course
                        </button>

                    </form>
                )}

                {/* COURSE LIST */}

                {courses.length === 0 ? (
                    <div className="class-empty-card">
                        <h3>No Courses Yet</h3>

                        <p>
                            Add your first course to start
                            managing subjects.
                        </p>
                    </div>
                ) : (
                    <div className="class-course-grid">

                        {courses.map((course) => (
                            <article
                                className="class-course-card"
                                key={course._id}
                            >
                                <div className="class-course-card-content">

                                    <span className="class-card-label">
                                        COURSE
                                    </span>

                                    <h3>{course.name}</h3>

                                    <p>
                                        {course.description ||
                                            "No description available."}
                                    </p>

                                    <div className="class-course-meta">

                                        <span>
                                            Fees: ₹{course.fees}
                                        </span>

                                        <span>
                                            Duration:{" "}
                                            {course.duration}
                                        </span>

                                        {course.rating !==
                                            undefined &&
                                            course.rating !==
                                            null && (
                                                <span>
                                                    Rating: ⭐{" "}
                                                    {course.rating}
                                                </span>
                                            )}

                                    </div>

                                </div>

                                <div className="class-card-actions">

                                    <button
                                        type="button"
                                        className="class-primary-button"
                                        onClick={() =>
                                            navigate(
                                                `/class/courses/${course._id}`
                                            )
                                        }
                                    >
                                        Manage Course
                                    </button>

                                    <button
                                        type="button"
                                        className="class-danger-button"
                                        onClick={() =>
                                            deleteCourse(
                                                course._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default ClassDashboard;