'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.User, {
        foreignKey: 'user_id_1',
        as: 'userId1'
      });

      Room.belongsTo(models.User, {
        foreignKey: 'user_id_2',
        as: 'userId2'
      });

      Room.hasMany(models.RoomFight, {
        foreignKey: 'room_id',
        as: 'roomfights'
      });
    }
  }
  Room.init({
    room_code: DataTypes.STRING,
    user_id_1: DataTypes.INTEGER,
    user_id_2: DataTypes.INTEGER,
    start_fight: DataTypes.DATE,
    finish_fight: DataTypes.DATE,
    winner_user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};