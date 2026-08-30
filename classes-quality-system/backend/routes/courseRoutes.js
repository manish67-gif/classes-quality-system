const express = require("express");

const {
    createCourse,
    getCoursesByClass,
    getCourseById
} = require("../controllers/courseController");

const router = express.Router();


// Get all courses belonging to a class
router.get(
    "/class/:classId",
    getCoursesByClass
);


// Get one course
router.get(
    "/:id",
    getCourseById
);


// Create course
router.post(
    "/",
    createCourse
);


module.exports = router;