// src/routes/adminRoutes.js
const express = require("express");
const {
  listAllUsers,
  bulkCreateBooks,
  viewStats,
  deleteUserAccount,
  setBookVisibility,
} = require("../controllers/adminController"); // Fix import
const { protect, authorizeAdmin } = require("../middlewares/authMiddleware"); // Import protect and authorizeAdmin middleware
const { validateBulkBooks } = require("../middlewares/validationMiddleware"); // Import validation middleware

const router = express.Router();

router.use(protect);
router.use(authorizeAdmin);

router.get("/users", listAllUsers);
router.post("/books/bulk", validateBulkBooks, bulkCreateBooks);
router.get("/stats", viewStats);
router.delete("/users/:userId", deleteUserAccount);
router.patch("/books/:id/visibility", setBookVisibility);

module.exports = router;
