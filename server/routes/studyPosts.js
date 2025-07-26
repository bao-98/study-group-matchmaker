const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  deletePostById,
  updatePostById,
} = require("../models/studyPosts");

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error("❌ Failed to fetch posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new post
router.post("/", async (req, res) => {
  const { courseCode, timeSlot, description, studentName } = req.body;
  if (!courseCode || !timeSlot || !description || !studentName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const id = await createPost({ courseCode, timeSlot, description, studentName });
    res.status(201).json({ message: "Post created", id });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a post by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deletePostById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ PUT to update a post by ID
router.put("/:id", async (req, res) => {
  const { courseCode, timeSlot, description, studentName } = req.body;
  if (!courseCode || !timeSlot || !description || !studentName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updated = await updatePostById(req.params.id, { courseCode, timeSlot, description, studentName });
    if (!updated) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post updated" });
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
