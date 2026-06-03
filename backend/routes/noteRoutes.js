const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createNote,
    getAllNotes,
    deleteNote
} = require("../controllers/noteController");

router.post(
    "/",
    protect,
    upload.single("pdf"),
    createNote
);

router.get("/", getAllNotes);

router.delete("/:id", protect, deleteNote);

module.exports = router;