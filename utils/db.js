const { Sequelize, Model, DataTypes } = require('sequelize');
const { DATABASE_URL } = require('./config');
const { Umzug, SequelizeStorage } = require('umzug');

const sequelize = new Sequelize(DATABASE_URL);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Connected to DB');
  } catch (error) {
    console.log('Connection failed error:', error);
    return process.exit(1);
  }

  return null;
};

const migrationConfig = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig);

  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((e) => e.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConfig);
  await migrator.down();
};

module.exports = { sequelize, connectDB, rollbackMigration };
