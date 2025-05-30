// src/models/Book.js
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true, // ISBNs should be unique
      allowNull: true, // Based on your previous frontend, making it optional
    },
    genre: {
      // Consider making this a separate table or ENUM if genres are fixed
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publishedDate: {
      // Store as DATEONLY for easier querying
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    bookCoverUrl: {
      // URL to the image (handle image uploads separately)
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRead: {
      // For tracking reading status in a user's library (this suggests a join table UserBooks)
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    review: {
      // User-specific review (also suggests UserBooks join table)
      type: DataTypes.INTEGER, // Assuming 1-5 stars
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    // Fields from API documentation Key Features (many of these imply more complex relationships)
    cuisineType: { type: DataTypes.STRING, allowNull: true },
    dietaryCategory: { type: DataTypes.STRING, allowNull: true },
    difficultyLevel: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: true,
    },
    // 'ingredients' would likely be a separate related table or a JSONB/array field
    ingredients: { type: DataTypes.JSONB, allowNull: true }, // Example for PostgreSQL
    sampleRecipes: { type: DataTypes.TEXT, allowNull: true }, // Or JSONB for structured data
    authorBio: { type: DataTypes.TEXT, allowNull: true },
    // User reviews would be a separate table related to User and Book
    visibility: {
      // For admin to hide/show
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      // Foreign key for the User who created/owns this book
      type: DataTypes.UUID,
      allowNull: true, // Or false if every book MUST have an owner
      references: {
        model: "Users", // Name of the Users table (Sequelize defaults to plural)
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Or 'CASCADE' if books should be deleted when user is deleted
    },
  });

Book.associate = (models) => {
  Book.belongsTo(models.User, { foreignKey: 'userId', as: 'creator' });
  // Book has many entries in UserBook (users who have this book in their library)
  Book.hasMany(models.UserBook, { foreignKey: 'bookId', as: 'libraryUsers' });
  // Through association for convenience (optional)
  // Book.belongsToMany(models.User, { through: models.UserBook, foreignKey: 'bookId', otherKey: 'userId', as: 'usersInLibrary' });
};

  return Book;
};
