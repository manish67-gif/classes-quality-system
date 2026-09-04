import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Compare() {

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


    /* =========================================
       SELECT / REMOVE CLASS
    ========================================= */

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

        setSelected([
            ...selected,
            classItem
        ]);
    };


    const removeSelected = (id) => {

        setSelected(
            selected.filter(
                item => item._id !== id
            )
        );
    };


    /* =========================================
       VALUE FORMATTERS
    ========================================= */

    const getValue = (item, field) => {

        const value = item[field];

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "Not available";
        }

        return value;
    };


    const getRating = (item) => {

        if (
            item.rating === undefined ||
            item.rating === null ||
            item.rating === ""
        ) {
            return "Not available";
        }

        return `⭐ ${item.rating}`;
    };


    const getFees = (item) => {

        if (
            item.fees === undefined ||
            item.fees === null ||
            item.fees === ""
        ) {
            return "Not available";
        }

        const fees = Number(item.fees);

        if (Number.isNaN(fees)) {
            return item.fees;
        }

        return `₹${fees.toLocaleString("en-IN")}`;
    };


    const getBooleanValue = (value) => {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "Not available";
        }

        if (typeof value === "boolean") {
            return value ? "✓ Available" : "✕ Not Available";
        }

        return value;
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

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="compare-header">

                <span className="compare-label">
                    SMART COMPARISON
                </span>

                <h1>
                    Compare Coaching Classes
                </h1>

                <p>
                    Compare important factors like fees,
                    ratings, study material, test series,
                    doubt support and exam preparation.
                </p>

            </div>


            {/* =========================================
                SELECTED CLASSES
            ========================================= */}

            {selected.length > 0 && (

                <div className="selected-section">

                    <div className="selected-heading">

                        <div>
                            <h2>
                                Selected Classes
                            </h2>

                            <p className="selected-subtitle">
                                Compare up to 3 institutes
                            </p>
                        </div>

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

                                <div className="selected-card-info">

                                    <div className="selected-mini-icon">
                                        🏫
                                    </div>

                                    <div>

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <p>
                                            📍 {item.location || "Location unavailable"}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="remove-compare-btn"
                                    type="button"
                                    onClick={() =>
                                        removeSelected(item._id)
                                    }
                                    aria-label={`Remove ${item.name}`}
                                >
                                    ×
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            )}


            {/* =========================================
                CLASS LIST
            ========================================= */}

            <div className="compare-list-section">

                <div className="compare-list-heading">

                    <div>

                        <span className="compare-section-label">
                            SELECT INSTITUTES
                        </span>

                        <h2>
                            Choose Classes
                        </h2>

                        <p>
                            Select 2 or 3 classes to compare them
                            side by side.
                        </p>

                    </div>

                    <div className="compare-limit">

                        <strong>
                            {selected.length}
                        </strong>
                        <span>/ 3</span>

                    </div>

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

                            const maximumReached =
                                selected.length >= 3 &&
                                !isSelected;

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
                                                ✓ Selected
                                            </span>

                                        )}

                                    </div>


                                    <h3>
                                        {item.name}
                                    </h3>


                                    <p className="compare-location">
                                        📍{" "}
                                        {item.location ||
                                            "Location unavailable"}
                                    </p>


                                    <p className="compare-description">

                                        {item.description ||
                                            "No description available."}

                                    </p>


                                    {/* QUICK INFO */}

                                    <div className="compare-quick-info">

                                        <div>
                                            <span>
                                                Rating
                                            </span>

                                            <strong>
                                                {getRating(item)}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Fees
                                            </span>

                                            <strong>
                                                {getFees(item)}
                                            </strong>
                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        className={
                                            isSelected
                                                ? "compare-selected-btn"
                                                : "compare-select-btn"
                                        }
                                        onClick={() =>
                                            handleSelect(item)
                                        }
                                        disabled={maximumReached}
                                    >

                                        {isSelected
                                            ? "✓ Added to Compare"
                                            : maximumReached
                                                ? "Maximum 3 Selected"
                                                : "Add to Compare"}

                                    </button>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>


            {/* =========================================
                COMPARISON
            ========================================= */}

            {selected.length >= 2 && (

                <div className="comparison-section">

                    <div className="comparison-heading">

                        <span>
                            SIDE-BY-SIDE COMPARISON
                        </span>

                        <h2>
                            Compare Your Options
                        </h2>

                        <p>
                            See which coaching institute fits
                            your requirements best.
                        </p>

                    </div>


                    <div className="comparison-table-wrapper">

                        <table className="comparison-table">

                            <thead>

                                <tr>

                                    <th className="comparison-aspect">
                                        Comparison
                                    </th>

                                    {selected.map(item => (

                                        <th key={item._id}>

                                            <div className="comparison-institute">

                                                <div className="comparison-institute-icon">
                                                    🏫
                                                </div>

                                                <span>
                                                    {item.name}
                                                </span>

                                            </div>

                                        </th>

                                    ))}

                                </tr>

                            </thead>


                            <tbody>

                                {/* ONLINE / OFFLINE */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            💻
                                        </span>

                                        Online / Offline
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getValue(
                                                item,
                                                "onlineOffline"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* STUDY MATERIAL */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            📚
                                        </span>

                                        Study Material
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getBooleanValue(
                                                item.studyMaterial
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* TEST SERIES */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            📝
                                        </span>

                                        Test Series
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getBooleanValue(
                                                item.testSeries
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* DOUBT SUPPORT */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            💬
                                        </span>

                                        Doubt Support
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getBooleanValue(
                                                item.doubtSupport
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* RATING */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            ⭐
                                        </span>

                                        Rating
                                    </td>

                                    {selected.map(item => (

                                        <td
                                            key={item._id}
                                            className="rating-value"
                                        >

                                            {getRating(item)}

                                        </td>

                                    ))}

                                </tr>


                                {/* FEES */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            💰
                                        </span>

                                        Fees
                                    </td>

                                    {selected.map(item => (

                                        <td
                                            key={item._id}
                                            className="fees-value"
                                        >

                                            {getFees(item)}

                                        </td>

                                    ))}

                                </tr>


                                {/* EXAM PREPARATION */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            🎯
                                        </span>

                                        Exam Preparation
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getValue(
                                                item,
                                                "examPreparation"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* LOCATION */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            📍
                                        </span>

                                        Location
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getValue(
                                                item,
                                                "location"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* ADDRESS */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            🏠
                                        </span>

                                        Address
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getValue(
                                                item,
                                                "address"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* CONTACT */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            📞
                                        </span>

                                        Contact
                                    </td>

                                    {selected.map(item => (

                                        <td key={item._id}>

                                            {getValue(
                                                item,
                                                "contactNumber"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* WEBSITE */}

                                <tr>

                                    <td>
                                        <span className="aspect-icon">
                                            🌐
                                        </span>

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
                                                    Visit Website →
                                                </a>

                                            ) : (
                                                "Not available"
                                            )}

                                        </td>

                                    ))}

                                </tr>


                                {/* DETAILS */}

                                <tr className="details-row">

                                    <td>
                                        View Details
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


                    <div className="comparison-note">

                        <span className="note-icon">
                            💡
                        </span>

                        <div>

                            <strong>
                                Need more details?
                            </strong>

                            <p>
                                Course-wise fees, duration and
                                subjects can be explored from
                                the individual class details.
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Compare;