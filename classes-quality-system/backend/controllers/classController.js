const Class = require("../models/Class");

const createClass = async (req, res) => {
    try {
        const {
            name,
            description,
            location,
            address,
            contactNumber,
            website
        } = req.body;

        if (!name || !description || !location) {
            return res.status(400).json({
                message: "Name, description and location are required"
            });
        }

        const newClass = await Class.create({
            ownerId: req.user.userId,
            name,
            description,
            location,
            address,
            contactNumber,
            website
        });

        res.status(201).json({
            message: "Class created successfully",
            class: newClass
        });

    } catch (error) {
        console.error("Create class error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Classes fetched successfully",
            classes
        });

    } catch (error) {
        console.error("Get classes error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        res.status(200).json({
            message: "Class fetched successfully",
            class: classItem
        });

    } catch (error) {
        console.error("Get class error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass: async (req, res) => {
        try {
            const classItem = await Class.findById(req.params.id);

            if (!classItem) {
                return res.status(404).json({ message: "Class not found" });
            }

            if (req.user.role !== "admin" && classItem.ownerId.toString() !== req.user.userId) {
                return res.status(403).json({ message: "You do not have permission to modify this resource" });
            }

            ["name", "description", "location", "address", "contactNumber", "website"].forEach((field) => {
                if (req.body[field] !== undefined) classItem[field] = req.body[field];
            });

            await classItem.save();
            return res.status(200).json({ message: "Class updated successfully", class: classItem });
        } catch (error) {
            console.error("Update class error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    deleteClass: async (req, res) => {
        try {
            const classItem = await Class.findById(req.params.id);

            if (!classItem) {
                return res.status(404).json({ message: "Class not found" });
            }

            if (req.user.role !== "admin" && classItem.ownerId.toString() !== req.user.userId) {
                return res.status(403).json({ message: "You do not have permission to modify this resource" });
            }

            await Class.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Class deleted successfully" });
        } catch (error) {
            console.error("Delete class error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
};