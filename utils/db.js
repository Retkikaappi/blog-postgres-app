const { Sequelize, Model, DataTypes } = require('sequelize');
const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL);

const connectDB = async () => {
  try {
    sequelize.authenticate();
    console.log('Connected to DB');
  } catch (error) {
    console.log('Error:', error);
    return process.exit(1);
  }

  return null;
};

module.exports = { sequelize, connectDB };
