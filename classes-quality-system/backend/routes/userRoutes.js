const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorization");

const {
    getProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");


// =========================================
// LOGGED-IN USER PROFILE
// =========================================

router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// =========================================
// ADMIN USER MANAGEMENT
// =========================================

// Get all students/classes
// Optional:
// /api/users?role=student
// /api/users?role=class

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    getUsers
);


// Get one student/class

router.get(
    "/:id",
    authMiddleware,
    authorize("admin"),
    getUserById
);


// Update one student/class

router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    updateUser
);


// Delete one student/class

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    deleteUser
);


module.exports = router;