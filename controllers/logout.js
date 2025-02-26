const router = require('express').Router();
const { User, Session } = require('../models');
const { userExtractor } = require('../utils/middleware');

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

    const activateSesh = await Session.findOne({ where: { userId: user.id } });

    if (!activateSesh) {
      await Session.create({ user_id: user.id });
    }

    const token = jws.sign({ username: user.username, id: user.id }, SECRET);
    resp.json(token);
  } catch (error) {
    next(error);
  }
});

router.delete('/', userExtractor, async (req, resp) => {
  const sesh = await Session.findOne({ where: { userId: req.user.id } });

  if (!sesh) {
    resp.status(200).json({ message: 'Already logged out' });
    return;
  }

  await sesh.destroy();
  resp.status(200).json({ message: 'Log out succesful' });
});

module.exports = router;
