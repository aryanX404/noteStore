const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const protect = require("./middleware/authMiddleware");
const cors = require("cors");

dotenv.config({ path: "./backend/.env" });

connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(
    "/uploads",
    express.static("backend/uploads")
); 

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/api/profile", protect, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "NoteStore Backend Running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});