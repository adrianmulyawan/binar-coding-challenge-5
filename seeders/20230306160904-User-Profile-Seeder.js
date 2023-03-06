'use strict';

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
    await queryInterface.bulkInsert('Profiles', [
      {
        user_id: 1,
        fullname: 'Natasha Putri',
        email: 'natashaputri@gmail.com',
        address: 'Jl Kebenaran No 666',
        phone_number: '089640001855',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 2,
        fullname: 'Rike Diyah S',
        email: 'rikedyas@gmail.com',
        address: 'Jl Kebenaran No 666',
        phone_number: '089640001855',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 3,
        fullname: 'Toni Purwanto',
        email: 'tonipurwanto666@gmail.com',
        address: 'Jl Kebenaran No 666',
        phone_number: '089640001855',
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
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};
