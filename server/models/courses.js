// server/models/courses.js
const { getDb } = require("../config/db");

const coursesCollectionName = "courses";

const courseSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "name"],
      properties: {
        code: { bsonType: "string" },
        name: { bsonType: "string" }
      }
    }
  }
};

async function setupCoursesCollection() {
  const db = getDb();
  const collections = await db.listCollections().toArray();
  const exists = collections.some(col => col.name === coursesCollectionName);

  if (!exists) {
    await db.createCollection(coursesCollectionName, courseSchema);
    console.log("✅ 'courses' collection created.");
  }
}

async function insertSampleCourses() {
  const db = getDb();
  const count = await db.collection(coursesCollectionName).countDocuments();

  if (count === 0) {
    await db.collection(coursesCollectionName).insertMany([
      { code: "CPSC2600", name: "Web Application Development" },
      { code: "MATH123", name: "Calculus I" },
      { code: "ENGL1100", name: "College Writing" }
    ]);
    console.log("📘 Sample courses inserted.");
  }
}

async function getAllCourses() {
  const db = getDb();
  return await db.collection(coursesCollectionName).find({}).toArray();
}

module.exports = {
  setupCoursesCollection,
  insertSampleCourses,
  getAllCourses
};
