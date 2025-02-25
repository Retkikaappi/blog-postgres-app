const router = require('express').Router();
const { User } = require('../models');
const jws = require('jsonwebtoken');
const { PASS, SECRET } = require('../utils/config');

router.post('/', async (req, resp, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    const correctPass = req.body.password === PASS;

    if (!(correctPass && user)) {
      resp.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jws.sign({ username: user.username, id: user.id }, SECRET);
    resp.json(token);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
