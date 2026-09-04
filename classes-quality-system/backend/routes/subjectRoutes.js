const express = require("express");

const {
    createSubject,
    getSubjectsByCourse,
    getSubjectById,
    addDemoLecture,
    updateDemoLecture,
    deleteDemoLecture,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Get subjects of a course
router.get(
    "/course/:courseId",
    getSubjectsByCourse
);

// Get one subject
router.get(
    "/:id",
    getSubjectById
);

// Create subject - class owner or admin
router.post(
    "/",
    authMiddleware,
    authorize("class", "admin"),
    createSubject
);

router.put("/:id", authMiddleware, authorize("class", "admin"), updateSubject);
router.delete("/:id", authMiddleware, authorize("class", "admin"), deleteSubject);
router.post("/:id/demos", authMiddleware, authorize("class", "admin"), addDemoLecture);
router.put("/:id/demos/:lectureId", authMiddleware, authorize("class", "admin"), updateDemoLecture);
router.delete("/:id/demos/:lectureId", authMiddleware, authorize("class", "admin"), deleteDemoLecture);

module.exports = router;