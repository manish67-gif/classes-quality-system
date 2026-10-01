import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/compare.css";

const API = "http://localhost:8080/api";

function Compare() {
    const [courses, setCourses] = useState([]);
    const [selected, setSelected] = useState([]);

    const [activeSlot, setActiveSlot] = useState(null);
    const [selectionStep, setSelectionStep] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);

    const [comparisonData, setComparisonData] = useState({});
    const [loading, setLoading] = useState(true);
    const [comparisonLoading, setComparisonLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================================
    // FETCH ALL COURSES
    // =========================================

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


    // =========================================
    // GET UNIQUE CLASSES
    // =========================================

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


    // =========================================
    // OPEN + BUTTON
    // =========================================

    const openAddSlot = (slotIndex) => {
        setActiveSlot(slotIndex);
        setSelectionStep("classes");
        setSelectedClass(null);
    };


    // =========================================
    // SELECT CLASS
    // =========================================

    const handleClassSelect = (institute) => {
        setSelectedClass(institute);
        setSelectionStep("courses");
    };


    // =========================================
    // SELECT COURSE
    // =========================================

    const handleCourseSelect = (course) => {
        if (activeSlot === null) {
            return;
        }

        const alreadySelected = selected.some(
            (item) => item._id === course._id
        );

        if (alreadySelected) {
            return;
        }

        /*
         * The first selected course determines
         * which course can be compared.
         *
         * Example:
         * JEE → JEE → JEE
         */
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

        setActiveSlot(null);
        setSelectionStep(null);
        setSelectedClass(null);
    };


    // =========================================
    // REMOVE COURSE
    // =========================================

    const removeCourse = (index) => {
        const updatedSelected = selected.filter(
            (_, itemIndex) => itemIndex !== index
        );

        setSelected(updatedSelected);

        /*
         * Remove old comparison data also.
         */
        setComparisonData((previous) => {
            const updated = { ...previous };

            if (selected[index]?._id) {
                delete updated[selected[index]._id];
            }

            return updated;
        });
    };


    // =========================================
    // CLOSE SELECTION
    // =========================================

    const closeSelection = () => {
        setActiveSlot(null);
        setSelectionStep(null);
        setSelectedClass(null);
    };


    // =========================================
    // GET COURSES OF SELECTED CLASS
    // =========================================

    const classCourses = selectedClass
        ? courses.filter(
            (course) =>
                course.classId?._id === selectedClass._id
        )
        : [];


    // =========================================
    // FORMAT FEES
    // =========================================

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


    // =========================================
    // FORMAT RATING
    // =========================================

    const formatRating = (rating) => {
        if (
            rating === undefined ||
            rating === null ||
            rating === ""
        ) {
            return "Not rated";
        }

        return Number(rating).toFixed(1);
    };


    // =========================================
    // FETCH REVIEWS FOR ONE COURSE
    // =========================================

    const fetchCourseReviewData = async (course) => {
        try {
            /*
             * First get subjects belonging to the course.
             */
            const subjectResponse = await fetch(
                `${API}/subjects/course/${course._id}`
            );

            const subjectData =
                await subjectResponse.json();

            if (!subjectResponse.ok) {
                throw new Error(
                    subjectData.message ||
                    "Failed to fetch subjects"
                );
            }

            const subjects =
                subjectData.subjects || [];

            /*
             * Get reviews for every subject.
             */
            const reviewRequests = subjects.map(
                async (subject) => {
                    const response = await fetch(
                        `${API}/reviews/subject/${subject._id}`
                    );

                    const data =
                        await response.json();

                    if (!response.ok) {
                        return [];
                    }

                    return data.reviews || [];
                }
            );

            const reviewResults =
                await Promise.all(reviewRequests);

            const reviews =
                reviewResults.flat();

            /*
             * No reviews.
             */
            if (reviews.length === 0) {
                return {
                    reviewCount: 0,
                    overallRating: null,
                    teachingQuality: null,
                    conceptClarity: null,
                    doubtSolving: null,
                    studyMaterial: null
                };
            }

            /*
             * Calculate average of every
             * review aspect.
             */
            const calculateAverage = (field) => {
                const total = reviews.reduce(
                    (sum, review) =>
                        sum + Number(review[field] || 0),
                    0
                );

                return (
                    total / reviews.length
                ).toFixed(1);
            };

            return {
                reviewCount: reviews.length,

                overallRating:
                    calculateAverage(
                        "overallRating"
                    ),

                teachingQuality:
                    calculateAverage(
                        "teachingQuality"
                    ),

                conceptClarity:
                    calculateAverage(
                        "conceptClarity"
                    ),

                doubtSolving:
                    calculateAverage(
                        "doubtSolving"
                    ),

                studyMaterial:
                    calculateAverage(
                        "studyMaterial"
                    )
            };

        } catch (error) {
            console.error(
                "Course review fetch error:",
                error
            );

            return {
                reviewCount: 0,
                overallRating: null,
                teachingQuality: null,
                conceptClarity: null,
                doubtSolving: null,
                studyMaterial: null
            };
        }
    };


    // =========================================
    // LOAD COMPARISON DATA
    // =========================================

    const loadComparisonData = async () => {
        if (selected.length < 2) {
            return;
        }

        try {
            setComparisonLoading(true);

            const results =
                await Promise.all(
                    selected.map(
                        async (course) => {
                            const reviewData =
                                await fetchCourseReviewData(
                                    course
                                );

                            return {
                                courseId:
                                    course._id,
                                reviewData
                            };
                        }
                    )
                );

            const newData = {};

            results.forEach((item) => {
                newData[item.courseId] =
                    item.reviewData;
            });

            setComparisonData(newData);

            setTimeout(() => {
                document
                    .getElementById(
                        "comparison-table"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }, 100);

        } catch (error) {
            console.error(
                "Comparison data error:",
                error
            );
        } finally {
            setComparisonLoading(false);
        }
    };


    // =========================================
    // GET REVIEW VALUE
    // =========================================

    const getReviewValue = (
        course,
        field
    ) => {
        const data =
            comparisonData[course._id];

        if (!data) {
            return "—";
        }

        if (
            data[field] === null ||
            data[field] === undefined
        ) {
            return "Not rated";
        }

        return (
            <>
                ⭐ {data[field]}
                <span className="rating-out-of">
                    /5
                </span>
            </>
        );
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="compare-page">
                <div className="compare-message">
                    Loading courses...
                </div>
            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

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

            {/* =================================
                HEADER
            ================================= */}

            <div className="compare-header">

                <span className="compare-label">
                    COURSE COMPARISON
                </span>

                <h1>
                    Compare Coaching Classes
                </h1>

                <p>
                    Compare the same course across
                    different institutes.
                </p>

            </div>


            {/* =================================
                COMPARISON BUILDER
            ================================= */}

            <div className="comparison-builder">

                <div className="comparison-items">

                    {selected.map(
                        (course, index) => (

                            <div
                                className="comparison-item-wrapper"
                                key={course._id}
                            >

                                <div className="comparison-item">

                                    <div className="comparison-item-number">
                                        {index + 1}
                                    </div>

                                    <div className="comparison-item-content">

                                        <span className="comparison-item-label">
                                            INSTITUTE
                                        </span>

                                        <h3>
                                            {
                                                course
                                                    .classId
                                                    ?.name ||
                                                "Institute"
                                            }
                                        </h3>

                                        <p>
                                            {course.name}
                                        </p>

                                        {course.classId?.location && (
                                            <small>
                                                📍{" "}
                                                {
                                                    course
                                                        .classId
                                                        .location
                                                }
                                            </small>
                                        )}

                                    </div>

                                    <button
                                        type="button"
                                        className="remove-item-button"
                                        onClick={() =>
                                            removeCourse(
                                                index
                                            )
                                        }
                                        title="Remove"
                                    >
                                        ×
                                    </button>

                                </div>


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
                        )
                    )}


                    {/* FIRST PLUS */}

                    {selected.length === 0 && (
                        <button
                            type="button"
                            className="plus-button first-plus"
                            onClick={() =>
                                openAddSlot(0)
                            }
                            title="Add course to compare"
                        >
                            <span>+</span>

                            <small>
                                Add Institute
                            </small>
                        </button>
                    )}

                </div>


                {/* =================================
                    SELECTION PANEL
                ================================= */}

                {selectionStep && (

                    <div className="selection-panel">

                        {/* CLASS LIST */}

                        {selectionStep === "classes" && (

                            <div className="selection-content">

                                <div className="selection-title-row">

                                    <div>

                                        <span className="selection-step">
                                            STEP 1
                                        </span>

                                        <h2>
                                            Select Institute
                                        </h2>

                                        <p>
                                            Choose a coaching
                                            class to compare.
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
                                            No institutes
                                            available.
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
                                                                institute
                                                                    .name
                                                            }
                                                        </strong>

                                                        {institute.location && (
                                                            <small>
                                                                📍{" "}
                                                                {
                                                                    institute
                                                                        .location
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


                        {/* COURSE LIST */}

                        {selectionStep === "courses" && (

                            <div className="selection-content">

                                <div className="selection-title-row">

                                    <div>

                                        <span className="selection-step">
                                            STEP 2
                                        </span>

                                        <h2>
                                            Select Course
                                        </h2>

                                        <p>
                                            {
                                                selectedClass
                                                    ?.name
                                            }
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

                                    {classCourses.length === 0 ? (

                                        <p className="empty-selection">
                                            This institute has
                                            no courses yet.
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
                                                                : differentCourse
                                                                    ? "—"
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


                {/* =================================
                    COMPARE BUTTON
                ================================= */}

                {selected.length >= 2 && (

                    <button
                        type="button"
                        className="compare-button"
                        onClick={
                            loadComparisonData
                        }
                        disabled={
                            comparisonLoading
                        }
                    >

                        {comparisonLoading
                            ? "Loading comparison..."
                            : "Compare Selected Classes"}

                    </button>
                )}

            </div>


            {/* =================================
                COMPARISON RESULT
            ================================= */}

            {selected.length >= 2 && (

                <section
                    className="comparison-result"
                    id="comparison-table"
                >

                    <div className="comparison-result-header">

                        <span>
                            COMPARISON RESULT
                        </span>

                        <h2>
                            Compare Side by Side
                        </h2>

                        <p>
                            Compare fees, course details,
                            ratings and student feedback.
                        </p>

                    </div>


                    {/* SELECTED INSTITUTE CARDS */}

                    <div className="comparison-summary">

                        {selected.map(
                            (course) => (

                                <div
                                    className="summary-card"
                                    key={course._id}
                                >

                                    <div className="summary-icon">
                                        🎓
                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                course
                                                    .classId
                                                    ?.name
                                            }
                                        </h3>

                                        <p>
                                            {course.name}
                                        </p>

                                    </div>

                                </div>
                            )
                        )}

                    </div>


                    {/* TABLE */}

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

                                {/* COURSE DETAILS */}

                                <tr className="table-section-row">

                                    <td colSpan={
                                        selected.length + 1
                                    }>
                                        COURSE DETAILS
                                    </td>

                                </tr>


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
                                                <strong>
                                                    {formatFees(
                                                        course.fees
                                                    )}
                                                </strong>
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
                                                {
                                                    course.duration ||
                                                    "Not available"
                                                }
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
                                                {
                                                    course
                                                        .classId
                                                        ?.location ||
                                                    "Not available"
                                                }
                                            </td>
                                        )
                                    )}

                                </tr>


                                {/* REVIEW SECTION */}

                                <tr className="table-section-row">

                                    <td colSpan={
                                        selected.length + 1
                                    }>
                                        STUDENT REVIEWS & RATINGS
                                    </td>

                                </tr>


                                {/* OVERALL */}

                                <tr className="rating-row">

                                    <td>
                                        Overall Rating
                                    </td>

                                    {selected.map(
                                        (course) => (
                                            <td
                                                key={
                                                    course._id
                                                }
                                                className="rating-value-cell"
                                            >
                                                {getReviewValue(
                                                    course,
                                                    "overallRating"
                                                )}
                                            </td>
                                        )
                                    )}

                                </tr>


                                {/* TEACHING */}

                                <tr>

                                    <td>
                                        Teaching Quality
                                    </td>

                                    {selected.map(
                                        (course) => (
                                            <td
                                                key={
                                                    course._id
                                                }
                                                className="rating-value-cell"
                                            >
                                                {getReviewValue(
                                                    course,
                                                    "teachingQuality"
                                                )}
                                            </td>
                                        )
                                    )}

                                </tr>


                                {/* CONCEPT */}

                                <tr>

                                    <td>
                                        Concept Clarity
                                    </td>

                                    {selected.map(
                                        (course) => (
                                            <td
                                                key={
                                                    course._id
                                                }
                                                className="rating-value-cell"
                                            >
                                                {getReviewValue(
                                                    course,
                                                    "conceptClarity"
                                                )}
                                            </td>
                                        )
                                    )}

                                </tr>


                                {/* DOUBT */}

                                <tr>

                                    <td>
                                        Doubt Solving
                                    </td>

                                    {selected.map(
                                        (course) => (
                                            <td
                                                key={
                                                    course._id
                                                }
                                                className="rating-value-cell"
                                            >
                                                {getReviewValue(
                                                    course,
                                                    "doubtSolving"
                                                )}
                                            </td>
                                        )
                                    )}

                                </tr>


                                {/* STUDY MATERIAL */}

                                <tr>

                                    <td>
                                        Study Material
                                    </td>

                                    {selected.map(
                                        (course) => (
                                            <td
                                                key={
                                                    course._id
                                                }
                                                className="rating-value-cell"
                                            >
                                                {getReviewValue(
                                                    course,
                                                    "studyMaterial"
                                                )}
                                            </td>
                                        )
                                    )}

                                </tr>


                                {/* REVIEW COUNT */}

                                <tr>

                                    <td>
                                        Student Reviews
                                    </td>

                                    {selected.map(
                                        (course) => {

                                            const data =
                                                comparisonData[
                                                course._id
                                                ];

                                            return (
                                                <td
                                                    key={
                                                        course._id
                                                    }
                                                >
                                                    {data
                                                        ? data.reviewCount
                                                        : "—"}
                                                    {" "}
                                                    {data?.reviewCount === 1
                                                        ? "review"
                                                        : "reviews"}
                                                </td>
                                            );
                                        }
                                    )}

                                </tr>


                                {/* DETAILS */}

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


                    {/* NOTE */}

                    <div className="comparison-note">

                        <strong>
                            How ratings are calculated
                        </strong>

                        <p>
                            Review ratings shown here are
                            averages of student reviews
                            across the subjects belonging
                            to each selected course.
                        </p>

                    </div>

                </section>
            )}

        </div>
    );
}

export default Compare;