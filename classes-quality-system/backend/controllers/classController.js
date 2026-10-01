const mongoose = require("mongoose");
const Class = require("../models/Class");
const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Review = require("../models/Review");


// =========================================
// CREATE CLASS
// =========================================

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
                message:
                    "Name, description and location are required"
            });
        }


        const existingClass = await Class.findOne({
            ownerId: req.user.userId
        });


        if (existingClass) {
            return res.status(409).json({
                message:
                    "Your institute profile already exists"
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


        return res.status(201).json({
            message:
                "Class created successfully",

            class: newClass
        });

    } catch (error) {

        console.error(
            "Create class error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET ALL CLASSES
// =========================================

const getClasses = async (req, res) => {
    try {

        const classes = await Class.find()
            .sort({
                createdAt: -1
            });


        // =========================================
        // CALCULATE INSTITUTE RATINGS
        // =========================================

        for (const classItem of classes) {

            const courses = await Course.find({
                classId: classItem._id
            });


            const ratedCourses = courses.filter(
                (course) =>
                    course.rating !== null &&
                    course.rating !== undefined
            );


            if (ratedCourses.length > 0) {

                const totalRating =
                    ratedCourses.reduce(
                        (sum, course) =>
                            sum + Number(course.rating),
                        0
                    );


                classItem.rating = Number(
                    (
                        totalRating /
                        ratedCourses.length
                    ).toFixed(1)
                );

            } else {

                classItem.rating = null;
            }
        }


        return res.status(200).json({
            message:
                "Classes fetched successfully",

            classes
        });

    } catch (error) {

        console.error(
            "Get classes error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// GET CLASS BY ID
// =========================================

const getClassById = async (req, res) => {
    try {

        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message:
                    "Invalid class ID"
            });
        }


        const classItem =
            await Class.findById(id);


        if (!classItem) {
            return res.status(404).json({
                message:
                    "Class not found"
            });
        }


        // =========================================
        // CALCULATE INSTITUTE RATING
        // =========================================

        const courses = await Course.find({
            classId: classItem._id
        });


        const ratedCourses = courses.filter(
            (course) =>
                course.rating !== null &&
                course.rating !== undefined
        );


        if (ratedCourses.length > 0) {

            const totalRating =
                ratedCourses.reduce(
                    (sum, course) =>
                        sum + Number(course.rating),
                    0
                );


            classItem.rating = Number(
                (
                    totalRating /
                    ratedCourses.length
                ).toFixed(1)
            );

        } else {

            classItem.rating = null;
        }


        /*
            IMPORTANT:

            Do NOT use:

            await classItem.save();

            here.

            The rating is calculated only for
            this response. It is not saved to
            the database from a GET request.
        */


        return res.status(200).json({
            message:
                "Class fetched successfully",

            class: classItem
        });

    } catch (error) {

        console.error(
            "Get class error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// UPDATE CLASS
// =========================================

const updateClass = async (req, res) => {
    try {

        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message:
                    "Invalid class ID"
            });
        }


        const classItem =
            await Class.findById(id);


        if (!classItem) {
            return res.status(404).json({
                message:
                    "Class not found"
            });
        }


        if (
            req.user.role !== "admin" &&
            classItem.ownerId.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "You do not have permission to modify this resource"
            });
        }


        [
            "name",
            "description",
            "location",
            "address",
            "contactNumber",
            "website"
        ].forEach((field) => {

            if (
                req.body[field] !== undefined
            ) {
                classItem[field] =
                    req.body[field];
            }

        });


        await classItem.save();


        return res.status(200).json({
            message:
                "Class updated successfully",

            class: classItem
        });

    } catch (error) {

        console.error(
            "Update class error:",
            error
        );


        if (error.name === "ValidationError") {
            return res.status(400).json({
                message:
                    error.message
            });
        }


        return res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================================
// DELETE CLASS
// =========================================

const deleteClass = async (req, res) => {
    try {

        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message:
                    "Invalid class ID"
            });
        }


        const classItem =
            await Class.findById(id);


        if (!classItem) {
            return res.status(404).json({
                message:
                    "Class not found"
            });
        }


        if (
            req.user.role !== "admin" &&
            classItem.ownerId.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message:
                    "You do not have permission to modify this resource"
            });
        }


        // =========================================
        // FIND COURSES
        // =========================================

        const courses = await Course.find({
            classId: id
        }).select("_id");


        const courseIds =
            courses.map(
                (course) =>
                    course._id
            );


        // =========================================
        // FIND SUBJECTS
        // =========================================

        const subjects = await Subject.find({
            courseId: {
                $in: courseIds
            }
        }).select("_id");


        const subjectIds =
            subjects.map(
                (subject) =>
                    subject._id
            );


        // =========================================
        // DELETE REVIEWS
        // =========================================

        await Review.deleteMany({
            subjectId: {
                $in: subjectIds
            }
        });


        // =========================================
        // DELETE SUBJECTS
        // =========================================

        await Subject.deleteMany({
            courseId: {
                $in: courseIds
            }
        });


        // =========================================
        // DELETE COURSES
        // =========================================

        await Course.deleteMany({
            classId: id
        });


        // =========================================
        // DELETE CLASS
        // =========================================

        await Class.findByIdAndDelete(id);


        return res.status(200).json({
            message:
                "Class deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete class error:",
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
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
};