const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, resp, next) => {
  try {
    const listItem = await ReadingList.create(req.body);
    resp.json(listItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
