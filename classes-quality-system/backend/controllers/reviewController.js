const mongoose = require("mongoose");

const Review = require("../models/Review");
const Subject = require("../models/Subject");


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
            overallRating,
            comment
        } = req.body;


        // =========================================
        // CHECK LOGGED-IN USER
        // =========================================

        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }


        const studentId = req.user.userId;


        // =========================================
        // VALIDATE SUBJECT ID
        // =========================================

        if (
            !subjectId ||
            !mongoose.Types.ObjectId.isValid(subjectId)
        ) {
            return res.status(400).json({
                message: "Invalid subject ID"
            });
        }


        // =========================================
        // VALIDATE REQUIRED FIELDS
        // =========================================

        if (
            teachingQuality === undefined ||
            conceptClarity === undefined ||
            doubtSolving === undefined ||
            studyMaterial === undefined ||
            overallRating === undefined
        ) {
            return res.status(400).json({
                message: "All rating fields are required"
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
                message: "Comment is required"
            });
        }


        // =========================================
        // VALIDATE RATINGS
        // =========================================

        const ratings = {
            teachingQuality,
            conceptClarity,
            doubtSolving,
            studyMaterial,
            overallRating
        };


        for (const [field, value] of Object.entries(ratings)) {

            const numericValue = Number(value);


            if (
                !Number.isInteger(numericValue) ||
                numericValue < 1 ||
                numericValue > 5
            ) {
                return res.status(400).json({
                    message: `${field} must be a whole number between 1 and 5`
                });
            }
        }


        // =========================================
        // CHECK SUBJECT EXISTS
        // =========================================

        const subjectExists = await Subject.findById(
            subjectId
        );


        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }


        // =========================================
        // CHECK EXISTING REVIEW
        // =========================================

        const existingReview = await Review.findOne({
            studentId,
            subjectId
        });


        if (existingReview) {
            return res.status(409).json({
                message: "You have already reviewed this subject"
            });
        }


        // =========================================
        // CREATE REVIEW
        // =========================================

        const review = await Review.create({
            studentId,
            subjectId,

            teachingQuality: Number(teachingQuality),
            conceptClarity: Number(conceptClarity),
            doubtSolving: Number(doubtSolving),
            studyMaterial: Number(studyMaterial),
            overallRating: Number(overallRating),

            comment: comment.trim()
        });


        // =========================================
        // RESPONSE
        // =========================================

        return res.status(201).json({
            message: "Review submitted successfully",
            review
        });

    } catch (error) {

        console.error(
            "Create review error:",
            error
        );


        // Duplicate review protection
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this subject"
            });
        }


        // Mongoose validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }


        return res.status(500).json({
            message: "Server error"
        });
    }
};



// =========================================
// GET REVIEWS FOR A SUBJECT
// =========================================

const getReviewsBySubject = async (req, res) => {
    try {

        const { subjectId } = req.params;


        // =========================================
        // VALIDATE SUBJECT ID
        // =========================================

        if (
            !subjectId ||
            !mongoose.Types.ObjectId.isValid(subjectId)
        ) {
            return res.status(400).json({
                message: "Invalid subject ID"
            });
        }


        // =========================================
        // CHECK SUBJECT EXISTS
        // =========================================

        const subjectExists = await Subject.findById(
            subjectId
        );


        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }


        // =========================================
        // GET REVIEWS
        // =========================================

        const reviews = await Review.find({
            subjectId
        })
            .populate(
                "studentId",
                "name"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            message: "Reviews fetched successfully",
            reviews
        });

    } catch (error) {

        console.error(
            "Get reviews by subject error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
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

        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }


        // =========================================
        // GET REVIEWS
        // =========================================

        const reviews = await Review.find({
            studentId: req.user.userId
        })
            .populate(
                "subjectId",
                "name description"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            message: "My reviews fetched successfully",
            reviews
        });

    } catch (error) {

        console.error(
            "Get my reviews error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
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