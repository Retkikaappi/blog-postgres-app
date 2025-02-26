const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { Session } = require('../models');

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

// checks if there is an active session
const checkSession = async (req, resp, next) => {
  try {
    console.log(req.user.id);
    const activateSesh = await Session.findOne({
      where: { userId: req.user.id },
    });
    if (!activateSesh) {
      resp.status(401).json({ error: 'Session expired please log in again' });
    }
  } catch (error) {
    next(error);
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

module.exports = { errorMiddleware, userExtractor, checkSession };
