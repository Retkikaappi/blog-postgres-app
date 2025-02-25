const router = require('express').Router();
const { Blog } = require('../models');
const { findByPk } = require('../models/blog');

router.get('/', async (req, resp) => {
  const blogs = await Blog.findAll();
  resp.json(blogs);
});

router.post('/', async (req, resp, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    resp.json(newBlog);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const extractor = async (req, resp, next) => {
  const blog = await Blog.findByPk(req.params.id);

  req.blog = blog;
  next();
};

router.get('/:id', extractor, async (req, resp) => {
  resp.json(req.blog);
});

router.put('/:id', extractor, async (req, resp, next) => {
  try {
    const updatedBlog = await req.blog.update({ likes: req.body.likes });
    resp.json({ likes: updatedBlog.likes });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', extractor, async (req, resp) => {
  const blogToDelete = req.blog;

  try {
    console.log('Deleting', JSON.stringify(blogToDelete, null, 2));
    await blogToDelete.destroy();
    resp.status(204).end();
  } catch (error) {
    console.error(error);
    resp.status(400).json({ error });
  }
});

module.exports = router;
