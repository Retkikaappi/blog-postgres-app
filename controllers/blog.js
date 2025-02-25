const router = require('express').Router();
const { Blog, User } = require('../models');
const { userExtractor } = require('../utils/middleware');

router.get('/', async (req, resp) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
  });
  resp.json(blogs);
});

router.post('/', userExtractor, async (req, resp, next) => {
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

router.put('/:id', paramExtractor, async (req, resp, next) => {
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
