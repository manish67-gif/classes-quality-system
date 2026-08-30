import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Classes() {

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [search, setSearch] = useState("");

    // Filters
    const [ratingFilter, setRatingFilter] = useState("");
    const [feesFilter, setFeesFilter] = useState("");

    // Sort
    const [sortBy, setSortBy] = useState("");


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

            setClasses(data.classes);

        } catch (error) {

            console.error("Fetch classes error:", error);

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    /*
     * SEARCH + FILTER + SORT
     */

    const filteredClasses = useMemo(() => {

        let result = [...classes];

        const searchValue = search
            .trim()
            .toLowerCase();


        // SEARCH
        if (searchValue) {

            result = result.filter((item) =>
                item.name?.toLowerCase().includes(searchValue) ||
                item.location?.toLowerCase().includes(searchValue) ||
                item.address?.toLowerCase().includes(searchValue)
            );
        }


        // RATING FILTER
        if (ratingFilter) {

            const minimumRating =
                Number(ratingFilter);

            result = result.filter(
                (item) =>
                    Number(item.rating || 0) >=
                    minimumRating
            );
        }


        // FEES FILTER
        if (feesFilter) {

            result = result.filter((item) => {

                const fees =
                    Number(item.fees || 0);

                if (feesFilter === "under-10000") {
                    return fees < 10000;
                }

                if (feesFilter === "10000-25000") {
                    return fees >= 10000 &&
                        fees <= 25000;
                }

                if (feesFilter === "25000-50000") {
                    return fees > 25000 &&
                        fees <= 50000;
                }

                if (feesFilter === "above-50000") {
                    return fees > 50000;
                }

                return true;
            });
        }


        // SORT
        if (sortBy === "rating-high") {

            result.sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            );
        }

        if (sortBy === "fees-low") {

            result.sort(
                (a, b) =>
                    Number(a.fees || 0) -
                    Number(b.fees || 0)
            );
        }

        if (sortBy === "fees-high") {

            result.sort(
                (a, b) =>
                    Number(b.fees || 0) -
                    Number(a.fees || 0)
            );
        }


        return result;

    }, [
        classes,
        search,
        ratingFilter,
        feesFilter,
        sortBy
    ]);


    const clearFilters = () => {

        setSearch("");
        setRatingFilter("");
        setFeesFilter("");
        setSortBy("");
    };


    const hasFilters =
        search ||
        ratingFilter ||
        feesFilter ||
        sortBy;


    if (loading) {
        return (
            <div className="classes-page">

                <h1>Classes</h1>

                <p className="message">
                    Loading classes...
                </p>

            </div>
        );
    }


    if (error) {
        return (
            <div className="classes-page">

                <h1>Classes</h1>

                <p className="error-message">
                    {error}
                </p>

            </div>
        );
    }


    return (
        <div className="classes-page">

            {/* HEADER */}

            <div className="page-header">

                <h1>
                    Find Your Coaching Institute
                </h1>

                <p>
                    Compare institutes, courses, fees and
                    ratings before choosing the right one.
                </p>

            </div>


            {/* SEARCH */}

            <div className="classes-search-box">

                <span>
                    🔍
                </span>

                <input
                    type="text"
                    placeholder="Search institute..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* FILTER BAR */}

            <div className="classes-filter-bar">

                {/* RATING */}

                <div className="filter-item">

                    <label>
                        Rating
                    </label>

                    <select
                        value={ratingFilter}
                        onChange={(e) =>
                            setRatingFilter(e.target.value)
                        }
                    >

                        <option value="">
                            All Ratings
                        </option>

                        <option value="4.5">
                            ⭐ 4.5+
                        </option>

                        <option value="4">
                            ⭐ 4.0+
                        </option>

                        <option value="3.5">
                            ⭐ 3.5+
                        </option>

                        <option value="3">
                            ⭐ 3.0+
                        </option>

                    </select>

                </div>


                {/* FEES */}

                <div className="filter-item">

                    <label>
                        Fees
                    </label>

                    <select
                        value={feesFilter}
                        onChange={(e) =>
                            setFeesFilter(e.target.value)
                        }
                    >

                        <option value="">
                            All Fees
                        </option>

                        <option value="under-10000">
                            Under ₹10,000
                        </option>

                        <option value="10000-25000">
                            ₹10,000 – ₹25,000
                        </option>

                        <option value="25000-50000">
                            ₹25,000 – ₹50,000
                        </option>

                        <option value="above-50000">
                            Above ₹50,000
                        </option>

                    </select>

                </div>


                {/* SORT */}

                <div className="filter-item">

                    <label>
                        Sort By
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value)
                        }
                    >

                        <option value="">
                            Recommended
                        </option>

                        <option value="rating-high">
                            Highest Rated
                        </option>

                        <option value="fees-low">
                            Fees: Low to High
                        </option>

                        <option value="fees-high">
                            Fees: High to Low
                        </option>

                    </select>

                </div>


                {/* CLEAR */}

                {hasFilters && (

                    <button
                        type="button"
                        className="clear-filter-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                )}

            </div>


            {/* RESULT COUNT */}

            <div className="classes-result-info">

                Showing{" "}
                <strong>
                    {filteredClasses.length}
                </strong>{" "}
                of{" "}
                <strong>
                    {classes.length}
                </strong>{" "}
                institutes

            </div>


            {/* RESULTS */}

            {filteredClasses.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        🔎
                    </div>

                    <h3>
                        No institutes found
                    </h3>

                    <p>
                        Try changing your filters or search.
                    </p>

                    <button
                        type="button"
                        className="view-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            ) : (

                <div className="institutes">

                    {filteredClasses.map((item) => (

                        <div
                            className="institute-card"
                            key={item._id}
                        >

                            <div className="card-top">

                                <div className="institute-icon">
                                    🏫
                                </div>

                                <div>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    {item.rating && (

                                        <div className="institute-rating">
                                            ⭐ {item.rating}
                                        </div>

                                    )}

                                </div>

                            </div>


                            <p className="description">
                                {item.description}
                            </p>


                            <p className="location">
                                <strong>
                                    Location:
                                </strong>{" "}
                                {item.location}
                            </p>


                            <p className="location">
                                <strong>
                                    Address:
                                </strong>{" "}
                                {item.address}
                            </p>


                            {item.fees && (

                                <p className="location">

                                    <strong>
                                        Fees:
                                    </strong>{" "}

                                    ₹{Number(item.fees).toLocaleString("en-IN")}

                                </p>

                            )}


                            <p className="location">

                                <strong>
                                    Contact:
                                </strong>{" "}

                                {item.contactNumber}

                            </p>


                            <Link
                                to={`/classes/${item._id}`}
                            >

                                <button
                                    className="view-btn"
                                    type="button"
                                >
                                    View Details
                                </button>

                            </Link>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Classes;