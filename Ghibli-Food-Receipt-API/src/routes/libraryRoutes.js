// src/routes/libraryRoutes.js
const express = require('express');
const libraryController = require('../controllers/libraryController');
const { protect } = require('../middlewares/authMiddleware');
const { validateLibraryEntry, validateBookIdParam } = require('../middlewares/validationMiddleware');

const router = express.Router();

// All library routes are protected as they are user-specific
router.use(protect);

// Route to get all books in the current user's library (can be filtered by status)
router.get('/', libraryController.getUserLibrary);

// Add/Create a new entry in the user's library for a specific book
router.post('/:bookId', validateBookIdParam, validateLibraryEntry, libraryController.addBookToLibrary);

// Update an existing entry in the user's library for a specific book
router.put('/:bookId', validateBookIdParam, validateLibraryEntry, libraryController.updateLibraryEntry);

// Remove a book from the user's library
router.delete('/:bookId', validateBookIdParam, libraryController.removeBookFromLibrary);

module.exports = router;