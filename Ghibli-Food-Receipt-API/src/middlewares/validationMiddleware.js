// src/middlewares/validationMiddleware.js
const { body, validationResult } = require("express-validator");
const { param } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateRegistration = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  handleValidationErrors,
];

exports.validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

exports.validateBookCreation = [
  body("title").notEmpty().withMessage("Title is required").trim().escape(),
  body("author").notEmpty().withMessage("Author is required").trim().escape(),
  body("genre").notEmpty().withMessage("Genre is required").trim().escape(),
  // Add more validations as needed for other fields like ISBN, description, etc.
  body("isbn").optional().isISBN().withMessage("Invalid ISBN format"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description too long"),
  handleValidationErrors,
];

exports.validateBookUpdate = [
  // Often similar to creation but fields can be optional
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .escape(),
  body("author")
    .optional()
    .notEmpty()
    .withMessage("Author is required")
    .trim()
    .escape(),
  body("genre")
    .optional()
    .notEmpty()
    .withMessage("Genre is required")
    .trim()
    .escape(),
  body("isbn").optional().isISBN().withMessage("Invalid ISBN format"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description too long"),
  handleValidationErrors,
];

exports.validateUserProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .escape(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("role")
    .optional()
    .trim()
    .isIn(["user", "guest", "admin"])
    .withMessage(
      "Invalid role specified. Allowed roles are: user, guest, admin."
    ),
  // IMPORTANT: Even if 'admin' is allowed here, the controller MUST add further checks
  // for who is allowed to set the 'admin' role.

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }
    next();
  },
];

exports.validateBulkBooks = [
  // Example: Assuming req.body.books is an array
  body("books").isArray().withMessage("Books must be an array"),
  body("books.*.title")
    .notEmpty()
    .withMessage("Book title is required")
    .trim()
    .escape(),
  body("books.*.author")
    .notEmpty()
    .withMessage("Book author is required")
    .trim()
    .escape(),
  // Add other necessary validations for each book object in the array
  handleValidationErrors,
];

exports.validateLibraryEntry = [
  // For POST body (adding to library) or PUT body (updating entry)
  body("status")
    .optional()
    .isIn(["to-read", "reading", "finished", "on-hold", "dnf"])
    .withMessage(
      "Status must be one of: 'to-read', 'reading', 'finished', 'on-hold', 'dnf'."
    ),
  body("userRating")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),
  body("userNotes")
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Notes cannot exceed 5000 characters."),
  handleValidationErrors,
];

exports.validateBookIdParam = [
  param("bookId").isUUID().withMessage("Book ID must be a valid UUID."),
  handleValidationErrors,
];
