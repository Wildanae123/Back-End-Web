// src/migrations/YYYYMMDDHHMMSS-create-user-books-join-table.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserBooks', { // Choose your table name
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Name of the Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // If a User is deleted, their library entries are removed
      },
      bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Books', // Name of the Books table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // If a Book is deleted, its library entries are removed
      },
      status: {
        type: Sequelize.ENUM('to-read', 'reading', 'finished', 'on-hold', 'dnf'),
        allowNull: false,
        defaultValue: 'to-read',
      },
      userRating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { // These validations are primarily for the model, but good to note
          min: 1,
          max: 5,
        },
      },
      userNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Optional: Add a unique constraint to prevent a user from adding the same book multiple times
    await queryInterface.addConstraint('UserBooks', {
      fields: ['userId', 'bookId'],
      type: 'unique',
      name: 'user_book_unique_constraint',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserBooks');
  }
};