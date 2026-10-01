const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            trim: true
        },

        contactNumber: {
            type: String,
            trim: true
        },

        website: {
            type: String,
            trim: true
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Class", classSchema);