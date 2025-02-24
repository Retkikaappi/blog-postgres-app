require('dotenv').config();
const express = require('express');
const app = express();
const { Sequelize, Model, DataTypes } = require('sequelize');

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

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
      default: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog',
  }
);

Blog.sync();

app.get('/api/blogs', async (req, resp) => {
  const blogs = await Blog.findAll();
  resp.json(blogs);
});

app.post('/api/blogs', async (req, resp) => {
  try {
    const newBlog = await Blog.create(req.body);
    resp.json(newBlog);
  } catch (error) {
    console.error(error);
    resp.status(400).json({ error });
  }
});

app.delete('/api/blogs/:id', async (req, resp) => {
  const blogToDelete = await Blog.findByPk(req.params.id);
  if (blogToDelete) {
    try {
      console.log('Deleting', JSON.stringify(blogToDelete, null, 2));
      await blogToDelete.destroy();
      resp.status(204).end();
    } catch (error) {
      console.error(error);
      resp.status(400).json({ error });
    }
  } else {
    resp.status(400).json({ error: 'Blog not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
