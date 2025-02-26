const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const { userExtractor, checkSession } = require('../utils/middleware');

router.get('/', async (req, resp) => {
  let where = {};
  //iLike was advertised as case insensitive, but it does not really work
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search.toLowerCase(),
          },
        },
        {
          author: {
            [Op.substring]: req.query.search.toLowerCase(),
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
    order: [['likes', 'DESC']],
    where,
  });
  resp.json(blogs);
});

router.post('/', userExtractor, checkSession, async (req, resp, next) => {
  try {
    const newBlog = await Blog.create({ ...req.body, userId: req.user.id });
    resp.json(newBlog);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const paramExtractor = async (req, resp, next) => {
  const blog = await Blog.findByPk(req.params.id);

  req.blog = blog;
  next();
};

router.get('/:id', paramExtractor, async (req, resp) => {
  resp.json(req.blog);
});

router.put('/:id', paramExtractor, checkSession, async (req, resp, next) => {
  try {
    const updatedBlog = await req.blog.update({ likes: req.body.likes });
    resp.json({ likes: updatedBlog.likes });
  } catch (error) {
    next(error);
  }
});

router.delete(
  '/:id',
  userExtractor,
  checkSession,
  paramExtractor,
  async (req, resp, next) => {
    const blogToDelete = req.blog;
    try {
      if (blogToDelete.userId === req.user.id) {
        await blogToDelete.destroy();
        resp.status(204).end();
      } else {
        resp.status(400).json({ error: 'Only blog creator can delete blog' });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
