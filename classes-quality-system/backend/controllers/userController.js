const mongoose = require("mongoose");
const User = require("../models/User");


// =========================================
// GET LOGGED-IN USER PROFILE
// =========================================

const getProfile = async (req, res) => {
    try {

        // =========================================
        // CHECK AUTHENTICATION
        // =========================================

        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }


        const userId = req.user.userId;


        // =========================================
        // VALIDATE USER ID
        // =========================================

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        // =========================================
        // GET USER
        // =========================================

        const user = await User.findById(userId)
            .select("-password");


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role === "institute") {
            user.role = "class";
        }


        // =========================================
        // RESPONSE
        // =========================================

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
        });
    }
};



// =========================================
// EXPORTS
// =========================================

module.exports = {
    getProfile,
    getUsers: async (req, res) => {
        try {
            const users = await User.find()
                .select("name email role createdAt")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                message: "Users fetched successfully",
                users: users.map((user) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role === "institute" ? "class" : user.role,
                    createdAt: user.createdAt
                }))
            });
        } catch (error) {
            console.error("Get users error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    deleteUser: async (req, res) => {
        try {
            if (req.params.id === req.user.userId) {
                return res.status(400).json({ message: "You cannot delete your own admin account" });
            }

            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Delete user error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
};