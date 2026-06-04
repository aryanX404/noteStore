const fs = require("fs");

const path = require("path");

const {
    PDFDocument
} = require("pdf-lib");

async function createPreviewPDF(
    originalFile,
    previewFile
) {

    const pdfBytes =
        fs.readFileSync(
            originalFile
        );

    const originalPdf =
        await PDFDocument.load(
            pdfBytes
        );

    const previewPdf =
        await PDFDocument.create();

    const pagesToCopy =
        Math.min(
            2,
            originalPdf.getPageCount()
        );

    const copiedPages =
        await previewPdf.copyPages(
            originalPdf,
            [...Array(pagesToCopy).keys()]
        );

    copiedPages.forEach(
        page =>
            previewPdf.addPage(page)
    );

    const previewBytes =
        await previewPdf.save();

    fs.writeFileSync(
        previewFile,
        previewBytes
    );

}

module.exports =
    createPreviewPDF;