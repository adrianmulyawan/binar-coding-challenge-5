'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: 'user_id',
        as: 'profile'
      });

      User.hasMany(models.Room, {
        foreignKey: 'user_id',
        as: 'rooms'
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('USER', 'ADMIN')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};