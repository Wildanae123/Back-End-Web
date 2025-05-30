// src/controllers/libraryController.js
const { UserBook, Book, User } = require('../models'); // User may not be needed directly here but good to have
const { Op } = require('sequelize');

// --- ADD A BOOK TO THE CURRENT USER'S LIBRARY ---
exports.addBookToLibrary = async (req, res, next) => {
  const userId = req.user.id; // From 'protect' middleware
  const { bookId } = req.params;
  const { status, userRating, userNotes } = req.body;

  try {
    // 1. Check if the book itself exists and is visible
    const book = await Book.findOne({ where: { id: bookId, visibility: true } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found or not available.' });
    }

    // 2. Check if the book is already in the user's library
    const existingEntry = await UserBook.findOne({
      where: { userId, bookId },
    });

    if (existingEntry) {
      return res.status(409).json({
        message: 'This book is already in your library. Use the update (PUT) endpoint to change its status or details.',
        libraryEntry: existingEntry,
      });
    }

    // 3. Create the new library entry
    const newLibraryEntry = await UserBook.create({
      userId,
      bookId,
      status: status || 'to-read', // Default status if not provided
      userRating: userRating || null,
      userNotes: userNotes || null,
    });

    // Optionally, include book details in the response
    const entryWithBook = await UserBook.findByPk(newLibraryEntry.id, {
        include: [{ model: Book, as: 'Book' }] // Ensure 'Book' is the correct alias or model name
    });

    res.status(201).json({
      message: 'Book added to your library successfully.',
      libraryEntry: entryWithBook,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    next(error);
  }
};

// --- UPDATE AN EXISTING ENTRY IN THE USER'S LIBRARY ---
exports.updateLibraryEntry = async (req, res, next) => {
  const userId = req.user.id;
  const { bookId } = req.params; // We'll find the UserBook entry via userId and bookId
  const { status, userRating, userNotes } = req.body;

  try {
    const libraryEntry = await UserBook.findOne({
      where: { userId, bookId },
    });

    if (!libraryEntry) {
      return res.status(404).json({ message: 'Book not found in your library. Add it first.' });
    }

    // Update only provided fields
    if (status !== undefined) libraryEntry.status = status;
    if (userRating !== undefined) libraryEntry.userRating = userRating === '' ? null : userRating; // Allow clearing rating
    if (userNotes !== undefined) libraryEntry.userNotes = userNotes === '' ? null : userNotes; // Allow clearing notes

    await libraryEntry.save();

    const updatedEntryWithBook = await UserBook.findByPk(libraryEntry.id, {
        include: [{ model: Book, as: 'Book' }]
    });

    res.status(200).json({
      message: 'Library entry updated successfully.',
      libraryEntry: updatedEntryWithBook,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    next(error);
  }
};

// --- REMOVE A BOOK FROM THE CURRENT USER'S LIBRARY ---
exports.removeBookFromLibrary = async (req, res, next) => {
  const userId = req.user.id;
  const { bookId } = req.params;

  try {
    const libraryEntry = await UserBook.findOne({
      where: { userId, bookId },
    });

    if (!libraryEntry) {
      return res.status(404).json({ message: 'Book not found in your library.' });
    }

    await libraryEntry.destroy();
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    next(error);
  }
};


// --- GET ALL BOOKS IN THE CURRENT USER'S LIBRARY (Optional - can replace/enhance existing bookController functions) ---
exports.getUserLibrary = async (req, res, next) => {
  const userId = req.user.id;
  const { status, page, limit: queryLimit } = req.query;

  try {
    const currentPage = parseInt(page, 10) || 1;
    const limit = parseInt(queryLimit, 10) || 10;
    const offset = (currentPage - 1) * limit;

    let whereClauseUserBook = { userId };
    if (status) {
      whereClauseUserBook.status = status;
    }

    const { count, rows: userBooks } = await UserBook.findAndCountAll({
      where: whereClauseUserBook,
      include: [{
        model: Book,
        as: 'Book', // Ensure this alias matches your UserBook model association
        where: { visibility: true }, // Only include visible books
        required: true // INNER JOIN to only get UserBook entries with an existing, visible Book
      }],
      limit,
      offset,
      order: [[{ model: Book, as: 'Book' }, 'title', 'ASC']], // Order by book title
    });

    // Transform data to nest UserBook details within each book or provide a combined object
    const libraryBooks = userBooks.map(ub => ({
      ...ub.Book.toJSON(), // Spread book details
      userLibraryInfo: {    // Add user-specific library info
        userBookId: ub.id,
        status: ub.status,
        userRating: ub.userRating,
        userNotes: ub.userNotes,
        addedAt: ub.createdAt, // Timestamps from UserBook entry
        updatedAt: ub.updatedAt
      }
    }));

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage,
      books: libraryBooks,
    });
  } catch (error) {
    next(error);
  }
};