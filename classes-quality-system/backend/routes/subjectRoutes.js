const express = require("express");

const {
    createSubject,
    getSubjectsByCourse,
    getSubjectById
} = require("../controllers/subjectController");

const router = express.Router();


// Get all subjects of a course
router.get(
    "/course/:courseId",
    getSubjectsByCourse
);


// Get one subject
router.get(
    "/:id",
    getSubjectById
);


// Create subject
router.post(
    "/",
    createSubject
);


module.exports = router;