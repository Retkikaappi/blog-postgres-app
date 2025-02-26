const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../utils/db');

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'user', key: 'id' },
    },
    exipres: {
      type: DataTypes.DATE,
      defaultValue: Date.now() + 1800000,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamp: true,
    modelName: 'session',
  }
);

module.exports = Session;
