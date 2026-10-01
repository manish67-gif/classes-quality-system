const mongoose = require("mongoose");

const Review = require("../models/Review");
const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Class = require("../models/Class");


// =========================================
// CREATE REVIEW
// =========================================

const createReview = async (req, res) => {
    try {

        const {
            subjectId,
            teachingQuality,
            conceptClarity,
            doubtSolving,
            studyMaterial,
            comment
        } = req.body;


        // =========================================
        // CHECK LOGGED-IN USER
        // =========================================

        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }


        const studentId =
            req.user.userId;


        // =========================================
        // VALIDATE SUBJECT ID
        // =========================================

        if (
            !subjectId ||
            !mongoose.Types.ObjectId.isValid(
                subjectId
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid subject ID"
            });
        }


        // =========================================
        // VALIDATE REQUIRED RATINGS
        // =========================================

        if (
            teachingQuality === undefined ||
            conceptClarity === undefined ||
            doubtSolving === undefined ||
            studyMaterial === undefined
        ) {
            return res.status(400).json({
                message:
                    "All ratings are required"
            });
        }


        // =========================================
        // VALIDATE COMMENT
        // =========================================

        if (
            typeof comment !== "string" ||
            !comment.trim()
        ) {
            return res.status(400).json({
                message:
                    "Comment is required"
            });
        }


        // =========================================
        // CONVERT RATINGS TO NUMBERS
        // =========================================

        const teachingQualityValue =
            Number(teachingQuality);

        const conceptClarityValue =
            Number(conceptClarity);

        const doubtSolvingValue =
            Number(doubtSolving);

        const studyMaterialValue =
            Number(studyMaterial);


        // =========================================
        // VALIDATE RATINGS
        // =========================================

        const categoryRatings = {
            teachingQuality:
                teachingQualityValue,

            conceptClarity:
                conceptClarityValue,

            doubtSolving:
                doubtSolvingValue,

            studyMaterial:
                studyMaterialValue
        };


        for (
            const [field, value]
            of Object.entries(categoryRatings)
        ) {

            if (
                !Number.isInteger(value) ||
                value < 1 ||
                value > 5
            ) {
                return res.status(400).json({
                    message:
                        `${field} must be a whole number between 1 and 5`
                });
            }
        }


        // =========================================
        // CALCULATE OVERALL RATING
        // =========================================

        const overallRating =
            Number(
                (
                    (
                        teachingQualityValue +
                        conceptClarityValue +
                        doubtSolvingValue +
                        studyMaterialValue
                    ) / 4
                ).toFixed(1)
            );


        // =========================================
        // CHECK SUBJECT EXISTS
        // =========================================

        const subjectExists =
            await Subject.findById(
                subjectId
            );


        if (!subjectExists) {
            return res.status(404).json({
                message:
                    "Subject not found"
            });
        }


        // =========================================
        // CHECK EXISTING REVIEW
        // =========================================

        const existingReview =
            await Review.findOne({
                studentId,
                subjectId
            });


        if (existingReview) {
            return res.status(409).json({
                message:
                    "You have already reviewed this subject"
            });
        }


        // =========================================
        // CREATE REVIEW
        // =========================================

        const review =
            await Review.create({
                studentId,
                subjectId,

                teachingQuality:
                    teachingQualityValue,

                conceptClarity:
                    conceptClarityValue,

                doubtSolving:
                    doubtSolvingValue,

                studyMaterial:
                    studyMaterialValue,

                overallRating,

                comment:
                    comment.trim()
            });


        // =========================================
        // UPDATE SUBJECT RATING
        // =========================================

        const subjectReviews =
            await Review.find({
                subjectId
            });


        const totalSubjectRating =
            subjectReviews.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.overallRating
                    ),
                0
            );


        const subjectAverage =
            totalSubjectRating /
            subjectReviews.length;


        const subjectRating =
            Number(
                subjectAverage.toFixed(1)
            );


        await Subject.findByIdAndUpdate(
            subjectId,
            {
                $set: {
                    rating: subjectRating
                }
            }
        );


        // =========================================
        // FIND COURSE
        // =========================================

        const course =
            await Course.findById(
                subjectExists.courseId
            );


        if (!course) {
            return res.status(404).json({
                message:
                    "Course not found"
            });
        }


        // =========================================
        // UPDATE COURSE RATING
        // =========================================

        const courseSubjects =
            await Subject.find({
                courseId: course._id
            });


        const ratedSubjects =
            courseSubjects.filter(
                (subject) =>
                    subject.rating !== null &&
                    subject.rating !== undefined
            );


        if (ratedSubjects.length > 0) {

            const totalCourseRating =
                ratedSubjects.reduce(
                    (sum, subject) =>
                        sum +
                        Number(
                            subject.rating
                        ),
                    0
                );


            const courseAverage =
                totalCourseRating /
                ratedSubjects.length;


            const courseRating =
                Number(
                    courseAverage.toFixed(1)
                );


            await Course.findByIdAndUpdate(
                course._id,
                {
                    $set: {
                        rating:
                            courseRating
                    }
                }
            );
        }


        // =========================================
        // UPDATE CLASS / INSTITUTE RATING
        // =========================================

        const classId =
            course.classId;


        const classExists =
            await Class.findById(
                classId
            );


        if (classExists) {

            const classCourses =
                await Course.find({
                    classId
                });


            const ratedCourses =
                classCourses.filter(
                    (item) =>
                        item.rating !== null &&
                        item.rating !== undefined
                );


            if (ratedCourses.length > 0) {

                const totalClassRating =
                    ratedCourses.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.rating
                            ),
                        0
                    );


                const classAverage =
                    totalClassRating /
                    ratedCourses.length;


                const classRating =
                    Number(
                        classAverage.toFixed(1)
                    );


                /*
                    IMPORTANT:

                    Use findByIdAndUpdate()
                    instead of classExists.save().

                    This updates only the rating
                    and avoids triggering validation
                    on old Class documents.
                */

                await Class.findByIdAndUpdate(
                    classId,
                    {
                        $set: {
                            rating:
                                classRating
                        }
                    }
                );
            }
        }


        // =========================================
        // RESPONSE
        // =========================================

        return res.status(201).json({
            message:
                "Review submitted successfully",

            review
        });


    } catch (error) {

        console.error(
            "Create review error:",
            error
        );


        // =========================================
        // DUPLICATE REVIEW
        // =========================================

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "You have already reviewed this subject"
            });
        }


        // =========================================
        // MONGOOSE VALIDATION ERROR
        // =========================================

        if (
            error.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                message:
                    error.message
            });
        }


        return res.status(500).json({
            message:
                "Server error"
        });
    }
};


