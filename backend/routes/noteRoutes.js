const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createNote,
    getAllNotes,
    deleteNote,
    updateNote,
    incrementViews
} = require("../controllers/noteController");

router.post(
    "/",
    protect,
    upload.single("pdf"),
    createNote
);

router.get("/", getAllNotes);

router.put(
    "/:id",
    protect,
    upload.single("pdf"),
    updateNote
);

router.put(
    "/:id/view",
    incrementViews
);

router.delete("/:id", protect, deleteNote);

module.exports = router;