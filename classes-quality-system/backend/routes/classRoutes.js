const express = require("express");

const {
    createClass,
    getClasses,
    getClassById
} = require("../controllers/classController");

const router = express.Router();


// GET all classes
router.get("/", getClasses);


// GET one class
router.get("/:id", getClassById);


// CREATE class
router.post("/", createClass);


module.exports = router;