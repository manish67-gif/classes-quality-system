const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorization");

const {
    getProfile,
    getUsers,
    deleteUser
} = require("../controllers/userController");

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.get("/", authMiddleware, authorize("admin"), getUsers);
router.delete("/:id", authMiddleware, authorize("admin"), deleteUser);

module.exports = router;
