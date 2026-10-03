const mongoose = require("mongoose");

const User = require("../models/User");
const Class = require("../models/Class");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Review = require("../models/Review");


// =========================================
// GET LOGGED-IN USER PROFILE
// =========================================

const getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role === "institute" ? "class" : user.role,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET USERS
// =========================================
// Admin only
//
// Optional:
// /api/users?role=student
// /api/users?role=class
//
// Admin users are never returned.
// =========================================

const getUsers = async (req, res) => {
    try {
        const { role } = req.query;

        const filter = {
            role: {
                $in: ["student", "class"]
            }
        };

        if (role === "student" || role === "class") {
            filter.role = role;
        }

        const users = await User.find(filter)
            .select("name email role createdAt")
            .sort({ createdAt: -1 });

        const formattedUsers = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role === "institute" ? "class" : user.role,
            createdAt: user.createdAt
        }));

        return res.status(200).json({
            message: "Users fetched successfully",
            users: formattedUsers
        });

    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET USER BY ID
// =========================================
// Admin only
// =========================================

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Admin accounts should not be exposed
        // through the admin student/class management flow.
        if (!["student", "class"].includes(user.role)) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let classProfile = null;

        // If this is a class account,
        // also get its institute profile.
        if (user.role === "class") {
            classProfile = await Class.findOne({
                ownerId: user._id
            }).lean();
        }

        return res.status(200).json({
            message: "User fetched successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },

            classProfile
        });

    } catch (error) {
        console.error("Get user by ID error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// UPDATE USER
// =========================================
// Admin only
//
// Admin can update:
// - name
// - email
//
// Admin cannot change role.
// Password is not changed here.
// =========================================

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!["student", "class"].includes(user.role)) {
            return res.status(403).json({
                message: "Admin accounts cannot be managed here"
            });
        }

        if (name !== undefined) {
            const trimmedName = name.trim();

            if (trimmedName.length < 2) {
                return res.status(400).json({
                    message: "Name must be at least 2 characters"
                });
            }

            if (trimmedName.length > 50) {
                return res.status(400).json({
                    message: "Name cannot exceed 50 characters"
                });
            }

            user.name = trimmedName;
        }

        if (email !== undefined) {
            const normalizedEmail = email.trim().toLowerCase();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(normalizedEmail)) {
                return res.status(400).json({
                    message: "Please provide a valid email address"
                });
            }

            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: user._id }
            });

            if (existingUser) {
                return res.status(409).json({
                    message: "User with this email already exists"
                });
            }

            user.email = normalizedEmail;
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error("Update user error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// DELETE USER
// =========================================
// Admin only
//
// Student:
//   Delete student + their reviews
//
// Class:
//   Delete class account +
//   institute + courses + subjects + reviews
//
// Admin:
//   Cannot be deleted through this route.
// =========================================

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Prevent deleting currently logged-in admin
        if (id === req.user.userId) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Never delete another admin through this system
        if (user.role === "admin") {
            return res.status(403).json({
                message: "Admin accounts cannot be deleted here"
            });
        }


        // =========================================
        // STUDENT ACCOUNT
        // =========================================

        if (user.role === "student") {
            await Review.deleteMany({
                studentId: user._id
            });

            await User.findByIdAndDelete(user._id);

            return res.status(200).json({
                message: "Student account and related reviews deleted successfully"
            });
        }


        // =========================================
        // CLASS ACCOUNT
        // =========================================

        if (user.role === "class") {
            const classProfile = await Class.findOne({
                ownerId: user._id
            });

            if (classProfile) {
                const courses = await Course.find({
                    classId: classProfile._id
                }).select("_id");

                const courseIds = courses.map(
                    (course) => course._id
                );

                const subjects = await Subject.find({
                    courseId: { $in: courseIds }
                }).select("_id");

                const subjectIds = subjects.map(
                    (subject) => subject._id
                );

                // Delete reviews belonging to subjects
                await Review.deleteMany({
                    subjectId: { $in: subjectIds }
                });

                // Delete subjects
                await Subject.deleteMany({
                    courseId: { $in: courseIds }
                });

                // Delete courses
                await Course.deleteMany({
                    classId: classProfile._id
                });

                // Delete institute/class profile
                await Class.findByIdAndDelete(
                    classProfile._id
                );
            }

            // Finally delete class account
            await User.findByIdAndDelete(user._id);

            return res.status(200).json({
                message: "Class account and related institute data deleted successfully"
            });
        }

        return res.status(400).json({
            message: "Unsupported user role"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};