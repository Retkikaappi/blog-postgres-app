const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const { sequelize } = require('../utils/db');

router.get('/', async (req, resp) => {
  const blogsByAuthor = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: ['author'],
    order: [['likes', 'DESC']],
  });
  resp.json(blogsByAuthor);
});

module.exports = router;
