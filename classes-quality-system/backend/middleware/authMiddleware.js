const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        // =========================================
        // CHECK JWT SECRET
        // =========================================

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }


        // =========================================
        // GET AUTHORIZATION HEADER
        // =========================================

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }


        // =========================================
        // CHECK BEARER FORMAT
        // =========================================

        const [scheme, token] = authHeader.split(" ");

        if (
            scheme !== "Bearer" ||
            !token
        ) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }


        // =========================================
        // VERIFY TOKEN
        // =========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // =========================================
        // STORE USER INFORMATION
        // =========================================

        const user = await User.findById(decoded.userId).select("name email role");

        if (!user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        req.user = {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role === "institute" ? "class" : user.role
        };


        // =========================================
        // CONTINUE REQUEST
        // =========================================

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


module.exports = authMiddleware;