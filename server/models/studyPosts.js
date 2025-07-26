const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

const collectionName = "studyPosts";

async function setupStudyPostsCollection() {
  const db = getDb();
  const collections = await db.listCollections().toArray();
  const exists = collections.some(col => col.name === collectionName);

  if (!exists) {
    await db.createCollection(collectionName);
    console.log("✅ 'studyPosts' collection created.");
  }
}

async function getAllPosts() {
  const db = getDb();
  return await db.collection(collectionName).find({}).toArray();
}

async function createPost(postData) {
  const db = getDb();
  const course = await db.collection("courses").findOne({ code: postData.courseCode });

  if (!course) throw new Error("Course not found");

  const postWithCourseName = { ...postData, courseName: course.name };
  const result = await db.collection(collectionName).insertOne(postWithCourseName);
  return result.insertedId;
}

async function deletePostById(id) {
  const db = getDb();
  const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// ✅ New: Update post
async function updatePostById(id, postData) {
  const db = getDb();

  const course = await db.collection("courses").findOne({ code: postData.courseCode });
  if (!course) throw new Error("Course not found");

  const updatedData = {
    ...postData,
    courseName: course.name
  };

  const result = await db.collection(collectionName).updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );

  return result.modifiedCount > 0;
}

module.exports = {
  setupStudyPostsCollection,
  getAllPosts,
  createPost,
  deletePostById,
  updatePostById
};
