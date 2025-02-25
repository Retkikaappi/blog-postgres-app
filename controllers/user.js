const router = require('express').Router();
const { User, Blog } = require('../models');

router.get('/', async (req, resp) => {
  const users = await User.findAll({
    attributes: { exclude: ['blogId'] },
    include: {
      model: Blog,
      attributes: ['title', 'url', 'likes'],
    },
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
