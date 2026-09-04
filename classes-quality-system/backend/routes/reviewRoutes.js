const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorization");

const {
    createReview,
    getReviewsBySubject,
    getMyReviews
} = require("../controllers/reviewController");

// Create review - students only
router.post(
    "/",
    authMiddleware,
    authorize("student"),
    createReview
);

// Get reviews for a subject
router.get(
    "/subject/:subjectId",
    getReviewsBySubject
);

// Get my reviews
router.get(
    "/my-reviews",
    authMiddleware,
    authorize("student"),
    getMyReviews
);

module.exports = router;