const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year_written', {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: 2025,
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year_written');
  },
};
