# study-group-matchmaker
Match students for group study sessions by course and time slot.
**Live Demo:** [https://study-group-frontend.onrender.com](https://study-group-frontend.onrender.com)

---

## 🚀 How to Run the Project Locally

1. Clone the repo  
2. Navigate to `/server` and run:

npm install
node index.js or npm run dev

3. Navigate to `/client` and run:
npm install
npm start

---

## 🌟 Features

- Create, edit, and delete study posts
- Course dropdown auto-loads from MongoDB
- Search, sort, and filter posts
- Responsive and styled with custom CSS
- Works with real MongoDB Atlas backend

---

## 🧭 How to Use This App

- Fill out the form to create a post
- Use the dropdowns to sort or filter
- Click ✏️ Edit or 🗑️ Delete to modify posts

---

## 🔗 References

- MongoDB Node.js Docs  
- React useEffect + useState  
- Render Deployment Docs  
- See code in:
- `server/models/studyPosts.js` for database logic
- `client/src/App.js` for React app

---

## 📡 API Documentation

### 🔸 `GET /api/v1/study-posts`
- Returns all study posts

### 🔸 `POST /api/v1/study-posts`
- **Body**: `{ courseCode, timeSlot, description, studentName }`

### 🔸 `PUT /api/v1/study-posts/:id`
- Updates a post

### 🔸 `DELETE /api/v1/study-posts/:id`
- Deletes a post

### 🔸 `GET /api/v1/courses`
- Returns course list
