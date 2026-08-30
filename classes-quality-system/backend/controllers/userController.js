const User = require("../models/User");

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {

        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getProfile
};