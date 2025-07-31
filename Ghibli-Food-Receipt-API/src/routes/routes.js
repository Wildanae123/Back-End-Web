// src/routes/routes.js
const express = require("express");
const authRoutes = require("./authRoutes");
const bookRoutes = require("./bookRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const libraryRoutes = require("./libraryRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/library", libraryRoutes);

module.exports = router;
