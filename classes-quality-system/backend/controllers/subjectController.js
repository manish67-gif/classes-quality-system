const Subject = require("../models/Subject");
const Course = require("../models/Course");


// CREATE SUBJECT
const createSubject = async (req, res) => {
    try {
        const {
            courseId,
            name,
            description
        } = req.body;


        // Check required fields
        if (!courseId || !name) {
            return res.status(400).json({
                message: "courseId and name are required"
            });
        }


        // Check whether course exists
        const courseExists = await Course.findById(courseId);

        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // Create subject
        const subject = await Subject.create({
            courseId,
            name,
            description
        });


        res.status(201).json({
            message: "Subject created successfully",
            subject
        });

    } catch (error) {
        console.error("Create subject error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SUBJECTS OF A COURSE
const getSubjectsByCourse = async (req, res) => {
    try {

        const subjects = await Subject.find({
            courseId: req.params.courseId
        }).sort({
            createdAt: 1
        });


        res.status(200).json({
            message: "Subjects fetched successfully",
            subjects
        });

    } catch (error) {
        console.error("Get subjects error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ONE SUBJECT
const getSubjectById = async (req, res) => {
    try {

        const subject = await Subject.findById(
            req.params.id
        );

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }


        res.status(200).json({
            message: "Subject fetched successfully",
            subject
        });

    } catch (error) {
        console.error("Get subject error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createSubject,
    getSubjectsByCourse,
    getSubjectById
};
