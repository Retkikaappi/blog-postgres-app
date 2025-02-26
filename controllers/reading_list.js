const router = require('express').Router();
const { ReadingList } = require('../models');
const { userExtractor } = require('../utils/middleware');

router.post('/', async (req, resp, next) => {
  try {
    const listItem = await ReadingList.create(req.body);
    resp.json(listItem);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', userExtractor, async (req, resp, next) => {
  try {
    const item = await ReadingList.findByPk(req.params.id);
    //kind of confusing to mix read and isRead, but I am keeping it
    if (req.user.id !== item.userId) {
      resp.status(401).json({
        error: 'You can only mark your own readinglist items as read',
      });
      return;
    }
    const updatedItem = await item.update({ isRead: req.body.read });
    resp.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
