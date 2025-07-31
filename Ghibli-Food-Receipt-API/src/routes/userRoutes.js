// src/routes/userRoutes.js
const express = require("express");
const userControllerModule = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const {
  validateUserProfileUpdate,
} = require("../middlewares/validationMiddleware");

const {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteCurrentUserAccount,
} = userControllerModule;

const router = express.Router();

router.use(protect);

router.get("/me", getCurrentUserProfile);
router.put("/me", validateUserProfileUpdate, updateCurrentUserProfile);
router.delete("/me", deleteCurrentUserAccount);

module.exports = router;
