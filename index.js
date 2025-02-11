require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("portfolio");
    const usersCollection = db.collection("users");
    const blogsCollection = db.collection("blogs");
    const projectsCollection = db.collection("projects");
    const messagesCollection = db.collection("messages");

    // User Registration
    app.post("/api/v1/register", async (req, res) => {
      const { username, email } = req.body;
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await usersCollection.insertOne({ username, email, password: hashedPassword, role: "user" });
      res.status(201).json({ message: "User registered successfully!" });
    });
    // CRUD for Blogs
    app.post("/api/v1/blogs", async (req, res) => {
      const newBlog = req.body;
      await blogsCollection.insertOne(newBlog);
      res.status(201).json({ message: "Blog created successfully!" });
    });

    app.get("/api/v1/blogs", async (req, res) => {
      const blogs = await blogsCollection.find().toArray();
      res.json(blogs);
    });

    app.delete("/api/v1/blogs/:id", async (req, res) => {
      const { id } = req.params;
      await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      res.json({ message: "Blog deleted successfully!" });
    });

    // CRUD for Projects
    app.post("/api/v1/projects", async (req, res) => {
      const newProject = req.body;
      await projectsCollection.insertOne(newProject);
      res.status(201).json({ message: "Project added successfully!" });
    });

    app.get("/api/v1/projects", async (req, res) => {
      const projects = await projectsCollection.find().toArray();
      res.json(projects);
    });

    app.delete("/api/v1/projects/:id", async (req, res) => {
      const { id } = req.params;
      await projectsCollection.deleteOne({ _id: new ObjectId(id) });
      res.json({ message: "Project deleted successfully!" });
    });

    // Contact Messages
    app.post("/api/v1/messages", async (req, res) => {
      const message = req.body;
      await messagesCollection.insertOne(message);
      res.status(201).json({ message: "Message received successfully!" });
    });

    app.get("/api/v1/messages", async (req, res) => {
      const messages = await messagesCollection.find().toArray();
      res.json(messages);
    });
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } finally {}
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.json({ message: "Portfolio Backend is running!" });
});
