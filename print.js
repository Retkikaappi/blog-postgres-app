require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const print = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    });
    blogs.forEach((e) =>
      console.log(`${e.author}: "${e.title}", ${e.likes} likes`)
    );
    sequelize.close();
  } catch (error) {
    console.error(error);
  }
};

print();
