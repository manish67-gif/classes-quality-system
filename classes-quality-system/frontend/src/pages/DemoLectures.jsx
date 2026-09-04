import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function DemoLectures() {

    const { classId, courseId, subjectId } = useParams();

    const [subject, setSubject] = useState(null);
    const [course, setCourse] = useState(null);
    const [institute, setInstitute] = useState(null);

    const [selectedLecture, setSelectedLecture] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH DATA
    // =========================================

    useEffect(() => {
        fetchDemoLectures();
    }, [classId, courseId, subjectId]);


    const fetchDemoLectures = async () => {

        try {

            setLoading(true);
            setError("");


            // =========================================
            // FETCH SUBJECT + COURSE + INSTITUTE
            // =========================================

            const [
                subjectResponse,
                courseResponse,
                classResponse
            ] = await Promise.all([

                fetch(
                    `http://localhost:8080/api/subjects/${subjectId}`
                ),

                fetch(
                    `http://localhost:8080/api/courses/${courseId}`
                ),

                fetch(
                    `http://localhost:8080/api/classes/${classId}`
                )

            ]);


            const [
                subjectData,
                courseData,
                classData
            ] = await Promise.all([

                subjectResponse.json(),
                courseResponse.json(),
                classResponse.json()

            ]);


            // =========================================
            // CHECK RESPONSE
            // =========================================

            if (
                !subjectResponse.ok ||
                !courseResponse.ok ||
                !classResponse.ok
            ) {

                throw new Error(
                    "Failed to load demo lecture details"
                );

            }


            // =========================================
            // SET DATA
            // =========================================

            setSubject(
                subjectData.subject
            );

            setCourse(
                courseData.course
            );

            setInstitute(
                classData.class
            );


        } catch (error) {

            console.error(
                "Fetch demo lectures error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="demo-page">

                <div className="demo-loading">

                    Loading demo lectures...

                </div>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="demo-page">

                <div className="demo-error">

                    <h2>
                        Demo Lectures
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="demo-page">


            {/* =========================================
                BREADCRUMB
            ========================================= */}

            <div className="demo-breadcrumb">

                <Link to="/classes">
                    Classes
                </Link>

                <span>
                    ›
                </span>

                <span>
                    {institute?.name}
                </span>

                <span>
                    ›
                </span>

                <span>
                    {course?.name}
                </span>

                <span>
                    ›
                </span>

                <strong>
                    {subject?.name}
                </strong>

            </div>


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="demo-header">

                <span className="small-title">
                    DEMO LECTURES
                </span>

                <h1>
                    {subject?.name}
                </h1>

                <p>

                    Watch sample lectures from{" "}

                    <strong>
                        {institute?.name}
                    </strong>

                    {" "}for the{" "}

                    <strong>
                        {course?.name}
                    </strong>

                    {" "}course.

                </p>

            </div>


            {/* =========================================
                COURSE CONTEXT
            ========================================= */}

            <div className="demo-context">


                {/* INSTITUTE */}

                <div className="demo-context-item">

                    <span className="context-icon">
                        🏫
                    </span>

                    <div>

                        <span>
                            Institute
                        </span>

                        <strong>
                            {institute?.name}
                        </strong>

                    </div>

                </div>


                <div className="context-divider" />


                {/* COURSE */}

                <div className="demo-context-item">

                    <span className="context-icon">
                        📚
                    </span>

                    <div>

                        <span>
                            Course
                        </span>

                        <strong>
                            {course?.name}
                        </strong>

                    </div>

                </div>


                <div className="context-divider" />


                {/* SUBJECT */}

                <div className="demo-context-item">

                    <span className="context-icon">
                        📖
                    </span>

                    <div>

                        <span>
                            Subject
                        </span>

                        <strong>
                            {subject?.name}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================================
                INFO
            ========================================= */}

            <div className="demo-info">

                <div className="demo-info-icon">
                    ▶
                </div>

                <div>

                    <h3>
                        Try before you choose
                    </h3>

                    <p>

                        Watch these sample lectures to
                        understand the teaching style and
                        approach of this institute.

                    </p>

                </div>

            </div>


            {/* =========================================
                LECTURES
            ========================================= */}

            <div className="demo-lectures-section">


                {/* SECTION HEADER */}

                <div className="demo-section-heading">

                    <div>

                        <span>
                            SAMPLE CONTENT
                        </span>

                        <h2>
                            Demo Lectures
                        </h2>

                    </div>


                    <span className="lecture-count">

                        {subject?.demoLectures?.length || 0}

                        {" "}

                        {subject?.demoLectures?.length === 1
                            ? "lecture"
                            : "lectures"}

                    </span>

                </div>


                {/* =========================================
                    LECTURE LIST
                ========================================= */}

                {subject?.demoLectures?.length > 0 ? (

                    <div className="compact-lectures">

                        {subject.demoLectures.map(
                            (lecture, index) => (

                                <div
                                    className="compact-lecture"
                                    key={
                                        lecture._id ||
                                        lecture.id ||
                                        index
                                    }
                                >


                                    {/* LEFT SIDE */}

                                    <div className="compact-lecture-left">


                                        {/* NUMBER */}

                                        <div className="lecture-number">

                                            {String(
                                                index + 1
                                            ).padStart(2, "0")}

                                        </div>


                                        {/* ICON */}

                                        <div className="lecture-mini-icon">

                                            ▶

                                        </div>


                                        {/* INFO */}

                                        <div className="compact-lecture-info">

                                            <h3>
                                                {lecture.title}
                                            </h3>


                                            <div className="compact-meta">

                                                <span>
                                                    ▶ Demo Lecture
                                                </span>


                                                {lecture.duration && (

                                                    <span>

                                                        ⏱{" "}
                                                        {lecture.duration}

                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================
                                        WATCH BUTTON
                                    ================================= */}

                                    <button
                                        className="compact-watch-btn"
                                        type="button"
                                        disabled={
                                            !lecture.videoUrl
                                        }
                                        onClick={() => {

                                            if (
                                                lecture.videoUrl
                                            ) {

                                                setSelectedLecture(
                                                    lecture
                                                );

                                            }

                                        }}
                                    >

                                        <span>
                                            ▶
                                        </span>

                                        {lecture.videoUrl
                                            ? "Watch Demo"
                                            : "Video Unavailable"}

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                ) : (


                    /* =========================================
                       NO LECTURES
                    ========================================= */

                    <div className="demo-empty">

                        <div>
                            📭
                        </div>

                        <h3>
                            No demo lectures available
                        </h3>

                        <p>

                            This subject does not have any
                            demo lectures available yet.

                        </p>

                    </div>

                )}

            </div>


            {/* =========================================
                BACK
            ========================================= */}

            <div className="demo-back">

                <Link
                    to={
                        `/classes/${classId}/courses/${courseId}/subjects`
                    }
                >

                    ← Back to Subjects

                </Link>

            </div>


            {/* =========================================
                VIDEO MODAL
            ========================================= */}

            {selectedLecture && (

                <div
                    className="video-modal-overlay"
                    onClick={() =>
                        setSelectedLecture(null)
                    }
                >

                    <div
                        className="video-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="video-modal-header">

                            <div>

                                <span>
                                    DEMO LECTURE
                                </span>

                                <h2>
                                    {selectedLecture.title}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="video-modal-close"
                                onClick={() =>
                                    setSelectedLecture(null)
                                }
                            >

                                ✕

                            </button>

                        </div>


                        {/* VIDEO */}

                        <video
                            className="demo-video"
                            controls
                            autoPlay
                            src={
                                selectedLecture.videoUrl
                            }
                        >

                            Your browser does not support
                            video playback.

                        </video>


                    </div>

                </div>

            )}

        </div>

    );

}

export default DemoLectures;