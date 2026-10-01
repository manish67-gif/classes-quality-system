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


        res.status(201).json({
            message:
                "Class created successfully",

            class: newClass
        });

    } catch (error) {

        console.error(
            "Create class error:",
            error
        );


        res.status(500).json({
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
        // CALCULATE CLASS RATINGS
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


        // =========================================
        // RESPONSE
        // =========================================

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

        const classItem =
            await Class.findById(
                req.params.id
            );


        if (!classItem) {
            return res.status(404).json({
                message:
                    "Class not found"
            });
        }


        // =========================================
        // CALCULATE CLASS RATING
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


        // IMPORTANT:
        // Do NOT use classItem.save() here.
        // We only calculate the rating for the response.


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

        const classItem =
            await Class.findById(
                req.params.id
            );


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

        const classItem =
            await Class.findById(
                req.params.id
            );


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


        const courses = await Course.find({
            classId: req.params.id
        }).select("_id");


        const courseIds =
            courses.map(
                (course) =>
                    course._id
            );


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


        await Review.deleteMany({
            subjectId: {
                $in: subjectIds
            }
        });


        await Subject.deleteMany({
            courseId: {
                $in: courseIds
            }
        });


        await Course.deleteMany({
            classId: req.params.id
        });


        await Class.findByIdAndDelete(
            req.params.id
        );


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