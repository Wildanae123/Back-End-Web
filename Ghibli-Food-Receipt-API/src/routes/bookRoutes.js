// src/routes/bookRoutes.js
const express = require("express");
const {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByReadingStatus,
  getBooksByFinishedStatus,
} = require("../controllers/bookController"); // Fix import
const { protect } = require("../middlewares/authMiddleware"); // Import protect middleware
const {
  validateBookCreation,
  validateBookUpdate,
} = require("../middlewares/validationMiddleware"); // Import validation middleware

const router = express.Router();

router.get("/", listBooks);
router.get("/:id", getBookById);
router.post("/", protect, validateBookCreation, createBook);
router.put("/:id", protect, validateBookUpdate, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
