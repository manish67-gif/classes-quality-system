const express = require("express");

const {
    createCourse,
    getCoursesByClass,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorization");

const router = express.Router();

router.get(
    "/class/:classId",
    getCoursesByClass
);

router.get(
    "/:id",
    getCourseById
);

router.post(
    "/",
    authMiddleware,
    authorize("class", "admin"),
    createCourse
);

router.put("/:id", authMiddleware, authorize("class", "admin"), updateCourse);
router.delete("/:id", authMiddleware, authorize("class", "admin"), deleteCourse);

module.exports = router;