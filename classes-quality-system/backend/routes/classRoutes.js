const express = require("express");

const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
} = require("../controllers/classController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Get all classes
router.get("/", getClasses);

// Get one class
router.get("/:id", getClassById);

// Create class - admin only
router.post(
    "/",
    authMiddleware,
    authorize("class", "admin"),
    createClass
);

router.put("/:id", authMiddleware, authorize("class", "admin"), updateClass);
router.delete("/:id", authMiddleware, authorize("class", "admin"), deleteClass);

module.exports = router;