// src/controllers/adminController.js
const { User, Book, sequelize } = require("../models"); // Assuming models/index.js exports User, Book, and the sequelize instance
const { Op } = require("sequelize"); // For more complex operators if needed

// --- LIST ALL USERS ---
exports.listAllUsers = async (req, res, next) => {
  try {
    // Basic pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password"] }, // Exclude password hash
      limit,
      offset,
      order: [["createdAt", "DESC"]], // Example ordering
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// --- BULK CREATE BOOKS ---
exports.bulkCreateBooks = async (req, res, next) => {
  try {
    const { books } = req.body; // Assuming req.body.books is an array of book objects

    if (!books || !Array.isArray(books) || books.length === 0) {
      return res
        .status(400)
        .json({
          message: "Request body must contain a non-empty array of books.",
        });
    }

    // Add default values if not provided for each book, e.g., visibility
    const booksToCreate = books.map((book) => ({
      ...book,
      visibility: book.visibility !== undefined ? book.visibility : true, // Default to visible
      isRead: book.isRead || false,
      // Ensure other required fields are present or have defaults in your model
    }));

    // The `validateBulkBooks` middleware should have already validated the structure of each book.
    // Using { validate: true } runs individual model validations for each created record.
    const createdBooks = await Book.bulkCreate(booksToCreate, {
      validate: true,
    });

    res.status(201).json({
      message: `${createdBooks.length} books created successfully.`,
      books: createdBooks,
    });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(400)
        .json({
          message: "Validation error during bulk creation.",
          details: error.errors.map((e) => e.message),
        });
    }
    next(error);
  }
};

// --- VIEW STATS ---
exports.viewStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalBooks = await Book.count();
    const visibleBooks = await Book.count({ where: { visibility: true } });
    const hiddenBooks = await Book.count({ where: { visibility: false } });

    // Example: Most popular genres (Top 5)
    const popularGenres = await Book.findAll({
      attributes: [
        "genre",
        [sequelize.fn("COUNT", sequelize.col("genre")), "count"],
      ],
      group: ["genre"],
      order: [[sequelize.fn("COUNT", sequelize.col("genre")), "DESC"]],
      limit: 5,
      raw: true, // Get plain objects
    });

    res.status(200).json({
      totalUsers,
      totalBooks,
      visibleBooks,
      hiddenBooks,
      popularGenres,
    });
  } catch (error) {
    next(error);
  }
};

// --- DELETE A USER ACCOUNT ---
exports.deleteUserAccount = async (req, res, next) => {
  const adminPerformingDeleteId = req.user.id; // ID of the admin making the request
  const { userId: userIdToDelete } = req.params; // ID of the user account to be deleted

  // Start a Sequelize transaction to ensure all operations succeed or fail together
  const transaction = await sequelize.transaction();

  try {
    // 1. Prevent an admin from deleting their own account
    if (adminPerformingDeleteId === userIdToDelete) {
      await transaction.rollback(); // Rollback, though no DB changes made yet for this check
      return res.status(403).json({
        message:
          "Forbidden: Administrators cannot delete their own account. Please ask another admin to perform this action.",
      });
    }

    // 2. Find the user to be deleted
    const userToDelete = await User.findByPk(userIdToDelete, { transaction });

    if (!userToDelete) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found." });
    }

    // 3. Prevent deleting the last admin account
    if (userToDelete.role === "admin") {
      const adminCount = await User.count({
        where: { role: "admin" },
        transaction,
      });

      // If this user is an admin and there's only 1 admin account (this one), prevent deletion
      if (adminCount <= 1) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "Bad Request: Cannot delete the last administrator account. To delete this account, first promote another user to an admin role.",
        });
      }
    }

    // 4. Handle associated data (e.g., books created/owned by this user)
    // This example assumes your Book model has a 'userId' foreign key that can be set to null.
    // If a book must have an owner, you might reassign to a default admin or prevent deletion.
    // If you have other tables referencing User (e.g., a UserBooks join table for personal libraries),
    // you'd need to handle those associations here as well (e.g., delete entries from UserBooks).
    await Book.update(
      { userId: null }, // Set the creator/owner to null
      {
        where: { userId: userIdToDelete }, // Find all books associated with this user
        transaction,
      }
    );
    // Example for a hypothetical UserBooks join table (if you had one):
    // if (models.UserBooks) { // Check if UserBooks model exists
    //   await models.UserBooks.destroy({ where: { userId: userIdToDelete }, transaction });
    // }

    // 5. Delete the user
    await userToDelete.destroy({ transaction });

    // 6. If all operations were successful, commit the transaction
    await transaction.commit();

    res
      .status(200)
      .json({
        message: `User account with ID ${userIdToDelete} has been successfully deleted and associated data handled.`,
      });
  } catch (error) {
    // If any operation fails, rollback the entire transaction
    if (transaction) await transaction.rollback();
    console.error("Error deleting user account:", error);
    next(error); // Pass to your global error handler
  }
};

// --- SET BOOK VISIBILITY ---
exports.setBookVisibility = async (req, res, next) => {
  try {
    const { id } = req.params; // Book ID
    const { isVisible } = req.body; // Expecting { "isVisible": true } or { "isVisible": false }

    if (typeof isVisible !== "boolean") {
      return res
        .status(400)
        .json({
          message: "isVisible field must be a boolean (true or false).",
        });
    }

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.visibility = isVisible;
    await book.save(); // Save the changes

    res.status(200).json({
      message: `Book visibility updated to ${isVisible}.`,
      book,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    next(error);
  }
};
