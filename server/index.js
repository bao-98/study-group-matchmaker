// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToDb } = require("./config/db");
const { setupStudyPostsCollection } = require("./models/studyPosts");

dotenv.config();

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const {
  setupCoursesCollection,
  insertSampleCourses,
} = require("./models/courses");
const coursesRouter = require("./routes/courses");
const studyPostsRouter = require("./routes/studyPosts");

app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/study-posts", studyPostsRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// Start server after DB connects
const PORT = process.env.PORT || 3000;

connectToDb().then(async () => {
  await setupCoursesCollection();
  await insertSampleCourses();
  await setupStudyPostsCollection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
