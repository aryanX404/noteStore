const Note = require("../models/Note");
const fs = require("fs");
const path = require("path");
const createNote = async (req, res) => {

    try {

        const {
            title,
            subject,
            semester,
            price,
            description
        } = req.body;

        const note = await Note.create({

            title,
            subject,
            semester,
            price,
            description,

            pdfFile: req.file
                ? req.file.filename
                : null,

            uploader: req.user.userId

        });

        res.status(201).json({

            message: "Note created successfully",

            note

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const getAllNotes = async (req, res) => {

    try {

        const notes = await Note.find()
            .populate("uploader", "name email");

        res.status(200).json(notes);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteNote = async (req, res) => {

    try {

        const note = await Note.findById(
            req.params.id
        );

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });

        }

        if (
            note.uploader.toString() !==
            req.user.userId
        ) {

            return res.status(403).json({
                message:
                    "Not authorized to delete this note"
            });

        }

        if (note.pdfFile) {

            const filePath = path.join(
                __dirname,
                "../uploads",
                note.pdfFile
            );

            if (
                fs.existsSync(filePath)
            ) {

                fs.unlinkSync(filePath);

            }

        }

        await Note.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({

            message:
                "Note deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const updateNote = async (req, res) => {

    try {

        const note = await Note.findById(
            req.params.id
        );

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });

        }

        if (
            note.uploader.toString() !==
            req.user.userId
        ) {

            return res.status(403).json({
                message:
                    "Not authorized"
            });

        }

        const {
            title,
            subject,
            semester,
            description,
            price
        } = req.body;

        note.title =
            title || note.title;

        note.subject =
            subject || note.subject;

        note.semester =
            semester || note.semester;

        note.description =
            description || note.description;

        note.price =
            price || note.price;

        await note.save();

        res.status(200).json({

            message:
                "Note updated successfully",

            note

        });

    } catch (error) {

        res.status(500).json({

            message:
                error.message

        });

    }

};

const incrementViews = async (
    req,
    res
) => {

    try {

        const note =
            await Note.findById(
                req.params.id
            );

        if (!note) {

            return res
                .status(404)
                .json({
                    message:
                        "Note not found"
                });

        }

        note.views += 1;

        await note.save();

        res.status(200).json({
            views: note.views
        });

    } catch (error) {

        res.status(500).json({
            message:
                error.message
        });

    }

};

module.exports = {
    createNote,
    getAllNotes,
    deleteNote,
    updateNote,
    incrementViews
};
