const Class = require("../models/Class");


// CREATE CLASS
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


// GET ALL CLASSES
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


// GET ONE CLASS
const getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(
            req.params.id
        );

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
    getClassById
};