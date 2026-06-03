const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },
    
    pdfFile: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Note", noteSchema);