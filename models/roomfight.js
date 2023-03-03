'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomFight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoomFight.init({
    room_id: DataTypes.INTEGER,
    pil_user_1: DataTypes.STRING,
    pil_user_2: DataTypes.STRING,
    winner_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RoomFight',
  });
  return RoomFight;
};