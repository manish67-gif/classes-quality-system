const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: [true, "Class is required"],
            index: true
        },

        name: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
            minlength: [2, "Course name must be at least 2 characters"],
            maxlength: [150, "Course name cannot exceed 150 characters"]
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Course description cannot exceed 2000 characters"]
        },

        fees: {
            type: Number,
            required: [true, "Course fees are required"],
            min: [0, "Course fees cannot be negative"]
        },

        duration: {
            type: String,
            trim: true,
            maxlength: [100, "Course duration cannot exceed 100 characters"]
        },

        rating: {
            type: Number,
            min: [0, "Rating cannot be below 0"],
            max: [5, "Rating cannot exceed 5"],
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Helps when fetching all courses belonging to a class
courseSchema.index({ classId: 1 });

module.exports = mongoose.model("Course", courseSchema);