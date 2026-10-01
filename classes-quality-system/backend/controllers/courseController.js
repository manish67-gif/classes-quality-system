const mongoose = require("mongoose");
const Course = require("../models/Course");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Review = require("../models/Review");

const createCourse = async (req, res) => {
    try {
        const {
            classId,
            name,
            description,
            fees,
            duration
        } = req.body;

        if (!classId || !name || fees === undefined || fees === null) {
            return res.status(400).json({
                message: "classId, name and fees are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Course name is required"
            });
        }

        const numericFees = Number(fees);

        if (Number.isNaN(numericFees) || numericFees < 0) {
            return res.status(400).json({
                message: "Fees must be a valid non-negative number"
            });
        }

        const classExists = await Class.findById(classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            classExists.ownerId.toString() !== req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You are not allowed to add a course to this class"
            });
        }

        const course = await Course.create({
            classId,
            name: name.trim(),
            description: description?.trim() || "",
            fees: numericFees,
            duration: duration?.trim() || ""
        });

        return res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("Create course error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getCoursesByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({
                message: "Invalid class ID"
            });
        }

        const classExists = await Class.findById(classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        const courses = await Course.find({
            classId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            message: "Courses fetched successfully",
            courses
        });

    } catch (error) {
        console.error("Get courses by class error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        return res.status(200).json({
            message: "Course fetched successfully",
            course
        });

    } catch (error) {
        console.error("Get course by ID error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("classId", "name location address")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Courses fetched successfully",
            courses
        });

    } catch (error) {
        console.error("Get all courses error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, fees, duration } = req.body;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const classExists = await Class.findById(course.classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        // Allow admin or the owner of the class
        if (
            req.user.role !== "admin" &&
            classExists.ownerId.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        course.name = name ?? course.name;
        course.description = description ?? course.description;
        course.fees = fees ?? course.fees;
        course.duration = duration ?? course.duration;

        await course.save();

        return res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.error("Update course error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const classExists = await Class.findById(course.classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        // Allow admin or the owner of the class
        if (
            req.user.role !== "admin" &&
            classExists.ownerId.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        // Find subjects belonging to this course
        const subjects = await Subject.find({
            courseId: id
        });

        // Delete reviews belonging to those subjects
        for (const subject of subjects) {
            await Review.deleteMany({
                subjectId: subject._id
            });
        }

        // Delete subjects
        await Subject.deleteMany({
            courseId: id
        });

        // Delete course
        await Course.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        console.error("Delete course error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createCourse,
    getCoursesByClass,
    getCourseById,
    getAllCourses,
    updateCourse,
    deleteCourse
};