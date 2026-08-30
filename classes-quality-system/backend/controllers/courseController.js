const Course = require("../models/Course");
const Class = require("../models/Class");


// CREATE COURSE
const createCourse = async (req, res) => {
    try {
        const {
            classId,
            name,
            description,
            fees,
            duration
        } = req.body;


        // Check required fields
        if (!classId || !name || fees === undefined) {
            return res.status(400).json({
                message: "classId, name and fees are required"
            });
        }


        // Check whether class exists
        const classExists = await Class.findById(classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found"
            });
        }


        // Create course
        const course = await Course.create({
            classId,
            name,
            description,
            fees,
            duration
        });


        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("Create course error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL COURSES OF A CLASS
const getCoursesByClass = async (req, res) => {
    try {

        const courses = await Course.find({
            classId: req.params.classId
        }).sort({
            createdAt: -1
        });


        res.status(200).json({
            message: "Courses fetched successfully",
            courses
        });

    } catch (error) {
        console.error("Get courses error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ONE COURSE
const getCourseById = async (req, res) => {
    try {

        const course = await Course.findById(
            req.params.id
        );

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        res.status(200).json({
            message: "Course fetched successfully",
            course
        });

    } catch (error) {
        console.error("Get course error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createCourse,
    getCoursesByClass,
    getCourseById
};