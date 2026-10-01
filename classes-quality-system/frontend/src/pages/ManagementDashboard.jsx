import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

function ManagementDashboard({ role = "class" }) {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const isAdmin = role === "admin";

    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [showCourseForm, setShowCourseForm] = useState(false);
    const [showSubjectForm, setShowSubjectForm] = useState(false);
    const [showLectureForm, setShowLectureForm] = useState(false);

    const [courseForm, setCourseForm] = useState({
        name: "",
        description: "",
        fees: "",
        duration: ""
    });

    const [subjectForm, setSubjectForm] = useState({
        name: "",
        description: ""
    });

    const [lectureForm, setLectureForm] = useState({
        title: "",
        duration: "",
        videoUrl: ""
    });

    // --------------------------------------------------
    // COMMON HEADERS
    // --------------------------------------------------

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    // --------------------------------------------------
    // LOAD CLASSES
    // --------------------------------------------------

    const loadClasses = async () => {
        try {
            const response = await fetch(`${API}/classes`, {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load classes");
            }

            let loadedClasses = data.classes || [];

            // Class account should see only its own institute
            if (!isAdmin && currentUser?.id) {
                loadedClasses = loadedClasses.filter(
                    (item) =>
                        String(item.ownerId?._id || item.ownerId) ===
                        String(currentUser.id)
                );
            }
            setClasses(loadedClasses);
        } catch (error) {
            console.error("Load classes error:", error);
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
                throw new Error(data.message || "Failed to load courses");
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

    const loadSubjects = async (courseId) => {
        if (!courseId) {
            setSubjects([]);
            return;
        }

        try {
            const response = await fetch(
                `${API}/subjects/course/${courseId}`,
                {
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load subjects"
                );
            }

            setSubjects(data.subjects || []);
        } catch (error) {
            console.error("Load subjects error:", error);
            setSubjects([]);
        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await loadClasses();
            await loadCourses();

            setLoading(false);
        };

        loadData();
    }, []);

    // --------------------------------------------------
    // SELECT COURSE
    // --------------------------------------------------

    const handleSelectCourse = async (course) => {
        setSelectedCourse(course);
        setSelectedSubject(null);
        setShowSubjectForm(false);
        setShowLectureForm(false);

        await loadSubjects(course._id);
    };

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

        if (!classes.length) {
            setMessage(
                "Your institute profile is not available. Please complete institute signup first."
            );
            return;
        }

        const classId = classes[0]._id;

        try {
            const response = await fetch(`${API}/courses`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    classId,
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

            await loadCourses();
        } catch (error) {
            console.error("Create course error:", error);
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

            if (selectedCourse?._id === courseId) {
                setSelectedCourse(null);
                setSubjects([]);
            }

            await loadCourses();
        } catch (error) {
            console.error("Delete course error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // SUBJECT FORM
    // --------------------------------------------------

    const handleSubjectChange = (event) => {
        const { name, value } = event.target;

        setSubjectForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const createSubject = async (event) => {
        event.preventDefault();

        if (!selectedCourse) {
            setMessage("Please select a course first.");
            return;
        }

        try {
            const response = await fetch(`${API}/subjects`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    courseId: selectedCourse._id,
                    name: subjectForm.name,
                    description: subjectForm.description
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create subject"
                );
            }

            setMessage("Subject added successfully.");

            setSubjectForm({
                name: "",
                description: ""
            });

            setShowSubjectForm(false);

            await loadSubjects(selectedCourse._id);
        } catch (error) {
            console.error("Create subject error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE SUBJECT
    // --------------------------------------------------

    const deleteSubject = async (subjectId) => {
        const confirmDelete = window.confirm(
            "Delete this subject and its reviews/demo lectures?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API}/subjects/${subjectId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete subject"
                );
            }

            setMessage("Subject deleted successfully.");

            setSelectedSubject(null);

            await loadSubjects(selectedCourse._id);
        } catch (error) {
            console.error("Delete subject error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DEMO LECTURE FORM
    // --------------------------------------------------

    const handleLectureChange = (event) => {
        const { name, value } = event.target;

        setLectureForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const createDemoLecture = async (event) => {
        event.preventDefault();

        if (!selectedSubject) {
            setMessage("Please select a subject first.");
            return;
        }

        try {
            const response = await fetch(
                `${API}/subjects/${selectedSubject._id}/demos`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        title: lectureForm.title,
                        duration: lectureForm.duration,
                        videoUrl: lectureForm.videoUrl
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add demo lecture"
                );
            }

            setMessage("Demo lecture added successfully.");

            setLectureForm({
                title: "",
                duration: "",
                videoUrl: ""
            });

            setShowLectureForm(false);

            // Refresh selected subject
            const subjectResponse = await fetch(
                `${API}/subjects/${selectedSubject._id}`,
                {
                    headers
                }
            );

            const subjectData = await subjectResponse.json();

            if (subjectResponse.ok) {
                setSelectedSubject(subjectData.subject);
            }

            await loadSubjects(selectedCourse._id);
        } catch (error) {
            console.error("Create demo lecture error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // DELETE DEMO LECTURE
    // --------------------------------------------------

    const deleteDemoLecture = async (lectureId) => {
        if (!selectedSubject) return;

        const confirmDelete = window.confirm(
            "Delete this demo lecture?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API}/subjects/${selectedSubject._id}/demos/${lectureId}`,
                {
                    method: "DELETE",
                    headers
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete demo lecture"
                );
            }

            setMessage("Demo lecture deleted successfully.");

            const subjectResponse = await fetch(
                `${API}/subjects/${selectedSubject._id}`,
                {
                    headers
                }
            );

            const subjectData = await subjectResponse.json();

            if (subjectResponse.ok) {
                setSelectedSubject(subjectData.subject);
            }

            await loadSubjects(selectedCourse._id);
        } catch (error) {
            console.error("Delete demo lecture error:", error);
            setMessage(error.message);
        }
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="management-dashboard">
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="management-dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>
                        {isAdmin
                            ? "Admin Dashboard"
                            : "My Institute"}
                    </h1>

                    <p>
                        {isAdmin
                            ? "Manage institutes, courses and academic content."
                            : "Manage your institute, courses, subjects and demo lectures."}
                    </p>
                </div>
            </div>

            {message && (
                <div className="dashboard-message">
                    {message}
                </div>
            )}

            {/* =================================================
                INSTITUTE SECTION
            ================================================= */}

            <section className="management-section">

                <div className="section-header">
                    <div>
                        <h2>Institute</h2>
                        <p>Your institute profile</p>
                    </div>
                </div>

                {classes.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Institute Found</h3>

                        <p>
                            Please create your institute account
                            through the institute signup option.
                        </p>
                    </div>
                ) : (
                    <div className="institute-card">

                        <h3>{classes[0].name}</h3>

                        <p>
                            {classes[0].description}
                        </p>

                        <div className="institute-details">
                            <span>
                                📍 {classes[0].location}
                            </span>

                            {classes[0].address && (
                                <span>
                                    🏠 {classes[0].address}
                                </span>
                            )}

                            {classes[0].contactNumber && (
                                <span>
                                    📞 {classes[0].contactNumber}
                                </span>
                            )}

                            {classes[0].website && (
                                <span>
                                    🌐 {classes[0].website}
                                </span>
                            )}
                        </div>

                    </div>
                )}

            </section>

            {/* =================================================
                COURSES SECTION
            ================================================= */}

            <section className="management-section">

                <div className="section-header">

                    <div>
                        <h2>Courses</h2>

                        <p>
                            Add and manage courses offered by your institute.
                        </p>
                    </div>

                    {!isAdmin && (
                        <button
                            className="primary-button"
                            onClick={() =>
                                setShowCourseForm(!showCourseForm)
                            }
                        >
                            {showCourseForm
                                ? "Cancel"
                                : "+ Add Course"}
                        </button>
                    )}

                </div>

                {showCourseForm && !isAdmin && (
                    <form
                        className="management-form"
                        onSubmit={createCourse}
                    >

                        <h3>Add Course</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Course Name"
                            value={courseForm.name}
                            onChange={handleCourseChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Course Description"
                            value={courseForm.description}
                            onChange={handleCourseChange}
                        />

                        <input
                            type="number"
                            name="fees"
                            placeholder="Fees"
                            value={courseForm.fees}
                            onChange={handleCourseChange}
                            min="0"
                            required
                        />

                        <input
                            type="text"
                            name="duration"
                            placeholder="Duration (e.g. 1 Year)"
                            value={courseForm.duration}
                            onChange={handleCourseChange}
                            required
                        />

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Add Course
                        </button>

                    </form>
                )}

                <div className="course-list">

                    {courses.length === 0 ? (
                        <div className="empty-state">
                            <p>No courses added yet.</p>
                        </div>
                    ) : (
                        courses.map((course) => {

                            const courseClassId =
                                course.classId?._id ||
                                course.classId;

                            const ownClassId =
                                classes[0]?._id;

                            if (
                                !isAdmin &&
                                courseClassId !== ownClassId
                            ) {
                                return null;
                            }

                            return (
                                <div
                                    className={`course-card ${selectedCourse?._id === course._id
                                        ? "selected"
                                        : ""
                                        }`}
                                    key={course._id}
                                >

                                    <div
                                        onClick={() =>
                                            handleSelectCourse(course)
                                        }
                                        className="course-content"
                                    >

                                        <h3>{course.name}</h3>

                                        <p>
                                            {course.description ||
                                                "No description"}
                                        </p>

                                        <div className="course-info">

                                            <span>
                                                💰 ₹{course.fees}
                                            </span>

                                            <span>
                                                ⏱ {course.duration}
                                            </span>

                                            {course.rating !== undefined && (
                                                <span>
                                                    ⭐ {course.rating}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    {!isAdmin && (
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
                                    )}

                                </div>
                            );
                        })
                    )}

                </div>

            </section>

            {/* =================================================
                SUBJECT SECTION
            ================================================= */}

            {selectedCourse && (
                <section className="management-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Subjects — {selectedCourse.name}
                            </h2>

                            <p>
                                Add subjects under this course.
                            </p>
                        </div>

                        {!isAdmin && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    setShowSubjectForm(
                                        !showSubjectForm
                                    )
                                }
                            >
                                {showSubjectForm
                                    ? "Cancel"
                                    : "+ Add Subject"}
                            </button>
                        )}

                    </div>

                    {showSubjectForm && !isAdmin && (
                        <form
                            className="management-form"
                            onSubmit={createSubject}
                        >

                            <h3>Add Subject</h3>

                            <input
                                type="text"
                                name="name"
                                placeholder="Subject Name"
                                value={subjectForm.name}
                                onChange={handleSubjectChange}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Subject Description"
                                value={subjectForm.description}
                                onChange={handleSubjectChange}
                            />

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Add Subject
                            </button>

                        </form>
                    )}

                    <div className="subject-list">

                        {subjects.length === 0 ? (
                            <div className="empty-state">
                                <p>
                                    No subjects added to this course.
                                </p>
                            </div>
                        ) : (
                            subjects.map((subject) => (
                                <div
                                    className={`subject-card ${selectedSubject?._id ===
                                        subject._id
                                        ? "selected"
                                        : ""
                                        }`}
                                    key={subject._id}
                                >

                                    <div
                                        className="subject-content"
                                        onClick={() => {
                                            setSelectedSubject(
                                                subject
                                            );
                                            setShowLectureForm(false);
                                        }}
                                    >

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
                                                {subject.rating || 0}
                                            </span>

                                            <span>
                                                🎥{" "}
                                                {subject.demoLectures
                                                    ?.length || 0}{" "}
                                                Demo Lectures
                                            </span>

                                        </div>

                                    </div>

                                    {!isAdmin && (
                                        <button
                                            className="danger-button"
                                            onClick={() =>
                                                deleteSubject(
                                                    subject._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>
                            ))
                        )}

                    </div>

                </section>
            )}

            {/* =================================================
                DEMO LECTURES SECTION
            ================================================= */}

            {selectedSubject && (
                <section className="management-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Demo Lectures —{" "}
                                {selectedSubject.name}
                            </h2>

                            <p>
                                Add YouTube or direct video lectures
                                for this subject.
                            </p>
                        </div>

                        {!isAdmin && (
                            <button
                                className="primary-button"
                                onClick={() =>
                                    setShowLectureForm(
                                        !showLectureForm
                                    )
                                }
                            >
                                {showLectureForm
                                    ? "Cancel"
                                    : "+ Add Demo Lecture"}
                            </button>
                        )}

                    </div>

                    {showLectureForm && !isAdmin && (
                        <form
                            className="management-form"
                            onSubmit={createDemoLecture}
                        >

                            <h3>Add Demo Lecture</h3>

                            <input
                                type="text"
                                name="title"
                                placeholder="Lecture Title"
                                value={lectureForm.title}
                                onChange={handleLectureChange}
                                required
                            />

                            <input
                                type="text"
                                name="duration"
                                placeholder="Duration (e.g. 20 min)"
                                value={lectureForm.duration}
                                onChange={handleLectureChange}
                            />

                            <input
                                type="url"
                                name="videoUrl"
                                placeholder="YouTube Video URL"
                                value={lectureForm.videoUrl}
                                onChange={handleLectureChange}
                                required
                            />

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Add Demo Lecture
                            </button>

                        </form>
                    )}

                    <div className="lecture-list">

                        {selectedSubject.demoLectures?.length === 0 ? (
                            <div className="empty-state">
                                <p>
                                    No demo lectures added yet.
                                </p>
                            </div>
                        ) : (
                            selectedSubject.demoLectures?.map(
                                (lecture) => (
                                    <div
                                        className="lecture-card"
                                        key={lecture._id}
                                    >

                                        <div>
                                            <h3>
                                                {lecture.title}
                                            </h3>

                                            {lecture.duration && (
                                                <p>
                                                    ⏱{" "}
                                                    {
                                                        lecture.duration
                                                    }
                                                </p>
                                            )}

                                            <a
                                                href={
                                                    lecture.videoUrl
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Watch Lecture
                                            </a>
                                        </div>

                                        {!isAdmin && (
                                            <button
                                                className="danger-button"
                                                onClick={() =>
                                                    deleteDemoLecture(
                                                        lecture._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}

                                    </div>
                                )
                            )
                        )}

                    </div>

                </section>
            )}

        </div>
    );
}

export default ManagementDashboard;