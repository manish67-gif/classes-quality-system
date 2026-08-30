const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createReview,
    getReviewsBySubject,
    getMyReviews
} = require("../controllers/reviewController");



router.post(
    "/",
    authMiddleware,
    createReview
);



router.get(
    "/subject/:subjectId",
    getReviewsBySubject
);


router.get(
    "/my-reviews",
    authMiddleware,
    getMyReviews
);


module.exports = router;