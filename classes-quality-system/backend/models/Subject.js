const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
            index: true
        },

        name: {
            type: String,
            required: [true, "Subject name is required"],
            trim: true,
            minlength: [2, "Subject name must be at least 2 characters"],
            maxlength: [150, "Subject name cannot exceed 150 characters"]
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Subject description cannot exceed 2000 characters"]
        },

        rating: {
            type: Number,
            min: [0, "Rating cannot be below 0"],
            max: [5, "Rating cannot exceed 5"],
            default: null
        },

        demoLectures: [
            {
                title: {
                    type: String,
                    required: [true, "Lecture title is required"],
                    trim: true,
                    maxlength: [200, "Lecture title cannot exceed 200 characters"]
                },

                duration: {
                    type: String,
                    trim: true,
                    maxlength: [50, "Lecture duration cannot exceed 50 characters"]
                },

                videoUrl: {
                    type: String,
                    trim: true,
                    maxlength: [1000, "Video URL cannot exceed 1000 characters"]
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Helps when fetching subjects for a course:
// /api/subjects/course/:id
subjectSchema.index({ courseId: 1 });

module.exports = mongoose.model("Subject", subjectSchema);