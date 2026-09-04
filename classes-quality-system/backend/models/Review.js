const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student is required"],
            index: true
        },

        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: [true, "Subject is required"],
            index: true
        },

        teachingQuality: {
            type: Number,
            required: [true, "Teaching quality rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"]
        },

        conceptClarity: {
            type: Number,
            required: [true, "Concept clarity rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"]
        },

        doubtSolving: {
            type: Number,
            required: [true, "Doubt solving rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"]
        },

        studyMaterial: {
            type: Number,
            required: [true, "Study material rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"]
        },

        overallRating: {
            type: Number,
            required: [true, "Overall rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"]
        },

        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
            minlength: [2, "Comment must be at least 2 characters"],
            maxlength: [2000, "Comment cannot exceed 2000 characters"]
        }
    },
    {
        timestamps: true
    }
);

// A student can submit only one review for a particular subject.
reviewSchema.index(
    { studentId: 1, subjectId: 1 },
    { unique: true }
);

// Helps when fetching reviews for a subject.
reviewSchema.index({ subjectId: 1, createdAt: -1 });

// Helps when fetching reviews submitted by a student.
reviewSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);