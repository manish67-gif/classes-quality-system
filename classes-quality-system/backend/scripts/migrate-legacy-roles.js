const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");

dotenv.config();

const migrateLegacyRoles = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.updateMany(
        { role: "institute" },
        { $set: { role: "class" } }
    );

    console.log(`Converted ${result.modifiedCount} institute account(s) to class.`);
    await mongoose.disconnect();
};

migrateLegacyRoles().catch(async (error) => {
    console.error("Role migration failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
});
