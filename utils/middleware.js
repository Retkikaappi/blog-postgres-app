const errorMiddleware = (error, req, resp, next) => {
  console.log('mware error', error);
  console.log(error.name);
  console.log('-----------------------');
  if (error.name === 'SequelizeValidationError') {
    resp.status(400).json({ error: 'Missing a field' });
  } else if (error.name === 'TypeError') {
    resp.status(400).json({ error: 'Cannot find blog with that ID' });
  }

  next(error);
};

module.exports = { errorMiddleware };
