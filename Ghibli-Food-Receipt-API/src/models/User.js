// src/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Will be true if using Auth0 and not storing passwords
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'guest'),
      defaultValue: 'user',
    },
    // Add other fields from "User Profile" section if needed
    // e.g., profilePictureUrl: DataTypes.STRING,
    // bio: DataTypes.TEXT,
  });

  User.associate = (models) => {
    // A User can create/own many Books
    User.hasMany(models.Book, {
      foreignKey: 'userId',
      as: 'createdBooks',
    });
    // User has many entries in UserBook (their library)
    User.hasMany(models.UserBook, {
      foreignKey: 'userId',
      as: 'libraryEntries',
    });
    // Optional: Through association for convenience
    // User.belongsToMany(models.Book, {
    //   through: models.UserBook, // or just models.UserBook if it's in db
    //   foreignKey: 'userId',
    //   otherKey: 'bookId',
    //   as: 'libraryBooks'
    // });
  };
  
  return User;
};