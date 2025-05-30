// src/controllers/bookController.js
const { Op } = require('sequelize');
const { Book, UserBook, User } = require('../models');

// --- LIST ALL BOOKS (with pagination and filtering) ---
exports.listBooks = async (req, res, next) => {
  try {
    const { search, genre: genreQuery, author: authorQuery, page, limit: queryLimit } = req.query;
    let whereClause = { visibility: true }; // Only show visible books by default

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`, // Case-insensitive search for title
      };
    }
    if (genreQuery) {
      whereClause.genre = {
        [Op.iLike]: `%${genreQuery}%`,
      };
    }
    if (authorQuery) {
      whereClause.author = {
        [Op.iLike]: `%${authorQuery}%`,
      };
    }

    // --- TODO: Add pagination --- IMPLEMENTED ---
    const currentPage = parseInt(page, 10) || 1;
    const limit = parseInt(queryLimit, 10) || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['title', 'ASC']], // Example: order by title
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: currentPage,
      books,
    });
  } catch (error) {
    next(error);
  }
};

// --- GET BOOK BY ID --- (Already implemented, ensure visibility check)
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findOne({
      where: { id: req.params.id, visibility: true }
    });
    if (!book) {
      return res.status(404).json({ message: 'Book not found or not visible' });
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// --- CREATE BOOK --- (Already implemented)
exports.createBook = async (req, res, next) => {
  try {
    const {
      title, author, isbn, genre, description, publishedDate,
      bookCoverUrl, isRead, review, cuisineType, dietaryCategory,
      difficultyLevel, ingredients, sampleRecipes, authorBio,
    } = req.body;

    const userId = req.user.id;

    if (!title || !author || !genre) {
      return res.status(400).json({ message: 'Title, Author, and Genre are required.' });
    }

    // Assuming req.user.id is available if books are user-specific upon creation
    // const userId = req.user ? req.user.id : null;

    const newBook = await Book.create({
      title, author, isbn: isbn || null, genre, description: description || null,
      publishedDate: publishedDate || null, bookCoverUrl: bookCoverUrl || null,
      isRead: isRead || false, review: isRead && review ? review : null,
      cuisineType: cuisineType || null, dietaryCategory: dietaryCategory || null,
      difficultyLevel: difficultyLevel || null, ingredients: ingredients || null,
      sampleRecipes: sampleRecipes || null, authorBio: authorBio || null,
      visibility: true,
      userId,
    });

    res.status(201).json(newBook);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    next(error);
  }
};

// --- UPDATE AN EXISTING BOOK ---
exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to update this book.' });
    }

    // Fields that can be updated (excluding id, visibility handled by admin, etc.)
    const {
      title, author, isbn, genre, description, publishedDate,
      bookCoverUrl, isRead, review, cuisineType, dietaryCategory,
      difficultyLevel, ingredients, sampleRecipes, authorBio,
    } = req.body;

    // Update only the fields that are provided in the request body
    const updatedBook = await book.update({
      title: title !== undefined ? title : book.title,
      author: author !== undefined ? author : book.author,
      isbn: isbn !== undefined ? isbn : book.isbn,
      genre: genre !== undefined ? genre : book.genre,
      description: description !== undefined ? description : book.description,
      publishedDate: publishedDate !== undefined ? publishedDate : book.publishedDate,
      bookCoverUrl: bookCoverUrl !== undefined ? bookCoverUrl : book.bookCoverUrl,
      isRead: isRead !== undefined ? isRead : book.isRead,
      review: isRead !== undefined ? (isRead && review ? review : null) : book.review,
      cuisineType: cuisineType !== undefined ? cuisineType : book.cuisineType,
      dietaryCategory: dietaryCategory !== undefined ? dietaryCategory : book.dietaryCategory,
      difficultyLevel: difficultyLevel !== undefined ? difficultyLevel : book.difficultyLevel,
      ingredients: ingredients !== undefined ? ingredients : book.ingredients,
      sampleRecipes: sampleRecipes !== undefined ? sampleRecipes : book.sampleRecipes,
      authorBio: authorBio !== undefined ? authorBio : book.authorBio,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    }
    next(error);
  }
};

// --- DELETE A BOOK ---
exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to delete this book.' });
    }

    await book.destroy();
    res.status(204).send(); // No content to send back
  } catch (error) {
    next(error);
  }
};

// --- GET BOOKS BY READING STATUS (isRead: false) ---
exports.getBooksByReadingStatus = async (req, res, next) => {
  try {
    const userId = req.user.id; // Authenticated user's ID
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: userBooks } = await UserBook.findAndCountAll({
      where: {
        userId,
        status: 'reading', // Or ['reading', 'to-read'] if you want to combine
      },
      include: [{
        model: Book,
        as: 'Book', // Use the alias defined in UserBook.associate if you set one, or just model name
        where: { visibility: true }, // Ensure the book itself is visible
        required: true // Ensures only UserBook entries with an existing, visible Book are returned
      }],
      limit,
      offset,
      order: [[{ model: Book, as: 'Book' }, 'title', 'ASC']], // Order by book title
    });

    const books = userBooks.map(ub => ({ ...ub.Book.toJSON(), userLibraryInfo: { status: ub.status, userRating: ub.userRating, userNotes: ub.userNotes, userBookId: ub.id } }));


    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books,
    });
  } catch (error) {
    next(error);
  }
};

// --- GET BOOKS BY FINISHED STATUS (isRead: true) ---
exports.getBooksByFinishedStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: userBooks } = await UserBook.findAndCountAll({
      where: {
        userId,
        status: 'finished',
      },
      include: [{
        model: Book,
        as: 'Book',
        where: { visibility: true },
        required: true
      }],
      limit,
      offset,
      order: [[{ model: Book, as: 'Book' }, 'title', 'ASC']],
    });

    const books = userBooks.map(ub => ({ ...ub.Book.toJSON(), userLibraryInfo: { status: ub.status, userRating: ub.userRating, userNotes: ub.userNotes, userBookId: ub.id } }));

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books,
    });
  } catch (error) {
    next(error);
  }
};