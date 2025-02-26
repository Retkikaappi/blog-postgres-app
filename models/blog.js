const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: DataTypes.STRING,
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    yearWritten: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: 2025,
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'blog',
  }
);

module.exports = Blog;
