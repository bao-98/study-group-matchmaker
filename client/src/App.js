import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_BASE = "https://study-group-api-4wu8.onrender.com/api/v1";

  const [studyPosts, setStudyPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: "",
    timeSlot: "",
    description: "",
    studentName: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState(false);

  const [sortBy, setSortBy] = useState("newest");
  const [filterCourse, setFilterCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/study-posts`)
      .then(res => res.json())
      .then(data => {
        let posts = [...data];

        if (filterCourse) {
          posts = posts.filter(p => p.courseCode === filterCourse);
        }

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          posts = posts.filter(p =>
            p.description.toLowerCase().includes(term) ||
            p.studentName.toLowerCase().includes(term)
          );
        }

        if (sortBy === "newest") {
          posts.reverse();
        } else if (sortBy === "course") {
          posts.sort((a, b) => a.courseName.localeCompare(b.courseName));
        }

        setStudyPosts(posts);
      })
      .catch(err => {
        console.error("❌ Failed to fetch study posts:", err);
        setMessage("❌ Could not load posts.");
      });
  }, [sortBy, filterCourse, searchTerm]);

  useEffect(() => {
    fetch(`${API_BASE}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => {
        console.error("❌ Failed to fetch courses:", err);
        setLoadError(true);
      });
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMessage("");

    const { courseCode, timeSlot, description, studentName } = formData;
    if (!courseCode || !timeSlot || !description || !studentName) {
      setMessage("❌ All fields are required.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/study-posts/${editingId}`
      : `${API_BASE}/study-posts`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(() => {
        setMessage(editingId ? "✅ Post updated successfully!" : "✅ Post submitted successfully!");
        setFormData({
          courseCode: "",
          timeSlot: "",
          description: "",
          studentName: ""
        });
        setEditingId(null);
        refreshPosts();
      })
      .catch(err => {
        console.error("❌ Error submitting:", err);
        setMessage("❌ Error submitting post.");
      });
  };

  const handleDelete = id => {
    fetch(`${API_BASE}/study-posts/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
      })
      .then(() => {
        setMessage("✅ Post deleted.");
        refreshPosts();
      })
      .catch(err => {
        console.error("❌ Error deleting:", err);
        setMessage("❌ Could not delete post.");
      });
  };

  const handleEdit = post => {
    setFormData({
      courseCode: post.courseCode,
      timeSlot: post.timeSlot,
      description: post.description,
      studentName: post.studentName
    });
    setEditingId(post._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refreshPosts = () => {
    setSortBy(prev => prev); // dummy trigger to refresh
  };

  return (
    <div className="app-container">
      <h1 className="main-heading">📚 Study Group Matchmaker</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <h2 className="section-heading">✍️ Create a Post</h2>

        <label>
          Course:
          <select
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a course --</option>
            {courses.map(course => (
              <option key={course._id} value={course.code}>
                {course.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Time Slot:
          <input
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Your Name:
          <input
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">
          {editingId ? "Update Post" : "Post Study Group"}
        </button>
      </form>

      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
      {loadError && (
        <p style={{ color: "red" }}>⚠️ Could not load course list.</p>
      )}

      <div className="sort-filter-bar">
        <label>
          Sort by:{" "}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">🕒 Newest First</option>
            <option value="course">📚 Course Name</option>
          </select>
        </label>

        <label>
          Filter by Course:{" "}
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
          >
            <option value="">-- All Courses --</option>
            {courses.map(course => (
              <option key={course._id} value={course.code}>
                {course.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Search:{" "}
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search description or name"
          />
        </label>
      </div>

      <h2 className="section-heading">📝 Study Posts</h2>
      {studyPosts.length === 0 ? (
        <p>No study posts yet.</p>
      ) : (
        <ul className="posts-list">
          {studyPosts.map(post => (
            <li key={post._id} className="post-card">
              <p><strong>📘 Course:</strong> {post.courseName || post.courseCode}</p>
              <p><strong>🕐 Time:</strong> {post.timeSlot}</p>
              <p><strong>📝 Description:</strong> {post.description}</p>
              <p><strong>👤 By:</strong> {post.studentName}</p>
              <div className="button-row">
                <button onClick={() => handleEdit(post)}>✏️ Edit</button>
                <button onClick={() => handleDelete(post._id)}>🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
