import React, { useMemo, useState } from "react";

function DemoLectures() {
    const [search, setSearch] = useState("");
    const [selectedInstitute, setSelectedInstitute] = useState("All Institutes");
    const [selectedCourse, setSelectedCourse] = useState("All Courses");

    const [openInstitutes, setOpenInstitutes] = useState({});
    const [openCourses, setOpenCourses] = useState({});

    /*
    =====================================================
    DATA STRUCTURE

    Institute
        └── Course
              └── Subject
                    └── Demo Lectures
    =====================================================
    */

    const institutes = [
        {
            id: 1,
            name: "Apex Coaching Institute",
            location: "Delhi",
            courses: [
                {
                    id: 101,
                    name: "JEE Main & Advanced",
                    subjects: [
                        {
                            id: 1001,
                            name: "Physics",
                            icon: "⚛️",
                            lectures: [
                                {
                                    id: 1,
                                    title: "Introduction to Laws of Motion",
                                    duration: "32 min",
                                },
                                {
                                    id: 2,
                                    title: "Work, Energy and Power",
                                    duration: "40 min",
                                },
                            ],
                        },
                        {
                            id: 1002,
                            name: "Mathematics",
                            icon: "📐",
                            lectures: [
                                {
                                    id: 3,
                                    title: "Understanding Quadratic Equations",
                                    duration: "28 min",
                                },
                                {
                                    id: 4,
                                    title: "Trigonometry Basics",
                                    duration: "25 min",
                                },
                            ],
                        },
                        {
                            id: 1003,
                            name: "Chemistry",
                            icon: "🧪",
                            lectures: [
                                {
                                    id: 5,
                                    title: "Basics of Chemical Reactions",
                                    duration: "35 min",
                                },
                            ],
                        },
                    ],
                },

                {
                    id: 102,
                    name: "NEET Preparation",
                    subjects: [
                        {
                            id: 1004,
                            name: "Biology",
                            icon: "🧬",
                            lectures: [
                                {
                                    id: 6,
                                    title: "Introduction to Human Biology",
                                    duration: "30 min",
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        {
            id: 2,
            name: "Bright Future Academy",
            location: "Mumbai",
            courses: [
                {
                    id: 201,
                    name: "Class 10 Foundation",
                    subjects: [
                        {
                            id: 2001,
                            name: "Mathematics",
                            icon: "📐",
                            lectures: [
                                {
                                    id: 7,
                                    title: "Real Numbers - Basic Concepts",
                                    duration: "26 min",
                                },
                                {
                                    id: 8,
                                    title: "Introduction to Geometry",
                                    duration: "31 min",
                                },
                            ],
                        },
                        {
                            id: 2002,
                            name: "Science",
                            icon: "🔬",
                            lectures: [
                                {
                                    id: 9,
                                    title: "Introduction to Chemical Reactions",
                                    duration: "29 min",
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        {
            id: 3,
            name: "Scholars Academy",
            location: "Bangalore",
            courses: [
                {
                    id: 301,
                    name: "IIT Foundation",
                    subjects: [
                        {
                            id: 3001,
                            name: "Physics",
                            icon: "⚡",
                            lectures: [
                                {
                                    id: 10,
                                    title: "Understanding Motion",
                                    duration: "34 min",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    /* =====================================================
       FILTER OPTIONS
    ===================================================== */

    const allCourses = [
        ...new Set(
            institutes.flatMap((institute) =>
                institute.courses.map((course) => course.name)
            )
        ),
    ];

    /* =====================================================
       FILTER DATA
    ===================================================== */

    const filteredInstitutes = useMemo(() => {
        return institutes
            .filter((institute) => {
                if (selectedInstitute === "All Institutes") {
                    return true;
                }

                return institute.name === selectedInstitute;
            })
            .map((institute) => ({
                ...institute,

                courses: institute.courses
                    .filter((course) => {
                        if (selectedCourse === "All Courses") {
                            return true;
                        }

                        return course.name === selectedCourse;
                    })
                    .map((course) => ({
                        ...course,

                        subjects: course.subjects
                            .map((subject) => ({
                                ...subject,

                                lectures: subject.lectures.filter((lecture) => {
                                    if (!search.trim()) {
                                        return true;
                                    }

                                    const value =
                                        `${lecture.title} ${subject.name} ${course.name} ${institute.name}`
                                            .toLowerCase();

                                    return value.includes(search.toLowerCase());
                                }),
                            }))
                            .filter((subject) => subject.lectures.length > 0),
                    }))
                    .filter((course) => course.subjects.length > 0),
            }))
            .filter((institute) => institute.courses.length > 0);
    }, [search, selectedInstitute, selectedCourse]);

    /* =====================================================
       TOGGLE FUNCTIONS
    ===================================================== */

    const toggleInstitute = (id) => {
        setOpenInstitutes((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleCourse = (id) => {
        setOpenCourses((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="demo-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="demo-header">

                <span className="small-title">
                    LEARN BEFORE YOU CHOOSE
                </span>

                <h1>
                    Demo Lectures
                </h1>

                <p>
                    Explore demo lectures from different institutes,
                    courses and subjects before choosing where to learn.
                </p>

            </div>


            {/* =================================================
                INFO
            ================================================= */}

            <div className="demo-info">

                <div className="demo-info-icon">
                    ▶
                </div>

                <div>
                    <h3>
                        Try a demo before joining
                    </h3>

                    <p>
                        Watch sample lectures and understand the teaching
                        style, course structure and subjects offered by each institute.
                    </p>
                </div>

            </div>


            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div className="demo-filters">

                <div className="demo-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search lectures, subjects or courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>


                <select
                    value={selectedInstitute}
                    onChange={(e) => setSelectedInstitute(e.target.value)}
                >
                    <option>
                        All Institutes
                    </option>

                    {institutes.map((institute) => (
                        <option
                            key={institute.id}
                            value={institute.name}
                        >
                            {institute.name}
                        </option>
                    ))}
                </select>


                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option>
                        All Courses
                    </option>

                    {allCourses.map((course) => (
                        <option
                            key={course}
                            value={course}
                        >
                            {course}
                        </option>
                    ))}
                </select>

            </div>


            {/* =================================================
                INSTITUTES
            ================================================= */}

            <div className="institute-list">

                {filteredInstitutes.map((institute) => {

                    const instituteOpen =
                        openInstitutes[institute.id] !== false;

                    return (

                        <section
                            className="institute-section"
                            key={institute.id}
                        >

                            {/* INSTITUTE HEADER */}

                            <div
                                className="institute-header"
                                onClick={() =>
                                    toggleInstitute(institute.id)
                                }
                            >

                                <div className="institute-heading">

                                    <div className="institute-icon">
                                        🏫
                                    </div>

                                    <div>

                                        <h2>
                                            {institute.name}
                                        </h2>

                                        <span>
                                            {institute.location}
                                        </span>

                                    </div>

                                </div>


                                <button
                                    className="collapse-btn"
                                    type="button"
                                >
                                    {instituteOpen ? "−" : "+"}
                                </button>

                            </div>


                            {/* COURSES */}

                            {instituteOpen && (

                                <div className="course-list">

                                    {institute.courses.map((course) => {

                                        const courseOpen =
                                            openCourses[course.id] !== false;

                                        return (

                                            <div
                                                className="course-section"
                                                key={course.id}
                                            >

                                                {/* COURSE HEADER */}

                                                <div
                                                    className="course-header"
                                                    onClick={() =>
                                                        toggleCourse(course.id)
                                                    }
                                                >

                                                    <div>

                                                        <span className="course-label">
                                                            COURSE
                                                        </span>

                                                        <h3>
                                                            {course.name}
                                                        </h3>

                                                    </div>

                                                    <button
                                                        className="course-toggle"
                                                        type="button"
                                                    >
                                                        {courseOpen ? "⌃" : "⌄"}
                                                    </button>

                                                </div>


                                                {/* SUBJECTS */}

                                                {courseOpen && (

                                                    <div className="subject-list">

                                                        {course.subjects.map(
                                                            (subject) => (

                                                                <div
                                                                    className="subject-group"
                                                                    key={subject.id}
                                                                >

                                                                    {/* SUBJECT TITLE */}

                                                                    <div className="subject-heading">

                                                                        <span className="subject-icon">
                                                                            {subject.icon}
                                                                        </span>

                                                                        <div>

                                                                            <h4>
                                                                                {subject.name}
                                                                            </h4>

                                                                            <span>
                                                                                {subject.lectures.length} demo
                                                                                {subject.lectures.length > 1
                                                                                    ? " lectures"
                                                                                    : " lecture"}
                                                                            </span>

                                                                        </div>

                                                                    </div>


                                                                    {/* LECTURES */}

                                                                    <div className="compact-lectures">

                                                                        {subject.lectures.map(
                                                                            (lecture) => (

                                                                                <div
                                                                                    className="compact-lecture"
                                                                                    key={lecture.id}
                                                                                >

                                                                                    <div className="compact-lecture-left">

                                                                                        <div className="lecture-mini-icon">
                                                                                            {subject.icon}
                                                                                        </div>

                                                                                        <div className="compact-lecture-info">

                                                                                            <h5>
                                                                                                {lecture.title}
                                                                                            </h5>

                                                                                            <div className="compact-meta">

                                                                                                <span>
                                                                                                    ▶ Demo Lecture
                                                                                                </span>

                                                                                                <span>
                                                                                                    ⏱ {lecture.duration}
                                                                                                </span>

                                                                                            </div>

                                                                                        </div>

                                                                                    </div>


                                                                                    <button
                                                                                        className="compact-watch-btn"
                                                                                        type="button"
                                                                                    >
                                                                                        <span>
                                                                                            ▶
                                                                                        </span>

                                                                                        Watch
                                                                                    </button>

                                                                                </div>

                                                                            )
                                                                        )}

                                                                    </div>

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                )}

                                            </div>

                                        );
                                    })}

                                </div>

                            )}

                        </section>

                    );
                })}

            </div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredInstitutes.length === 0 && (

                <div className="demo-empty">

                    <div>
                        🔍
                    </div>

                    <h3>
                        No demo lectures found
                    </h3>

                    <p>
                        Try searching for another lecture, subject,
                        course or institute.
                    </p>

                </div>

            )}

        </div>
    );
}

export default DemoLectures;