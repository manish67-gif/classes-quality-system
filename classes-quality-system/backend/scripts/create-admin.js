const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dns = require("dns");
const User = require("../models/User");

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const createAdmin = async () => {
    const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Platform Admin" } = process.env;

    if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required");
    }

    if (ADMIN_PASSWORD.length < 6) {
        throw new Error("ADMIN_PASSWORD must be at least 6 characters");
    }

    await mongoose.connect(MONGO_URI);
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const user = await User.findOneAndUpdate(
        { email: ADMIN_EMAIL.trim().toLowerCase() },
        {
            name: ADMIN_NAME.trim(),
            email: ADMIN_EMAIL.trim().toLowerCase(),
            password,
            role: "admin"
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    console.log(`Admin account ready: ${user.email}`);
    await mongoose.disconnect();
};

createAdmin().catch(async (error) => {
    console.error("Admin provisioning failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
});
