'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const passwordUser = '12345678';
const saltRounds = +process.env.SALT_ROUND;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        username: 'adminbinar',
        password: await bcrypt.hash(passwordUser, saltRounds),
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'rikediah',
        password: await bcrypt.hash(passwordUser, saltRounds),
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'tonipurwanto',
        password: await bcrypt.hash(passwordUser, saltRounds),
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
