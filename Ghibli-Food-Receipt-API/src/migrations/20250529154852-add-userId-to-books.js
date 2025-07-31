// src/migrations/YYYYMMDDHHMMSS-add-userId-to-books.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Books", "userId", {
      // Assuming your table is named 'Books'
      type: Sequelize.UUID,
      allowNull: true, // Or false if every book MUST have an owner from the start
      references: {
        model: "Users", // Name of the Users table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Or 'CASCADE' to delete books if user is deleted, or 'RESTRICT'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Books", "userId");
  },
};
