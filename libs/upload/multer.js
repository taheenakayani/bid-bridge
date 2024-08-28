const multer = require("multer");

// Storage configuration for PDF files (in memory)
const pdfStorage = multer.memoryStorage();
const pdfUpload = multer({ storage: pdfStorage });

module.exports = { pdfUpload };
