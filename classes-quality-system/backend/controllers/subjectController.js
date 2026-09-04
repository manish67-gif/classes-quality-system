const mongoose = require("mongoose");

const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Class = require("../models/Class");

const canManageClass = (classItem, user) =>
    user.role === "admin" ||
    classItem.ownerId.toString() === user.userId.toString();


// =========================================
// CREATE SUBJECT
// =========================================

const createSubject = async (req, res) => {
    try {

        const {
            courseId,
            name,
            description
        } = req.body;


        // =========================================
        // VALIDATE REQUIRED FIELDS
        // =========================================

        if (!courseId || !name) {
            return res.status(400).json({
                message: "courseId and name are required"
            });
        }


        // =========================================
        // VALIDATE COURSE ID
        // =========================================

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }


        // =========================================
        // VALIDATE NAME
        // =========================================

        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            return res.status(400).json({
                message: "Subject name is required"
            });
        }


        // =========================================
        // CHECK COURSE EXISTS
        // =========================================

        const courseExists = await Course.findById(
            courseId
        );


        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const classItem = await Class.findById(courseExists.classId);

        if (!classItem) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        if (!canManageClass(classItem, req.user)) {
            return res.status(403).json({
                message: "You do not have permission to modify this resource"
            });
        }


        // =========================================
        // CREATE SUBJECT
        // =========================================

        const subject = await Subject.create({
            courseId,
            name: name.trim(),
            description: description?.trim() || ""
        });


        return res.status(201).json({
            message: "Subject created successfully",
            subject
        });

    } catch (error) {

        console.error(
            "Create subject error:",
            error
        );


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



// =========================================
// GET SUBJECTS OF A COURSE
// =========================================

const getSubjectsByCourse = async (req, res) => {
    try {

        const { courseId } = req.params;


        // =========================================
        // VALIDATE COURSE ID
        // =========================================

        if (
            !courseId ||
            !mongoose.Types.ObjectId.isValid(courseId)
        ) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }


        // =========================================
        // CHECK COURSE EXISTS
        // =========================================

        const courseExists = await Course.findById(
            courseId
        );


        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // =========================================
        // GET SUBJECTS
        // =========================================

        const subjects = await Subject.find({
            courseId
        })
            .sort({
                createdAt: 1
            });


        return res.status(200).json({
            message: "Subjects fetched successfully",
            subjects
        });

    } catch (error) {

        console.error(
            "Get subjects by course error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
        });
    }
};



// =========================================
// GET ONE SUBJECT
// =========================================

const getSubjectById = async (req, res) => {
    try {

        const { id } = req.params;


        // =========================================
        // VALIDATE SUBJECT ID
        // =========================================

        if (
            !id ||
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                message: "Invalid subject ID"
            });
        }


        // =========================================
        // GET SUBJECT
        // =========================================

        const subject = await Subject.findById(id);


        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }


        return res.status(200).json({
            message: "Subject fetched successfully",
            subject
        });

    } catch (error) {

        console.error(
            "Get subject by ID error:",
            error
        );


        return res.status(500).json({
            message: "Server error"
        });
    }
};



const getManagedSubject = async (subjectId) => {
    const subject = await Subject.findById(subjectId);
    if (!subject) return { subject: null, classItem: null };

    const course = await Course.findById(subject.courseId);
    const classItem = course && await Class.findById(course.classId);
    return { subject, classItem };
};

const addDemoLecture = async (req, res) => {
    try {
        const { subject, classItem } = await getManagedSubject(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        if (!classItem) return res.status(404).json({ message: "Class not found" });
        if (!canManageClass(classItem, req.user)) return res.status(403).json({ message: "You do not have permission to modify this resource" });

        const { title, duration, videoUrl } = req.body;
        if (typeof title !== "string" || !title.trim()) return res.status(400).json({ message: "Lecture title is required" });

        subject.demoLectures.push({ title: title.trim(), duration, videoUrl });
        await subject.save();
        return res.status(201).json({ message: "Demo lecture created successfully", lecture: subject.demoLectures.at(-1) });
    } catch (error) {
        console.error("Create demo lecture error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateDemoLecture = async (req, res) => {
    try {
        const { subject, classItem } = await getManagedSubject(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        if (!classItem) return res.status(404).json({ message: "Class not found" });
        if (!canManageClass(classItem, req.user)) return res.status(403).json({ message: "You do not have permission to modify this resource" });

        const lecture = subject.demoLectures.id(req.params.lectureId);
        if (!lecture) return res.status(404).json({ message: "Demo lecture not found" });
        ["title", "duration", "videoUrl"].forEach((field) => {
            if (req.body[field] !== undefined) lecture[field] = req.body[field];
        });
        await subject.save();
        return res.status(200).json({ message: "Demo lecture updated successfully", lecture });
    } catch (error) {
        console.error("Update demo lecture error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteDemoLecture = async (req, res) => {
    try {
        const { subject, classItem } = await getManagedSubject(req.params.id);
        if (!subject) return res.status(404).json({ message: "Subject not found" });
        if (!classItem) return res.status(404).json({ message: "Class not found" });
        if (!canManageClass(classItem, req.user)) return res.status(403).json({ message: "You do not have permission to modify this resource" });

        const lecture = subject.demoLectures.id(req.params.lectureId);
        if (!lecture) return res.status(404).json({ message: "Demo lecture not found" });
        lecture.deleteOne();
        await subject.save();
        return res.status(200).json({ message: "Demo lecture deleted successfully" });
    } catch (error) {
        console.error("Delete demo lecture error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// =========================================
// EXPORTS
// =========================================

module.exports = {
    createSubject,
    getSubjectsByCourse,
    getSubjectById,
    addDemoLecture,
    updateDemoLecture,
    deleteDemoLecture,
    updateSubject: async (req, res) => {
        try {
            const subject = await Subject.findById(req.params.id);

            if (!subject) return res.status(404).json({ message: "Subject not found" });

            const course = await Course.findById(subject.courseId);
            const classItem = course && await Class.findById(course.classId);

            if (!classItem) return res.status(404).json({ message: "Class not found" });
            if (!canManageClass(classItem, req.user)) {
                return res.status(403).json({ message: "You do not have permission to modify this resource" });
            }

            if (req.body.name !== undefined) {
                if (typeof req.body.name !== "string" || !req.body.name.trim()) {
                    return res.status(400).json({ message: "Subject name is required" });
                }
                subject.name = req.body.name.trim();
            }
            if (req.body.description !== undefined) subject.description = req.body.description;

            await subject.save();
            return res.status(200).json({ message: "Subject updated successfully", subject });
        } catch (error) {
            console.error("Update subject error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    },
    deleteSubject: async (req, res) => {
        try {
            const subject = await Subject.findById(req.params.id);
            if (!subject) return res.status(404).json({ message: "Subject not found" });

            const course = await Course.findById(subject.courseId);
            const classItem = course && await Class.findById(course.classId);

            if (!classItem) return res.status(404).json({ message: "Class not found" });
            if (!canManageClass(classItem, req.user)) {
                return res.status(403).json({ message: "You do not have permission to modify this resource" });
            }

            await Subject.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Subject deleted successfully" });
        } catch (error) {
            console.error("Delete subject error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
};