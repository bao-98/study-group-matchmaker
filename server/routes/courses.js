// server/routes/courses.js
const express = require("express");
const router = express.Router();
const { getAllCourses } = require("../models/courses");

router.get("/", async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    console.error("❌ Failed to fetch courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
