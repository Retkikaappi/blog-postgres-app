const router = require('express').Router();
const { ReadingList } = require('../models');
const { findByPk } = require('../models/blog');

router.post('/', async (req, resp, next) => {
  try {
    const listItem = await ReadingList.create(req.body);
    resp.json(listItem);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, resp, next) => {
  console.log(req.params.id, req.body.read);
  try {
    const item = await ReadingList.findByPk(req.params.id);
    const updatedItem = await item.update({ isRead: req.body.read });
    resp.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
