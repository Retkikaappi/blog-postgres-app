const router = require('express').Router();
const { User, Blog, ReadingList } = require('../models');

router.get('/', async (req, resp) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'yearWritten', 'userId'],
        },
        through: {
          as: 'listInfo',
          attributes: {
            exclude: ['userId', 'blogId'],
            include: ['isRead'],
          },
        },
      },
    ],
  });
  resp.json(users);
});

router.post('/', async (req, resp, next) => {
  try {
    const newUser = await User.create(req.body);
    resp.json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:username', async (req, resp, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Blog,
          as: 'readingList',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'yearWritten', 'userId'],
          },
          through: {
            as: 'listInfo',
            attributes: {
              exclude: ['userId', 'blogId'],
              include: ['isRead'],
            },
          },
        },
      ],
    });
    resp.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:username', async (req, resp, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    });
    const updatedUser = await user.update(req.body);
    resp.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
