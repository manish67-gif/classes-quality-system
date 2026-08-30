const Review = require("../models/Review");
const Subject = require("../models/Subject");


// CREATE REVIEW
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


        // 1. Check required fields
        if (
            !subjectId ||
            teachingQuality === undefined ||
            conceptClarity === undefined ||
            doubtSolving === undefined ||
            studyMaterial === undefined ||
            overallRating === undefined ||
            !comment
        ) {
            return res.status(400).json({
                message: "All review fields are required"
            });
        }


        // 2. Check whether subject exists
        const subjectExists = await Subject.findById(subjectId);

        if (!subjectExists) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }


        // 3. Check whether this student already reviewed this subject
        const existingReview = await Review.findOne({
            studentId: req.user.userId,
            subjectId: subjectId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this subject"
            });
        }


        // 4. Create review
        const review = await Review.create({
            studentId: req.user.userId,
            subjectId,
            teachingQuality,
            conceptClarity,
            doubtSolving,
            studyMaterial,
            overallRating,
            comment
        });


        // 5. Send response
        res.status(201).json({
            message: "Review submitted successfully",
            review
        });

    } catch (error) {

        console.error("Create review error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET REVIEWS FOR A SUBJECT
const getReviewsBySubject = async (req, res) => {
    try {

        const reviews = await Review.find({
            subjectId: req.params.subjectId
        })
            .populate(
                "studentId",
                "name"
            )
            .sort({
                createdAt: -1
            });


        res.status(200).json({
            message: "Reviews fetched successfully",
            reviews
        });

    } catch (error) {

        console.error("Get reviews error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// GET REVIEWS OF LOGGED-IN STUDENT
const getMyReviews = async (req, res) => {
    try {

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


        res.status(200).json({
            message: "My reviews fetched successfully",
            reviews
        });

    } catch (error) {

        console.error(
            "Get my reviews error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createReview,
    getReviewsBySubject,
    getMyReviews
} = require("../controllers/reviewController");


// CREATE REVIEW

router.post(
    "/",
    authMiddleware,
    createReview
);


// GET MY REVIEWS

router.get(
    "/my-reviews",
    authMiddleware,
    getMyReviews
);


// GET REVIEWS FOR SUBJECT

router.get(
    "/subject/:subjectId",
    getReviewsBySubject
);


module.exports = router;
module.exports = {
    createReview,
    getReviewsBySubject,
    getMyReviews
};