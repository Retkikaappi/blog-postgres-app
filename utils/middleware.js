const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const userExtractor = (req, resp, next) => {
  const bearer = req.get('authorization');
  if (bearer && bearer.startsWith('Bearer ')) {
    try {
      const user = jwt.verify(bearer.replace('Bearer ', ''), SECRET);
      req.user = user;
    } catch (error) {
      next(error);
    }
  } else {
    resp.status(400).json({ error: 'Missing authorization' });
    return;
  }

  next();
};

const errorMiddleware = (error, req, resp, next) => {
  console.log('mware error', error, error.name);
  console.log('-----------------------');
  if (error.name === 'SequelizeValidationError') {
    const errMsg = error.errors.map((e) => e.message);
    resp.status(400).json({ error: errMsg });
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    const errMsg = error.errors.map((e) => e.message);
    resp.status(400).json({ error: errMsg });
  } else if (error.name === 'TypeError') {
    resp
      .status(400)
      .json({ error: 'Cannot find an entry with that parameter' });
  } else if (error.name === 'JsonWebTokenError') {
    resp.status(400).json({ error: 'Invalid token' });
  }

  next(error);
};

module.exports = { errorMiddleware, userExtractor };
