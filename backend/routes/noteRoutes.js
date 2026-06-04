const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createNote,
    getAllNotes,
    deleteNote,
    updateNote,
    getNoteById,
    incrementViews,
    incrementDownloads,
    getPreviewPDF,
    getProtectedPDF
} = require("../controllers/noteController");

router.post(
    "/",
    protect,
    upload.single("pdf"),
    createNote
);

router.get(
    "/:id/pdf",
    // protect,
    getProtectedPDF
);

router.get(
    "/:id/preview",
    getPreviewPDF
);

router.get("/", getAllNotes);

router.get(
    "/:id",
    getNoteById
);

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

router.put(
    "/:id/download",
    incrementDownloads
);

router.delete("/:id", protect, deleteNote);

module.exports = router;