// =========================================
// GET REVIEWS FOR A SUBJECT
// =========================================

const getReviewsBySubject = async (req, res) => {
    try {

        const { subjectId } =
            req.params;


        // =========================================
        // VALIDATE SUBJECT ID
        // =========================================

        if (
            !subjectId ||
            !mongoose.Types.ObjectId.isValid(
                subjectId
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid subject ID"
            });
        }


        // =========================================
        // CHECK SUBJECT EXISTS
        // =========================================

        const subjectExists =
            await Subject.findById(
                subjectId
            );


        if (!subjectExists) {
            return res.status(404).json({
                message:
                    "Subject not found"
            });
        }


        // =========================================
        // GET REVIEWS
        // =========================================

        const reviews =
            await Review.find({
                subjectId
            })
                .populate(
                    "studentId",
                    "name"
                )
                .populate({
                    path: "subjectId",

                    select:
                        "name description courseId",

                    populate: {
                        path: "courseId",

                        select:
                            "name description fees duration classId",

                        populate: {
                            path: "classId",

                            select:
                                "name location address"
                        }
                    }
                })
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            message:
                "Reviews fetched successfully",

            reviews
        });


    } catch (error) {

        console.error(
            "Get reviews by subject error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error"
        });
    }
};


// =========================================
// GET REVIEWS OF LOGGED-IN STUDENT
// =========================================

const getMyReviews = async (req, res) => {
    try {

        // =========================================
        // CHECK AUTHENTICATION
        // =========================================

        if (
            !req.user ||
            !req.user.userId
        ) {
            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }


        // =========================================
        // GET ALL REVIEWS
        // =========================================

        const reviews =
            await Review.find({
                studentId:
                    req.user.userId
            })
                .populate(
                    "studentId",
                    "name"
                )
                .populate({
                    path: "subjectId",

                    select:
                        "name description courseId",

                    populate: {
                        path: "courseId",

                        select:
                            "name description fees duration classId",

                        populate: {
                            path: "classId",

                            select:
                                "name location address"
                        }
                    }
                })
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            message:
                "My reviews fetched successfully",

            reviews
        });


    } catch (error) {

        console.error(
            "Get my reviews error:",
            error
        );


        return res.status(500).json({
            message:
                "Server error"
        });
    }
};


// =========================================
// EXPORTS
// =========================================

module.exports = {
    createReview,
    getReviewsBySubject,
    getMyReviews
};