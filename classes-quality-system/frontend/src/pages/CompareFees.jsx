import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CompareFees() {

    const [classes, setClasses] = useState([]);
    const [selected, setSelected] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/classes"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch classes"
                );
            }

            setClasses(data.classes || []);

        } catch (error) {
            console.error("Compare classes error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (classItem) => {

        const alreadySelected = selected.some(
            item => item._id === classItem._id
        );

        if (alreadySelected) {
            setSelected(
                selected.filter(
                    item => item._id !== classItem._id
                )
            );
            return;
        }

        if (selected.length >= 3) {
            return;
        }

        setSelected([...selected, classItem]);
    };

    const removeSelected = (id) => {
        setSelected(
            selected.filter(item => item._id !== id)
        );
    };

    if (loading) {
        return (
            <div className="compare-page">
                <div className="message">
                    Loading classes...
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

            {/* HEADER */}

            <div className="compare-header">

                <span className="compare-label">
                    SMART COMPARISON
                </span>

                <h1>
                    Compare Coaching Classes
                </h1>

                <p>
                    Select up to 3 coaching classes and compare
                    their details before making your decision.
                </p>

            </div>


            {/* SELECTED CLASSES */}

            {selected.length > 0 && (

                <div className="selected-section">

                    <div className="selected-heading">

                        <h2>
                            Selected Classes
                        </h2>

                        <span>
                            {selected.length} / 3 selected
                        </span>

                    </div>


                    <div className="selected-grid">

                        {selected.map((item) => (

                            <div
                                className="selected-card"
                                key={item._id}
                            >

                                <div>
                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        {item.location}
                                    </p>
                                </div>

                                <button
                                    className="remove-compare-btn"
                                    onClick={() =>
                                        removeSelected(item._id)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            )}


            {/* CLASS LIST */}

            <div className="compare-list-section">

                <div className="compare-list-heading">

                    <h2>
                        Choose Classes
                    </h2>

                    <p>
                        {selected.length < 3
                            ? "Select classes to add them to comparison."
                            : "Maximum 3 classes selected."}
                    </p>

                </div>


                {classes.length === 0 ? (

                    <div className="empty-state">
                        No classes available.
                    </div>

                ) : (

                    <div className="compare-class-grid">

                        {classes.map((item) => {

                            const isSelected =
                                selected.some(
                                    selectedItem =>
                                        selectedItem._id === item._id
                                );

                            return (

                                <div
                                    className={`compare-class-card ${isSelected
                                        ? "selected"
                                        : ""
                                        }`}
                                    key={item._id}
                                >

                                    <div className="compare-card-top">

                                        <div className="compare-icon">
                                            🏫
                                        </div>

                                        {isSelected && (
                                            <span className="selected-badge">
                                                Selected
                                            </span>
                                        )}

                                    </div>


                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p className="compare-location">
                                        📍 {item.location}
                                    </p>

                                    <p className="compare-description">
                                        {item.description}
                                    </p>


                                    <div className="compare-info">

                                        <span>
                                            📞 {item.contactNumber}
                                        </span>

                                    </div>


                                    <button
                                        className={
                                            isSelected
                                                ? "compare-selected-btn"
                                                : "compare-select-btn"
                                        }
                                        onClick={() =>
                                            handleSelect(item)
                                        }
                                        disabled={
                                            !isSelected &&
                                            selected.length >= 3
                                        }
                                    >

                                        {isSelected
                                            ? "✓ Added to Compare"
                                            : "Add to Compare"}

                                    </button>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>


            {/* COMPARISON */}

            {selected.length >= 2 && (

                <div className="comparison-section">

                    <div className="comparison-heading">

                        <span>
                            COMPARISON
                        </span>

                        <h2>
                            Compare Your Options
                        </h2>

                    </div>


                    <div className="comparison-table-wrapper">

                        <table className="comparison-table">

                            <thead>

                                <tr>

                                    <th>
                                        Details
                                    </th>

                                    {selected.map(item => (

                                        <th key={item._id}>
                                            {item.name}
                                        </th>

                                    ))}

                                </tr>

                            </thead>


                            <tbody>

                                <tr>

                                    <td>
                                        Location
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>
                                            {item.location || "Not available"}
                                        </td>

                                    ))}

                                </tr>


                                <tr>

                                    <td>
                                        Address
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>
                                            {item.address || "Not available"}
                                        </td>

                                    ))}

                                </tr>


                                <tr>

                                    <td>
                                        Contact
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>
                                            {item.contactNumber || "Not available"}
                                        </td>

                                    ))}

                                </tr>


                                <tr>

                                    <td>
                                        Website
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {item.website ? (

                                                <a
                                                    href={item.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Visit Website
                                                </a>

                                            ) : (
                                                "Not available"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                <tr>

                                    <td>
                                        Details
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            <Link
                                                to={`/classes/${item._id}`}
                                                className="compare-details-btn"
                                            >
                                                View Class →
                                            </Link>

                                        </td>

                                    ))}

                                </tr>

                            </tbody>

                        </table>

                    </div>

                    <p className="comparison-note">
                        💡 Course-wise fees and duration can be
                        compared from each class's course details.
                    </p>

                </div>

            )}

        </div>
    );
}

export default CompareFees;