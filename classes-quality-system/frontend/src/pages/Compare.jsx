import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Compare.css";

const API = "http://localhost:8080/api";

function Compare() {
    const [courses, setCourses] = useState([]);

    // Courses selected for comparison
    const [selected, setSelected] = useState([]);

    // Which + button is currently open
    const [activeSlot, setActiveSlot] = useState(null);

    // Selection step:
    // "classes" = show classes
    // "courses" = show courses
    const [selectionStep, setSelectionStep] = useState(null);

    // Class selected inside the current selection
    const [selectedClass, setSelectedClass] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ----------------------------------------
    // FETCH COURSES
    // ----------------------------------------

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API}/courses`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch courses"
                );
            }

            setCourses(data.courses || []);
        } catch (error) {
            console.error("Fetch courses error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);


    // ----------------------------------------
    // GET UNIQUE CLASSES
    // ----------------------------------------

    const classes = [];

    courses.forEach((course) => {
        const institute = course.classId;

        if (!institute?._id) {
            return;
        }

        const alreadyExists = classes.some(
            (item) => item._id === institute._id
        );

        if (!alreadyExists) {
            classes.push(institute);
        }
    });


    // ----------------------------------------
    // OPEN + BUTTON
    // ----------------------------------------

    const openAddSlot = (slotIndex) => {
        setActiveSlot(slotIndex);
        setSelectionStep("classes");
        setSelectedClass(null);
    };


    // ----------------------------------------
    // SELECT CLASS
    // ----------------------------------------

    const handleClassSelect = (institute) => {
        setSelectedClass(institute);
        setSelectionStep("courses");
    };


    // ----------------------------------------
    // SELECT COURSE
    // ----------------------------------------

    const handleCourseSelect = (course) => {
        if (activeSlot === null) {
            return;
        }

        // Do not allow the exact same course
        // from the same institute twice
        const alreadySelected = selected.some(
            (item) => item._id === course._id
        );

        if (alreadySelected) {
            return;
        }

        // First course determines what course
        // can be compared afterwards.
        if (
            selected.length > 0 &&
            course.name.toLowerCase() !==
            selected[0].name.toLowerCase()
        ) {
            return;
        }

        const updatedSelected = [...selected];

        updatedSelected[activeSlot] = course;

        setSelected(updatedSelected);

        // Close selection panel
        setActiveSlot(null);
        setSelectionStep(null);
        setSelectedClass(null);
    };


    // ----------------------------------------
    // REMOVE SELECTED COURSE
    // ----------------------------------------

    const removeCourse = (index) => {
        const updatedSelected = selected.filter(
            (_, itemIndex) => itemIndex !== index
        );

        setSelected(updatedSelected);
    };


    // ----------------------------------------
    // CLOSE SELECTION
    // ----------------------------------------

    const closeSelection = () => {
        setActiveSlot(null);
        setSelectionStep(null);
        setSelectedClass(null);
    };


    // ----------------------------------------
    // GET COURSES OF SELECTED CLASS
    // ----------------------------------------

    const classCourses = selectedClass
        ? courses.filter(
            (course) =>
                course.classId?._id === selectedClass._id
        )
        : [];


    // ----------------------------------------
    // FORMAT FEES
    // ----------------------------------------

    const formatFees = (fees) => {
        if (
            fees === undefined ||
            fees === null ||
            fees === ""
        ) {
            return "Not available";
        }

        return `₹${Number(fees).toLocaleString("en-IN")}`;
    };


    // ----------------------------------------
    // LOADING
    // ----------------------------------------

    if (loading) {
        return (
            <div className="compare-page">
                <div className="compare-message">
                    Loading courses...
                </div>
            </div>
        );
    }


    // ----------------------------------------
    // ERROR
    // ----------------------------------------

    if (error) {
        return (
            <div className="compare-page">
                <div className="compare-error">
                    {error}
                </div>
            </div>
        );
    }


    return (
        <div className="compare-page">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="compare-header">

                <span className="compare-label">
                    COURSE COMPARISON
                </span>

                <h1>Compare</h1>

                <p>
                    Compare the same course across
                    different institutes.
                </p>

            </div>


            {/* ==================================
                COMPARISON HIERARCHY
            ================================== */}

            <div className="comparison-builder">

                {/* --------------------------------
                    SELECTED COURSES
                -------------------------------- */}

                <div className="comparison-items">

                    {selected.map((course, index) => (

                        <div
                            className="comparison-item-wrapper"
                            key={course._id}
                        >

                            <div className="comparison-item">

                                <div className="comparison-item-number">
                                    {index + 1}
                                </div>

                                <div className="comparison-item-content">

                                    <h3>
                                        {course.name}
                                    </h3>

                                    <p>
                                        {course.classId?.name ||
                                            "Institute"}
                                    </p>

                                    {course.classId?.location && (
                                        <small>
                                            {
                                                course.classId
                                                    .location
                                            }
                                        </small>
                                    )}

                                </div>

                                <button
                                    type="button"
                                    className="remove-item-button"
                                    onClick={() =>
                                        removeCourse(index)
                                    }
                                    title="Remove"
                                >
                                    ×
                                </button>

                            </div>


                            {/* PLUS AFTER EVERY SELECTED COURSE */}

                            {selected.length < 3 && (
                                <div className="plus-connector">

                                    <span className="connector-line"></span>

                                    <button
                                        type="button"
                                        className="plus-button small-plus"
                                        onClick={() =>
                                            openAddSlot(
                                                index + 1
                                            )
                                        }
                                        title="Add another course"
                                    >
                                        +
                                    </button>

                                </div>
                            )}

                        </div>

                    ))}


                    {/* --------------------------------
                        FIRST PLUS
                        --------------------------------
                        Show when no course has been
                        selected.
                    -------------------------------- */}

                    {selected.length === 0 && (
                        <button
                            type="button"
                            className="plus-button first-plus"
                            onClick={() => openAddSlot(0)}
                            title="Add course to compare"
                        >
                            +
                        </button>
                    )}

                </div>


                {/* ==================================
                    SELECTION PANEL
                ================================== */}

                {selectionStep && (

                    <div className="selection-panel">

                        {/* --------------------------------
                            CLASS LIST
                        -------------------------------- */}

                        {selectionStep === "classes" && (

                            <div className="selection-content">

                                <div className="selection-title-row">

                                    <div>
                                        <span className="selection-step">
                                            STEP 1
                                        </span>

                                        <h2>
                                            List of Classes
                                        </h2>

                                        <p>
                                            Select an institute.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="close-selection"
                                        onClick={
                                            closeSelection
                                        }
                                    >
                                        ×
                                    </button>

                                </div>


                                <div className="selection-list">

                                    {classes.length === 0 ? (
                                        <p className="empty-selection">
                                            No classes available.
                                        </p>
                                    ) : (

                                        classes.map(
                                            (institute) => (

                                                <button
                                                    type="button"
                                                    className="selection-list-item"
                                                    key={
                                                        institute._id
                                                    }
                                                    onClick={() =>
                                                        handleClassSelect(
                                                            institute
                                                        )
                                                    }
                                                >

                                                    <div>

                                                        <strong>
                                                            {
                                                                institute.name
                                                            }
                                                        </strong>

                                                        {institute.location && (
                                                            <small>
                                                                {
                                                                    institute.location
                                                                }
                                                            </small>
                                                        )}

                                                    </div>

                                                    <span>
                                                        →
                                                    </span>

                                                </button>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                        )}


                        {/* --------------------------------
                            COURSE LIST
                        -------------------------------- */}

                        {selectionStep === "courses" && (

                            <div className="selection-content">

                                <div className="selection-title-row">

                                    <div>

                                        <span className="selection-step">
                                            STEP 2
                                        </span>

                                        <h2>
                                            List of Courses
                                        </h2>

                                        <p>
                                            {selectedClass?.name}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="back-selection"
                                        onClick={() => {
                                            setSelectionStep(
                                                "classes"
                                            );
                                            setSelectedClass(
                                                null
                                            );
                                        }}
                                    >
                                        ←
                                    </button>

                                </div>


                                <div className="selection-list">

                                    {classCourses.length ===
                                        0 ? (

                                        <p className="empty-selection">
                                            This class has no
                                            courses yet.
                                        </p>

                                    ) : (

                                        classCourses.map(
                                            (course) => {

                                                const alreadySelected =
                                                    selected.some(
                                                        (item) =>
                                                            item._id ===
                                                            course._id
                                                    );

                                                const differentCourse =
                                                    selected.length >
                                                    0 &&
                                                    course.name.toLowerCase() !==
                                                    selected[0].name.toLowerCase();

                                                const disabled =
                                                    alreadySelected ||
                                                    differentCourse;

                                                return (

                                                    <button
                                                        type="button"
                                                        key={
                                                            course._id
                                                        }
                                                        className={
                                                            disabled
                                                                ? "selection-list-item course-selection disabled"
                                                                : "selection-list-item course-selection"
                                                        }
                                                        disabled={
                                                            disabled
                                                        }
                                                        onClick={() =>
                                                            handleCourseSelect(
                                                                course
                                                            )
                                                        }
                                                    >

                                                        <div>

                                                            <strong>
                                                                {
                                                                    course.name
                                                                }
                                                            </strong>

                                                            <small>
                                                                Fees:{" "}
                                                                {formatFees(
                                                                    course.fees
                                                                )}

                                                                {course.duration &&
                                                                    ` • ${course.duration}`}
                                                            </small>

                                                        </div>

                                                        <span>
                                                            {alreadySelected
                                                                ? "✓"
                                                                : "+"}
                                                        </span>

                                                    </button>

                                                );
                                            }
                                        )

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* ==================================
                    COMPARE BUTTON
                ================================== */}

                {selected.length >= 2 && (
                    <button
                        type="button"
                        className="compare-button"
                        onClick={() =>
                            document
                                .getElementById(
                                    "comparison-table"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        Compare
                    </button>
                )}

            </div>


            {/* ==================================
                COMPARISON TABLE
            ================================== */}

            {selected.length >= 2 && (

                <section
                    className="comparison-result"
                    id="comparison-table"
                >

                    <div className="comparison-result-header">

                        <span>
                            RESULT
                        </span>

                        <h2>
                            Comparison Table
                        </h2>

                        <p>
                            Compare the selected institutes
                            for the same course.
                        </p>

                    </div>


                    <div className="table-container">

                        <table className="comparison-table">

                            <thead>

                                <tr>

                                    <th>
                                        Feature
                                    </th>

                                    {selected.map(
                                        (course) => (

                                            <th
                                                key={
                                                    course._id
                                                }
                                            >

                                                <div>
                                                    {
                                                        course
                                                            .classId
                                                            ?.name
                                                    }
                                                </div>

                                                <small>
                                                    {
                                                        course.name
                                                    }
                                                </small>

                                            </th>

                                        )
                                    )}

                                </tr>

                            </thead>


                            <tbody>

                                <tr>

                                    <td>
                                        Course
                                    </td>

                                    {selected.map(
                                        (course) => (

                                            <td
                                                key={
                                                    course._id
                                                }
                                            >
                                                {
                                                    course.name
                                                }
                                            </td>

                                        )
                                    )}

                                </tr>


                                <tr>

                                    <td>
                                        Fees
                                    </td>

                                    {selected.map(
                                        (course) => (

                                            <td
                                                key={
                                                    course._id
                                                }
                                            >
                                                {formatFees(
                                                    course.fees
                                                )}
                                            </td>

                                        )
                                    )}

                                </tr>


                                <tr>

                                    <td>
                                        Duration
                                    </td>

                                    {selected.map(
                                        (course) => (

                                            <td
                                                key={
                                                    course._id
                                                }
                                            >
                                                {course.duration ||
                                                    "Not available"}
                                            </td>

                                        )
                                    )}

                                </tr>


                                <tr>

                                    <td>
                                        Location
                                    </td>

                                    {selected.map(
                                        (course) => (

                                            <td
                                                key={
                                                    course._id
                                                }
                                            >
                                                {course
                                                    .classId
                                                    ?.location ||
                                                    "Not available"}
                                            </td>

                                        )
                                    )}

                                </tr>


                                <tr>

                                    <td>
                                        Details
                                    </td>

                                    {selected.map(
                                        (course) => (

                                            <td
                                                key={
                                                    course._id
                                                }
                                            >

                                                <Link
                                                    to={`/courses/${course._id}`}
                                                    className="view-course-link"
                                                >
                                                    View Course →
                                                </Link>

                                            </td>

                                        )
                                    )}

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </section>

            )}

        </div>
    );
}

export default Compare;