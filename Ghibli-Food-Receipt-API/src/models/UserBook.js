// src/models/UserBook.js
module.exports = (sequelize, DataTypes) => {
  const UserBook = sequelize.define('UserBook', {
    id: { // Optional: if you want a separate primary key for this table
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // userId and bookId will be added via associations or defined here as FKs
    status: {
      type: DataTypes.ENUM('to-read', 'reading', 'finished', 'on-hold', 'dnf'), // Did Not Finish
      defaultValue: 'to-read',
      allowNull: false,
    },
    userRating: { // User's personal rating for this book
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1, max: 5 },
    },
    userNotes: { // User's personal notes for this book
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Timestamps will be added by Sequelize by default
  });

  UserBook.associate = (models) => {
    UserBook.belongsTo(models.User, { foreignKey: 'userId' });
    UserBook.belongsTo(models.Book, { foreignKey: 'bookId' });
  };

  return UserBook;
};