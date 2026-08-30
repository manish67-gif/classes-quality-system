const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        teachingQuality: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        conceptClarity: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        doubtSolving: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        studyMaterial: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        overallRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Review", reviewSchema);