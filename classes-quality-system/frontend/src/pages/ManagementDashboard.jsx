import { useCallback, useEffect, useState } from "react";

const API = "http://localhost:8080/api";

async function request(path, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

function ManagementDashboard({ role }) {
    const [classes, setClasses] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedClass, setSelectedClass] = useState(null);
    const [courses, setCourses] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const [selectedSubject, setSelectedSubject] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [courseForm, setCourseForm] = useState({
        name: "",
        fees: "",
        description: "",
        duration: ""
    });

    const [subjectForm, setSubjectForm] = useState({
        name: "",
        description: ""
    });

    const [demoForm, setDemoForm] = useState({
        title: "",
        duration: "",
        videoUrl: ""
    });

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    // =========================
    // LOAD CLASSES
    // =========================

    const loadClasses = useCallback(async () => {
        const data = await request("/classes", {
            headers: {}
        });

        const owned =
            role === "class"
                ? (data.classes || []).filter(
                    (item) =>
                        item.ownerId === currentUser?.id ||
                        item.ownerId?._id === currentUser?.id
                )
                : data.classes || [];

        setClasses(owned);

        if (
            selectedClass &&
            !owned.some(
                (item) => item._id === selectedClass._id
            )
        ) {
            setSelectedClass(null);
        }
    }, [currentUser?.id, role, selectedClass]);

    // =========================
    // LOAD USERS
    // =========================

    const loadUsers = useCallback(async () => {
        if (role === "admin") {
            const data = await request("/users");
            setUsers(data.users || []);
        }
    }, [role]);

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        Promise.all([
            loadClasses(),
            loadUsers()
        ]).catch((loadError) => {
            setError(loadError.message);
        });
    }, [loadClasses, loadUsers]);

    // =========================
    // SELECT CLASS
    // =========================

    const selectClass = async (classItem) => {
        setSelectedClass(classItem);
        setSelectedCourse(null);
        setSelectedSubject(null);
        setCourses([]);
        setSubjects([]);

        try {
            const data = await request(
                `/courses/class/${classItem._id}`,
                {
                    headers: {}
                }
            );

            setCourses(data.courses || []);
        } catch (loadError) {
            setError(loadError.message);
        }
    };

    // =========================
    // SELECT COURSE
    // =========================

    const selectCourse = async (course) => {
        setSelectedCourse(course);
        setSelectedSubject(null);
        setSubjects([]);

        try {
            const data = await request(
                `/subjects/course/${course._id}`,
                {
                    headers: {}
                }
            );

            setSubjects(data.subjects || []);
        } catch (loadError) {
            setError(loadError.message);
        }
    };

    // =========================
    // SELECT SUBJECT
    // =========================

    const selectSubject = async (subject) => {
        try {
            const data = await request(
                `/subjects/${subject._id}`,
                {
                    headers: {}
                }
            );

            setSelectedSubject(data.subject);
        } catch (loadError) {
            setError(loadError.message);
        }
    };

    // =========================
    // GENERIC ADD FUNCTION
    // =========================

    const submit = async (
        path,
        body,
        reset,
        refresh
    ) => {
        setError("");
        setMessage("");

        try {
            await request(path, {
                method: "POST",
                body: JSON.stringify(body)
            });

            reset();

            await refresh();

            setMessage("Saved successfully.");
        } catch (submitError) {
            setError(submitError.message);
        }
    };

    // =========================
    // DELETE FUNCTION
    // =========================

    const remove = async (path, refresh) => {
        if (!window.confirm("Delete this item?")) {
            return;
        }

        try {
            await request(path, {
                method: "DELETE"
            });

            await refresh();

            setMessage("Deleted successfully.");
        } catch (removeError) {
            setError(removeError.message);
        }
    };

    // =========================
    // EDIT NAME
    // Used for Class, Course, Subject
    // =========================

    const editName = async (
        path,
        currentName,
        refresh
    ) => {
        const name = window.prompt(
            "Name",
            currentName
        );

        if (!name || name === currentName) {
            return;
        }

        try {
            await request(path, {
                method: "PUT",
                body: JSON.stringify({
                    name
                })
            });

            await refresh();

            setMessage("Updated successfully.");
        } catch (editError) {
            setError(editError.message);
        }
    };

    // =========================
    // EDIT DEMO LECTURE
    // =========================

    const editDemoLecture = async (
        subjectId,
        lecture,
        refresh
    ) => {
        const title = window.prompt(
            "Lecture title",
            lecture.title
        );

        if (!title || title === lecture.title) {
            return;
        }

        try {
            await request(
                `/subjects/${subjectId}/demos/${lecture._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title
                    })
                }
            );

            await refresh();

            setMessage("Updated successfully.");
        } catch (error) {
            setError(error.message);
        }
    };

    // =========================
    // REFRESH FUNCTIONS
    // =========================

    const refreshCourses = () => {
        if (selectedClass) {
            return selectClass(selectedClass);
        }
    };

    const refreshSubjects = () => {
        if (selectedCourse) {
            return selectCourse(selectedCourse);
        }
    };

    const refreshSubject = () => {
        if (selectedSubject) {
            return selectSubject(selectedSubject);
        }
    };

    // =========================
    // UI
    // =========================

    return (
        <main className="management-page">

            {/* HEADER */}

            <header className="management-header">

                <span className="management-kicker">
                    {role === "admin"
                        ? "PLATFORM CONTROL"
                        : "INSTITUTE CONTROL"}
                </span>

                <h1>
                    {role === "admin"
                        ? "Admin Dashboard"
                        : "Class Dashboard"}
                </h1>

                <p>
                    {role === "admin"
                        ? "Manage users and every published learning resource."
                        : "Manage resources owned by your institute."}
                </p>

            </header>

            {/* MESSAGES */}

            {message && (
                <p className="management-success">
                    {message}
                </p>
            )}

            {error && (
                <p className="management-error">
                    {error}
                </p>
            )}

            <section className="management-grid">

                {/* =====================================
                    INSTITUTES
                ===================================== */}

                <div className="management-panel">

                    <h2>
                        {role === "admin"
                            ? "Institutes"
                            : "My Institute"}
                    </h2>

                    {classes.map((item) => (
                        <div
                            className={`management-row ${selectedClass?._id === item._id
                                    ? "is-selected"
                                    : ""
                                }`}
                            key={item._id}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    selectClass(item)
                                }
                            >
                                {item.name}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    editName(
                                        `/classes/${item._id}`,
                                        item.name,
                                        loadClasses
                                    )
                                }
                            >
                                Edit
                            </button>

                            {role === "admin" && (
                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        remove(
                                            `/classes/${item._id}`,
                                            loadClasses
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            )}

                        </div>
                    ))}

                    {classes.length === 0 && (
                        <p>
                            No institute profile found.
                        </p>
                    )}

                </div>

                {/* =====================================
                    COURSES
                ===================================== */}

                <div className="management-panel">

                    <h2>Courses</h2>

                    {!selectedClass && (
                        <p>
                            Select an institute first.
                        </p>
                    )}

                    {courses.map((course) => (
                        <div
                            className={`management-row ${selectedCourse?._id === course._id
                                    ? "is-selected"
                                    : ""
                                }`}
                            key={course._id}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    selectCourse(course)
                                }
                            >
                                {course.name}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    editName(
                                        `/courses/${course._id}`,
                                        course.name,
                                        refreshCourses
                                    )
                                }
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                    remove(
                                        `/courses/${course._id}`,
                                        refreshCourses
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>
                    ))}

                    {selectedClass && (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();

                                submit(
                                    "/courses",
                                    {
                                        ...courseForm,
                                        classId:
                                            selectedClass._id
                                    },
                                    () =>
                                        setCourseForm({
                                            name: "",
                                            fees: "",
                                            description: "",
                                            duration: ""
                                        }),
                                    refreshCourses
                                );
                            }}
                        >

                            <h3>Add Course</h3>

                            <input
                                placeholder="Name"
                                value={courseForm.name}
                                onChange={(event) =>
                                    setCourseForm({
                                        ...courseForm,
                                        name: event.target.value
                                    })
                                }
                                required
                            />

                            <input
                                type="number"
                                min="0"
                                placeholder="Fees"
                                value={courseForm.fees}
                                onChange={(event) =>
                                    setCourseForm({
                                        ...courseForm,
                                        fees: event.target.value
                                    })
                                }
                                required
                            />

                            <input
                                placeholder="Duration"
                                value={courseForm.duration}
                                onChange={(event) =>
                                    setCourseForm({
                                        ...courseForm,
                                        duration:
                                            event.target.value
                                    })
                                }
                            />

                            <textarea
                                placeholder="Description"
                                value={
                                    courseForm.description
                                }
                                onChange={(event) =>
                                    setCourseForm({
                                        ...courseForm,
                                        description:
                                            event.target.value
                                    })
                                }
                            />

                            <button
                                className="primary-btn"
                                type="submit"
                            >
                                Add Course
                            </button>

                        </form>
                    )}

                </div>

                {/* =====================================
                    SUBJECTS
                ===================================== */}

                <div className="management-panel">

                    <h2>Subjects</h2>

                    {!selectedCourse && (
                        <p>
                            Select a course first.
                        </p>
                    )}

                    {subjects.map((subject) => (
                        <div
                            className={`management-row ${selectedSubject?._id ===
                                    subject._id
                                    ? "is-selected"
                                    : ""
                                }`}
                            key={subject._id}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    selectSubject(subject)
                                }
                            >
                                {subject.name}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    editName(
                                        `/subjects/${subject._id}`,
                                        subject.name,
                                        refreshSubjects
                                    )
                                }
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                    remove(
                                        `/subjects/${subject._id}`,
                                        refreshSubjects
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>
                    ))}

                    {selectedCourse && (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();

                                submit(
                                    "/subjects",
                                    {
                                        ...subjectForm,
                                        courseId:
                                            selectedCourse._id
                                    },
                                    () =>
                                        setSubjectForm({
                                            name: "",
                                            description: ""
                                        }),
                                    refreshSubjects
                                );
                            }}
                        >

                            <h3>Add Subject</h3>

                            <input
                                placeholder="Name"
                                value={subjectForm.name}
                                onChange={(event) =>
                                    setSubjectForm({
                                        ...subjectForm,
                                        name: event.target.value
                                    })
                                }
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={
                                    subjectForm.description
                                }
                                onChange={(event) =>
                                    setSubjectForm({
                                        ...subjectForm,
                                        description:
                                            event.target.value
                                    })
                                }
                            />

                            <button
                                className="primary-btn"
                                type="submit"
                            >
                                Add Subject
                            </button>

                        </form>
                    )}

                </div>

                {/* =====================================
                    DEMO LECTURES
                ===================================== */}

                <div className="management-panel">

                    <h2>Demo Lectures</h2>

                    {!selectedSubject && (
                        <p>
                            Select a subject first.
                        </p>
                    )}

                    {selectedSubject?.demoLectures?.map(
                        (lecture) => (
                            <div
                                className="management-row"
                                key={lecture._id}
                            >

                                <span>
                                    {lecture.title}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        editDemoLecture(
                                            selectedSubject._id,
                                            lecture,
                                            refreshSubject
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        remove(
                                            `/subjects/${selectedSubject._id}/demos/${lecture._id}`,
                                            refreshSubject
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>
                        )
                    )}

                    {selectedSubject && (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();

                                submit(
                                    `/subjects/${selectedSubject._id}/demos`,
                                    demoForm,
                                    () =>
                                        setDemoForm({
                                            title: "",
                                            duration: "",
                                            videoUrl: ""
                                        }),
                                    refreshSubject
                                );
                            }}
                        >

                            <h3>Add Demo Lecture</h3>

                            <input
                                placeholder="Title"
                                value={demoForm.title}
                                onChange={(event) =>
                                    setDemoForm({
                                        ...demoForm,
                                        title: event.target.value
                                    })
                                }
                                required
                            />

                            <input
                                placeholder="Duration"
                                value={demoForm.duration}
                                onChange={(event) =>
                                    setDemoForm({
                                        ...demoForm,
                                        duration:
                                            event.target.value
                                    })
                                }
                            />

                            <input
                                type="url"
                                placeholder="Video URL"
                                value={
                                    demoForm.videoUrl
                                }
                                onChange={(event) =>
                                    setDemoForm({
                                        ...demoForm,
                                        videoUrl:
                                            event.target.value
                                    })
                                }
                            />

                            <button
                                className="primary-btn"
                                type="submit"
                            >
                                Add Lecture
                            </button>

                        </form>
                    )}

                </div>

            </section>

            {/* =====================================
                USERS — ADMIN ONLY
            ===================================== */}

            {role === "admin" && (
                <section className="management-panel users-panel">

                    <h2>Users</h2>

                    {users.map((user) => (
                        <div
                            className="management-row"
                            key={user.id}
                        >

                            <span>
                                {user.name}{" "}
                                <small>
                                    {user.email} · {user.role}
                                </small>
                            </span>

                            {user.id !== currentUser?.id && (
                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        remove(
                                            `/users/${user.id}`,
                                            loadUsers
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            )}

                        </div>
                    ))}

                </section>
            )}

        </main>
    );
}

export default ManagementDashboard;