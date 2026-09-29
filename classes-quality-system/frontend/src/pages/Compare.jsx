import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:8080/api";

function Compare() {
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [selected, setSelected] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const courseNames = [
        ...new Set(
            courses
                .map((course) => course.name)
                .filter(Boolean)
        )
    ];

    const matchingCourses = courseName
        ? courses.filter(
            (course) =>
                course.name.toLowerCase() ===
                courseName.toLowerCase()
        )
        : [];

    const toggleCourse = (course) => {
        const exists = selected.some(
            (item) => item._id === course._id
        );

        if (exists) {
            setSelected(
                selected.filter(
                    (item) => item._id !== course._id
                )
            );
            return;
        }

        if (selected.length >= 3) {
            return;
        }

        setSelected([...selected, course]);
    };

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

    if (loading) {
        return (
            <div className="compare-page">
                <div className="message">
                    Loading courses...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="compare-page">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="compare-page">

            <div className="compare-header">
                <span className="compare-label">
                    COURSE COMPARISON
                </span>

                <h1>
                    Compare Coaching Courses
                </h1>

                <p>
                    Compare the same course offered by
                    different institutes.
                </p>
            </div>

            <div className="compare-list-section">

                <div className="compare-list-heading">
                    <h2>
                        Select a Course
                    </h2>

                    <p>
                        Example: JEE, NEET, MHT-CET
                    </p>
                </div>

                <select
                    value={courseName}
                    onChange={(event) => {
                        setCourseName(event.target.value);
                        setSelected([]);
                    }}
                >
                    <option value="">
                        Select Course
                    </option>

                    {courseNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>

            </div>

            {courseName && (
                <div className="compare-list-section">

                    <h2>
                        {courseName} Courses
                    </h2>

                    {matchingCourses.length === 0 ? (
                        <p>
                            No institute offers this course.
                        </p>
                    ) : (
                        <div className="compare-class-grid">

                            {matchingCourses.map((course) => {

                                const institute =
                                    course.classId;

                                const isSelected =
                                    selected.some(
                                        (item) =>
                                            item._id ===
                                            course._id
                                    );

                                return (
                                    <div
                                        className="compare-class-card"
                                        key={course._id}
                                    >
                                        <h3>
                                            {institute?.name ||
                                                "Institute"}
                                        </h3>

                                        <p>
                                            📚 {course.name}
                                        </p>

                                        <p>
                                            📍{" "}
                                            {institute?.location ||
                                                "Location unavailable"}
                                        </p>

                                        <p>
                                            💰{" "}
                                            {formatFees(
                                                course.fees
                                            )}
                                        </p>

                                        <p>
                                            ⏱{" "}
                                            {course.duration ||
                                                "Not available"}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleCourse(
                                                    course
                                                )
                                            }
                                            disabled={
                                                !isSelected &&
                                                selected.length >= 3
                                            }
                                        >
                                            {isSelected
                                                ? "✓ Selected"
                                                : selected.length >= 3
                                                    ? "Maximum 3"
                                                    : "Add to Compare"}
                                        </button>
                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>
            )}

            {selected.length >= 2 && (
                <div className="comparison-section">

                    <div className="comparison-heading">
                        <h2>
                            {courseName} Comparison
                        </h2>

                        <p>
                            Compare the selected institutes
                            offering the same course.
                        </p>
                    </div>

                    <div className="comparison-table-wrapper">

                        <table className="comparison-table">

                            <thead>
                                <tr>
                                    <th>
                                        Comparison
                                    </th>

                                    {selected.map((course) => (
                                        <th key={course._id}>
                                            {course.classId?.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>
                                        Course
                                    </td>

                                    {selected.map((course) => (
                                        <td key={course._id}>
                                            {course.name}
                                        </td>
                                    ))}
                                </tr>

                                <tr>
                                    <td>
                                        Fees
                                    </td>

                                    {selected.map((course) => (
                                        <td key={course._id}>
                                            {formatFees(
                                                course.fees
                                            )}
                                        </td>
                                    ))}
                                </tr>

                                <tr>
                                    <td>
                                        Duration
                                    </td>

                                    {selected.map((course) => (
                                        <td key={course._id}>
                                            {course.duration ||
                                                "Not available"}
                                        </td>
                                    ))}
                                </tr>

                                <tr>
                                    <td>
                                        Location
                                    </td>

                                    {selected.map((course) => (
                                        <td key={course._id}>
                                            {course.classId?.location ||
                                                "Not available"}
                                        </td>
                                    ))}
                                </tr>

                                <tr>
                                    <td>
                                        Details
                                    </td>

                                    {selected.map((course) => (
                                        <td key={course._id}>
                                            <Link
                                                to={`/courses/${course._id}`}
                                            >
                                                View Course →
                                            </Link>
                                        </td>
                                    ))}
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Compare;